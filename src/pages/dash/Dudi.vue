<template lang="pug">
  div
    v-layout(row dark)
      v-flex(xs6 offset-xs1)
        v-card(flat)
          v-spacer
          v-btn(color="primary" flat dark @click.native="[dialog=true, add=true]" class="mb-2") <i class="fa fa-building"></i> &nbsp;Tambah Dudi
          v-btn(color="success" flat @click.native="cetak_data")
            i.fa.fa-print
            | &nbsp; Cetak
          v-btn(color="red" flat @click.native="export_xls")
            i.fa.fa-table
            | &nbsp; Export
      v-flex(xs3)
        v-card(flat)
          input(type="file" ref="dudiFile" style="display:none" @change="onFilePicked")
          v-text-field(append-icon="mdi-attachment" label="Ambil File xls/xlsx" @click.native="pickFile" v-model="filename")
      v-flex(xs2)
        v-card(flat)
          v-btn(color="blue" flat @click.native="import_dudi")
            v-icon mdi-import
            | &nbsp; Import
    v-layout(row)
      v-flex(xs10 offset-xs1)
        v-card.cetak_tabel
          v-card-title 
            h3 Data DU/DI
            v-spacer
            v-text-field.no-print(append-icon="fa fa-search" label="Pencarian" single-line hide-details v-model="search")
          //- v-layout(row)
          //-   v-flex(xs4 offset-xs8)
          //-     v-switch(:label="`Dudi Aktif: ${dudiaktif.toString()}`" v-model="dudiaktif" label="Yang memiliki Pembimbing")  
          div#printableTable
            <v-dialog v-model="dialog" max-width="500px" persistent>
              //- <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field id="_id" label="Kode Dudi" v-model="editedDudi._id" required :rules="[rules.required]" @blur="lastDudi" append-icon="fa fa-qrcode"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm8 md8>
                        <v-text-field label="Nama Dudi" v-model="editedDudi.namaDudi" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-building"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Alamat" v-model="editedDudi.alamat" multi-line rows="3" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-map-signs"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-text-field label="Kota" v-model="editedDudi.kota" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-map-marker" ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-text-field label="No. Telp" v-model="editedDudi.telp" required validate-on-blur :rules="[rules.required]" append-icon="mdi-phone" ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md8>
                        <v-text-field label="Pemilik" v-model="editedDudi.pemilik" required validate-on-blur :rules="[rules.required]" append-icon="mdi-account-circle" ></v-text-field>
                      </v-flex>
                      //- <v-flex xs12 sm6 md8>
                      //-   <v-select append-icon="fa fa-angle-down" v-bind:items="gurus" v-model="editedDudi._guru" label="Pilih Guru" item-text="nama" item-value="_id" return-object :hint="`${selGuru.nama}, ${selGuru._id}`" input="selGuru._id" persistent-hint autocomplete v-bind:value="editedDudi._guru"></v-select>
                      //- </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save" v-if="add">Simpan</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="update" v-if="!add">Perbarui</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            v-data-table#tbl_dudi(:headers="headers" :items="dudist" :search="search" sort-icon="fa fa-sort" next-icon="fa fa-angle-double-right" prev-icon="fa fa-angle-double-left")
              template(slot="items" slot-scope="props")
                td {{ props.index+1 }}
                td {{ props.item._id }}
                td.text-xs-right {{ props.item.namaDudi }}
                <td class="text-xs-left">{{ props.item.alamat }}</td>
                <td class="text-xs-center">{{ props.item.kota }}</td>
                <td class="text-xs-center">{{ props.item.telp }}</td>
                <td class="text-xs-center">{{ props.item.pemilik }}</td>
                //- <td class="text-xs-center" >
                //-     <span v-if="props.item._guru == undefined">Kosong</span>
                //-     <span v-else>{{props.item._guru.nama}}</span>
                //- </td>
                <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click.native="editItem(props.item)">
                    <v-icon color="teal">fa-pencil</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click.native="deleteItem(props.item)">
                    <v-icon color="pink">fa-trash</v-icon>
                  </v-btn>
                </td>
              v-alert(slot="no-results" :value="true" color="error" icon="warning")
                | Pencarian Anda akan "{{ search }}" tidak ditemukan.
    <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
    <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" v-model="snackbar.model" top>
      <h4>{{snackbar.text}}</h4>
      <v-btn dark flat @click.native="gantikode">Tidak</v-btn>
      <v-btn dark flat @click.native="snackbar.model = false">&times;</v-btn>
    </v-snackbar>      
