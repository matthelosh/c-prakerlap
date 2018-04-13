<template lang="pug">
  div
    v-layout(row)
      v-flex(xs6)
        v-btn(color="primary" flat @click.native="[dialog=true, add=true]") 
          i.fa.fa-child
          | &nbsp; Tambah Praktikan
        v-btn(color="teal" @click.native="cetak_data" flat)
          i.fa.fa-print
          | &nbsp; Cetak
        v-btn(color="warning" @click.native="export_xls" flat)
          v-icon mdi-file-excel-box
          | &nbsp; Export
      v-flex(xs2)
        input(type="file" ref="fileUpload" @change="onFilePicked" style="display:none")
  
        v-text-field(@click.native="pickFile" color="green" flat append-icon="mdi-attachment" label="Pilih file Excel" v-model="filename")
          v-icon mdi-file-excel-box
          | &nbsp; Import XLS
      v-flex(xs2)
        v-btn(color="blue" flat @click.native="import_xls")
          v-icon mdi-file-import
          | &nbsp; Import
      //- <vue-xlsx-table @on-select-file="handleSelectedFile"></vue-xlsx-table>
    v-layout(row)
      #tes
    v-layout(row)
      v-flex(xs-12)
        v-card
          v-card-title
            h4 Data Praktikan
            v-spacer
            v-text-field.no-print(append-icon="fa fa-search" label="Pencarian" single-line hide-details v-model="search")
            <v-dialog v-model="dialog" max-width="500px">
              //- <!-- <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn> -->
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="NIS" v-model="editedSiswa._id"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Username" v-model="editedSiswa.uname"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Password" v-model="editedSiswa.password"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm8 md8>
                        <v-text-field label="Nama" v-model="editedSiswa.nama"></v-text-field>
                      </v-flex>
                      
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Kelas" v-model="editedSiswa.kelas"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="No. HP" v-model="editedSiswa.hp"></v-text-field>
                      </v-flex>
                      //- <v-flex xs12 sm8 md8>
                      //-   <v-select append-icon="fa fa-angle-down" v-bind:items="gurus" v-model="editedSiswa._guru" label="Pilih Guru" item-text="nama" item-value="_id" return-object :hint="`${selGuru.nama}, ${selGuru._id}`" input="selGuru._id" persistent-hint autocomplete v-bind:value="editedSiswa._guru"></v-select>
                      //- </v-flex>
                      //- <v-flex xs12 sm12 md12>
                      //-   <v-select append-icon="fa fa-angle-down" v-bind:items="dudis" v-model="editedSiswa._dudi" label="Pilih Dudi" item-text="namaDudi" item-value="_id" return-object :hint="`${selDudi.namaDudi}, ${selDudi._id}`" input="selDudi._id" persistent-hint autocomplete v-bind:value="editedSiswa._dudi"></v-select>
                      //- </v-flex>
                      

                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">Batal</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save" v-if="add">Simpan</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="update" v-if="!add">Perbarui</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          #printableTable
            v-data-table#tbl_praktikan(:headers="headers" :items="siswas" :search="search" sort-icon="fa fa-sort" next-icon="fa fa-angle-double-right" prev-icon="fa fa-angle-double-left" loading="true")
                  template(slot="items" slot-scope="props")
                    td {{ props.index+1 }}
                    td.text-xs-center {{ props.item._id}}
                    td.text-xs-left {{ props.item.nama }}
                    td.text-xs-left {{ props.item.kelas }}
                    td.text-xs-left {{ props.item.progli }}
                    td {{ props.item.hp }}
                    //- td 
                    //-   span(v-if="props.item._dudi == null || props.item._dudi == '' || props.item._dudi == '0'|| props.item._dudi === false") {{ props.item._dudi == 'Kosong'}}
                    //-   span(v-else) {{ props.item._dudi.namaDudi }}
                    //- td 
                    //-   span(v-if="props.item._guru == null || props.item._guru == '' || props.item._guru == '0'|| props.item._guru === false") Kosong
                    //-   span(v-else) {{ props.item._guru.nama}}
                    td.justify-center.layout.px-0

                      v-btn(icon class="mx-0" @click.native="editItem(props.item)")
                        v-icon(color="teal" ) fa-pencil
                          
                      v-btn(icon class="mx-0" @click.native="deleteItem(props.item)")
                        v-icon(color="pink") fa-trash
                          
                  v-alert(slot="no-results" :value="true" color="error" icon="warning")
                    | Pencarian Anda akan "{{ search }}" tidak ditemukan.
  
    <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