</template>


<script>
import axios from 'axios'
export default {
  data() {
      return {
        add: true,
        snackbar: {
          model: false,
          timeout: 2000,
          color: '',
          text: ''
        },
        editedIndex: -1,
        dialog: false,
        // formTitle: 'Edit Dudi',
        editable: false,
        dudiaktif: false,
        text: 'Coba-coba',
        token: sessionStorage.getItem("token"),
        search: '',
        headers:[
          {
            text: 'No',
            align: 'left',
            sortable: false,
            value: 'index'
          },
          { text: 'Kode Dudi', value: '_id' },
          { text: 'Nama Dudi', value: 'namaDudi' },
          { text: 'Alamat', value: 'alamat' },
          { text: 'Kota', value: 'kota' },
          { text: 'No. Telp', value: 'telp' },
          { text: 'Pemilik', value: 'pemilik' },
          // { text: 'Pembimbing', value: '_guru' },
          { text: 'Action', value: '_id' },

        ],
        dudi: '',
        dudis: [],
        editedDudi: {
          '_id': '',
          'namaDudi': '',
          'alamat': '',
          'kota': '',
          'telp': '',
          'pemilik': ''
          // '_guru': ''
        },
        defaultDudi: {
          '_id': '',
          'namaDudi': '',
          'alamat': '',
          'kota': '',
          'telp': '',
          'pemilik': ''
          // '_guru': ''
        },
        rules:{
          required: (value) => !!value || 'Harus diisi'
        },
        gurus:[],
        selGuru: { nama: 'Pilih Guru', _id: 'default'},
        gantikode: true,
        filename: '',
        fileUrl: '',
        newDudis: []
      }
  },
  created(){
    this.getDudis();
    this.getGurus();
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.dudis.indexOf(item)
      this.editedDudi = Object.assign({}, item)
      if (item._guru == null) {
        this.editedDudi._guru = '0'
        this.selGuru._id = 'default';
        this.selGuru.nama = 'Pilih Guru';
      } 
      this.selGuru._id = this.editedDudi._guru._id;
      this.selGuru.nama = this.editedDudi._guru.nama;
      this.add = false;
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.dudis.indexOf(item)
      confirm('Yakin Menghapus Du/Di ini?') && this.dudis.splice(index, 1)
    },
    getDudis() {
      var self = this;
      axios.get('http://localhost:4567/api/dudis', {headers: {'X-Access-Token': self.token}})
        .then(function(res){
          self.dudis = res.data;
          // console.log(res.data);
        });
    },
    cetak_data(){
         window.frames["print_frame"].document.head.innerHTML = "<style>table{width: 100%;}table, th,td{border:1px solid #666;border-collapse:collapse;} td{padding: 2px 5px;word-wrap: wrap} .datatable__actions,th i{display:none} </style>";
         window.frames["print_frame"].document.body.innerHTML += "<h3 style='text-align:center'>DATA DU/DI</h3>";
         window.frames["print_frame"].document.body.innerHTML += document.getElementById("printableTable").innerHTML;
         window.frames["print_frame"].window.focus();
         window.frames["print_frame"].window.print();
    },
    export_xls() {
          var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
          var textRange; var j=0;
          var tab = document.getElementById('tbl_dudi'); // id of table
          var rows = tab.getElementsByTagName("tr");

          for(j = 0 ; j < rows.length ; j++) 
          {     
            // console.log(rows);
              tab_text=tab_text+rows[j].innerHTML+"</tr>";
              //tab_text=tab_text+"</tr>";
          }

          tab_text=tab_text+"</table>";
          tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
          tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
          tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

          var ua = window.navigator.userAgent;
          var msie = ua.indexOf("MSIE "); 

          if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
          {
              txtArea1.document.open("txt/html","replace");
              txtArea1.document.write(tab_text);
              txtArea1.document.close();
              txtArea1.focus(); 
              sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
          }  
          else                 //other browser not tested on IE 11
          var  sa = window.open("data:application/vnd.ms-excel;charset=UTF-8;," + encodeURIComponent(tab_text));  

          return (sa);
    },
    close () {
        this.dialog = false
        this.add = !this.add;
        setTimeout(() => {
          this.editedDudi = Object.assign({}, this.defaultDudi)
          this.editedIndex = -1
          this.selGuru = Object.assign({_id: 'Default', nama: 'Pilih Guru'})
          
          this.getDudis();
          this.getGurus();
        }, 300)
    },
    save () {
      var self = this;
      var data = self.editedDudi;
      var dudi = {
        _id : data._id,
        namaDudi: data.namaDudi,
        alamat: data.alamat,
        kota: data.kota,
        telp: data.telp,
        pemilik: data.pemilik
        // _guru: data._guru._id
      }
      axios.post('http://localhost:4567/api/newdudi', dudi, {headers:{'X-Access-Token': self.token}})
           .then((res)=>{
            if(res.data == 'ok_add') 
              self.close();
           });

    },
    update(){
      var self = this;
      var data = self.editedDudi;
      var dudi = {
        _id : data._id,
        namaDudi: data.namaDudi,
        alamat: data.alamat,
        kota: data.kota,
        telp: data.telp,
        pemilik: data.pemilik
        // _guru: data._guru._ids
      }
      axios.post('http://localhost:4567/api/upddudi', dudi, {headers:{'X-Access-Token': self.token}})
           .then((res)=>{
            if(res.data == 'ok_upd') 
              self.close();
           });
    },
    lastDudi(){
      var self = this;
      var id = self.editedDudi._id;
      var kode = id.substring(0,2);
      const pattern = /D+(M|T|O)+[0-9]/g
            // return pattern.test(value) || 'Diawali DM | DT | DO'
      if (!pattern.test(id)){
        self.snackbar = {
              text: 'Kode DU/Di diawali dengan huruf DM | DT | DO',
              model: true,
              color: 'error'
            }
        return false;
      } else {
      
        axios.get('http://localhost:4567/api/getlastdudi?kode='+kode, {headers: {'X-Access-Token': self.token}})
          .then((res) => {
            var lastdudi = res.data[0]._id;
            var nmr = lastdudi.substr(2,4);
            var Num = (Number(nmr)+1);
            var str = Num.toString();
            var newkode = str.length == 1 ? kode+'000'+str: str.length == 2 ? kode+'00'+str: str.length == 3 ? kode+'0'+str:kode+str;
            self.snackbar = {
              text: 'Kode Du/Di yang tersedia untuk progli tersebut saat ini: '+ newkode +'. Gunakan saran kami?' ,
              model: true,
              color: 'info',
              timeout: 5000
            }
            self.editedDudi._id = newkode;
            
          });
      }
    },
    getGurus(){
      var self = this;
      axios.get('http://localhost:4567/api/getgurus', {headers: {'X-Access-Token': self.token}})
           .then((res) => {
              self.gurus = res.data;

           });
    },
    pickFile(){
      this.$refs.dudiFile.click();
    },
    onFilePicked(e){
      var self = this;
      var files = e.target.files,
          fileUri = '',
          filename = files[0].name;
      self.filename = filename;
      const filereader = new FileReader();
      filereader.addEventListener('load', () => {
        self.fileUrl = filereader.result;
      });
      filereader.readAsDataURL(files[0]);
      self.file = files[0];
    },
    import_dudi(){
      var self = this;
      var url = self.fileUrl;
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";

      req.onload = function(e){
        var data = new Uint8Array(req.response);
        var workbook = XLSX.read(data, {type: "array"});

        var first_sheet_name = workbook.SheetNames[0];
        var ws = workbook.Sheets[first_sheet_name];
        var newDudis = XLSX.utils.sheet_to_json(ws);
        axios.post('http://localhost:4567/api/importdudis', newDudis, {headers: {'X-Access-Token': self.token}}).then((res)=>{
          self.getDudis();
          self.fileUrl = '';
        })
        // self
      };
      req.send();
    }

  },
  computed: {
    dudist() {
      var isActive = this.dudiaktif;
      return this.dudis.filter((i) => {
        if (isActive == false) {
          return i;
        } else {
          return i._guru !== null;
        }
      })
    },
    formTitle () {
        return this.editedIndex == -1 ? 'Tambah Dudi' : 'Edit Dudi'
      }
  }
}
</script>


<style id="dataStyle">
#printableTable h4{
  display: none;
}
.datatable{
  border: 1px solid #666;
}
.datatable th, td{
  border: 1px solid #666;
}
@media print{
  *{
    display: none;
  }
  /* .cetak_tabel{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
  } */
  /* .s */
  #printableTable > table{
    display: block;
  }
}
</style>