</template>

<script>
import axios from 'axios'
// import XLSX from 'xlsx'
export default {
  // components:{fileInput},
  data() {
    return {
      formData:'',
      file: '',
      fileUrl: '',
      filename: '',
      selSiswa: [],
      add: '',
      selDudi: { namaDudi: 'Pilih Dudi', _id: 'default'},
      selGuru: { nama: 'Pilih Guru', _id: 'default'},
      dialog: false,
      editedIndex: -1,
      editable: false,
      search: '',
      token: sessionStorage.getItem('token'),
      siswas: [],
      editedSiswa: {
        _id: '',
        uname: '',
        password: '',
        kelas: '',
        periode: '',
        nama: '',
        progli: '',
        hp: '',
        // _dudi: {},
        // _guru: {},
        _role: '3'
      },
      defaultSiswa: {
        _id: '',
        uname: '',
        password: '',
        kelas: '',
        periode: '',
        nama: '',
        progli: '',
        hp: '',
        // _dudi: {},
        // _guru: {},
        _role: '3'
      },
      dudis:[],
      gurus:[],

      // _id":"u4474","uname":"u4474","password":"p4474","kelas":"XI MM 3","periode":"10-2","nama":"RATU ATHAYA HANA M A","progli":"mm","hp":"6288888888888","_dudi":"DM0026","_guru":"gm08","_role":"3"}
      headers: [
        {
            text: 'No',
            align: 'left',
            sortable: false,
            value: 'index'
          },
          { text: 'NIS', value: '_id' },
          { text: 'Nama', value: 'nama' },
          { text: 'Kelas', value: 'kelas' },
          { text: 'Progli', value: 'progli' },
          { text: 'No. HP', sortable: false, value: 'hp' },
          // { text: 'Dudi', sortable: false, value: '_dudi.namaDudi' },
          // { text: 'Pembimbing', sortable: true, value: '_guru.nama' },
          { text: 'Aksi', sortable: false, value: '_id' }
      ],
      newSiswas: []
    }
    
  },
  created(){
    this.getSiswas();
    this.getDudis();
    this.getGurus();
  },
  // watch() {
  //   dialog(val) {
  //     val || this.close();
  //   }
  // },
  methods: {
    getDudis(){
      var self = this;
      axios.get('http://localhost:4567/api/dudis', {headers: {'X-Access-Token': self.token}})
           .then((res) => {
              self.dudis = res.data;

           });
    },
    getGurus(){
      var self = this;
      axios.get('http://localhost:4567/api/getgurus', {headers: {'X-Access-Token': self.token}})
           .then((res) => {
              self.gurus = res.data;

           });
    },

    editItem (item) {
        this.editedIndex = this.siswas.indexOf(item)
        this.editedSiswa = Object.assign({}, item)
        // this.selDudi._id = this.editedSiswa._dudi._id;
        if (item._dudi == null){
          this.editedSiswa._dudi = '0'
          this.selDudi._id = 'default';
          this.selDudi.namaDudi = 'Pilih Dudi';
        }
        if (item._guru == null) {
          this.editedSiswa._guru = '0'
          this.selGuru._id = 'default';
          this.selGuru.nama = 'Pilih Guru';
        }
        this.selDudi._id = this.editedSiswa._dudi._id;
        this.selDudi.namaDudi = this.editedSiswa._dudi.namaDudi;
        this.selGuru._id = this.editedSiswa._guru._id;
        this.selGuru.nama = this.editedSiswa._guru.nama;
        this.dialog = true
        

    },

    deleteItem (item) {
      const index = this.siswas.indexOf(item)
      confirm('Yakin Menghapus Siswa: '+ item.nama+' ini?') 
      // && this.siswas.splice(index, 1)
      var self = this;
      var data = {_id: item._id};
      axios.post('http://localhost:4567/api/delsiswa', data, {headers: {'X-Access-Token': self.token}}). then((res) => {
        if(res.data == 'ok_del'){
          self.close();
        }
      });
    },
    getSiswas(){
      var self = this;
      axios.get('http://localhost:4567/api/getsiswas', {headers: {'X-Access-Token': self.token}})
           .then((res) => {
            self.siswas = res.data;
            var data = res.data;
           });
    },
    cetak_data(){
         window.frames["print_frame"].document.head.innerHTML = "<style>table{width: 100%;}table, th,td{border:1px solid #666;border-collapse:collapse;} td{padding: 2px 5px;word-wrap: wrap} .datatable__actions,th i{display:none} </style>";
         window.frames["print_frame"].document.body.innerHTML += "<h3 style='text-align:center'>DATA Praktikan</h3>";
         window.frames["print_frame"].document.body.innerHTML += document.getElementById("printableTable").innerHTML;
         window.frames["print_frame"].window.focus();
         window.frames["print_frame"].window.print();
    },
    export_xls() {
          var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
          var textRange; var j=0;
          var tab = document.getElementById('tbl_praktikan'); // id of table
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
          tab_text= tab_text.replace(/[arrow]*>/gi,""); // remove if u want images in your table
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
        setTimeout(() => {
          this.editedSiswa = Object.assign({}, this.defaultSiswa)
          this.selDudi = Object.assign({_id: 'Default', namaDudi: 'Pilih Dudi'})
          this.selGuru = Object.assign({_id: 'Default', nama: 'Pilih Guru'})
          this.editedIndex = -1
          this.add = false;
          this.getSiswas();
          this.getDudis();
          this.getGurus();
        }, 300)
    },
    save () {
      var self = this;
      var data = self.editedSiswa;
      axios.post('http://localhost:4567/api/newsiswa', data, {headers: {'X-Access-Token': self.token}})
          .then((res) => {
            if (res.data == 'ok_save'){
              self.close();
            }
          });
    },
    update () {
      var self = this;
      var data = self.editedSiswa;
      axios.put('http://localhost:4567/api/siswa', data, {headers: {'X-Access-Token': self.token}})
          .then((res) => {
            if ( res.data == 'ok_upd') {
              self.close();
            }
          });
    },
    // update_all() {
    //   var self = this;
    //   var data = self.siswas;
    //   axios.put('http://localhost:4567/api/updallsiswas', data, {headers: {'X-Access-Token': self.token}})
    //       .then((res) => {
    //         console.log(res);
    //       });
    // },
    pickFile(){
      this.$refs.fileUpload.click();
    },
    onFilePicked(event){
      var files = event.target.files;
      let filename = files[0].name;
      this.filename = filename;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.fileUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.file = files[0];
    },
    import_xls(){
      var self = this;
      var url = self.fileUrl;

// /* set up async GET request */
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";

      req.onload = function(e) {
        var data = new Uint8Array(req.response);
        var workbook = XLSX.read(data, {type:"array"});

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var newSiswas = XLSX.utils.sheet_to_json(worksheet);
        self.newSiswas = newSiswas;
        axios.post('http://localhost:4567/api/importsiswas', newSiswas, {headers: {'X-Access-Token': self.token}}).then((res)=>{
          self.getSiswas();
          self.fileUrl = '';
        })
      }
      req.send();
    }
  },
  computed: {
    
    formTitle () {
        return this.editedIndex == -1 ? 'Tambah Praktikan' : 'Edit Praktikan'
      }
    
  }
}
</script>

<style scoped>
  dialog{
    height: auto!important;
  }
</style>

