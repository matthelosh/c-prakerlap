<template lang="pug">
  div
    v-layout(row)
      v-flex(xs6)
        v-card(flat)
          v-btn(color="primary" @click.native="dialog=true" flat) 
            i.fa.fa-user-plus
            | Tambah Guru
          v-btn(color="success" @click.native="cetak_data" flat)
            i.fa.fa-print
            | &nbsp; Cetak
          v-btn(color="warning" @click.native="export_xls" flat)
            i.fa.fa-table
            | &nbsp; Export
      v-flex(xs6)
        v-card(flat)
          v-container(grid-list-md)
              v-layout(wrap)
                v-flex(xs6)
                  input(type="file" id="fileGuru" ref="fileGuru" style="display:none" @change="onFilePicked")
                  v-text-field(label="Upload File" append-icon="mdi-file-excel-box" flat @click.native="pickFile" v-model="filename")
                v-flex(xs4)
                  v-btn(color="green" dark @click.native="importGuru")
                    v-icon mdi-send
    br
    v-layout(row)
      v-flex(xs-12)
        v-card
          v-card-title
            h4 Data Guru Pembimbing
            v-spacer
            v-text-field.no-print(append-icon="fa fa-search" label="Pencarian" single-line hide-details v-model="search")
          #printableTable
            <v-dialog v-model="dialog" max-width="500px">
              //- <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      
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
            v-data-table#tbl_guru(:headers="headers" :items="gurus" :search="search" sort-icon="fa fa-sort" next-icon="fa fa-angle-double-right" prev-icon="fa fa-angle-double-left" )
                  template(slot="items" slot-scope="props")
                    td {{ props.index+1 }}
                    td.text-xs-center 
                      v-avatar(
                        size="38px"
                        class="grey lighten-4"
                      )
                        img(:src="'/public/user-profiles/'+props.item._id+'.jpg'" alt="avatar")
                      </v-avatar>
                    td.text-xs-center {{ props.item._id }}
                    td.text-xs-center {{ props.item.uname }}
                    td.text-xs-center {{ props.item.nip }}
                    td.text-xs-left {{ props.item.nama }}
                    td.text-xs-left {{ props.item.hp }}
                    <td>{{ props.item.alamat }}</td>

                  v-alert(slot="no-results" :value="true" color="error" icon="warning")
                    | Pencarian Anda akan "{{ search }}" tidak ditemukan.
  
    <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {
      filename: '',
      file: '',
      fileUrl: '',
      dialog: false,
      token: sessionStorage.getItem('token'),
      id: sessionStorage.getItem('_id'),
      search: '',
      headers:[
          {
            text: 'No',
            align: 'left',
            sortable: false,
            value: 'index'
          },
          { text: 'Foto', value: '_id' },
          { text: 'Kode Guru', value: '_id' },
          { text: 'Username', value: 'uname' },
          { text: 'NIP', value: 'nip' },
          { text: 'Nama Guru', value: 'nama' },
          { text: 'No. HP', value: 'hp' },
          { text: 'Alamat', value: 'alamat' }

        ],
      gurus: [],
      foto: [],
      add: true,
      editedIndex: -1,
      rules:{
                required: (value) => !!value || 'Harus diisi'
              },
          }
  },
  created(){
    this.getGurus();
  },
  methods: {
    pickFile(){
      this.$refs.fileGuru.click()
    },
    onFilePicked(e){
      var self = this;
      var files = e.target.files;
      var namafile = files[0].name;
      self.filename = namafile;
      const filereader = new FileReader();
      filereader.addEventListener('load', () => {
        self.fileUrl = filereader.result;
      });
      filereader.readAsDataURL(files[0]);
      self.file = files[0];
    },
    importGuru(){
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
        var newGurus = XLSX.utils.sheet_to_json(ws);
        axios.post('http://localhost:4567/api/importgurus', newGurus, {headers: {'X-Access-Token': self.token}}).then((res)=>{
          self.getGurus();
          self.fileUrl = '';
          self.filename = '';
        })
        // console.log(newGurus);
        // self
      };
      req.send();
    },
    close () {
        this.dialog = false
        setTimeout(() => {
          this.editedDudi = Object.assign({}, this.defaultDudi)
          this.editedIndex = -1
          this.selGuru = Object.assign({_id: 'Default', nama: 'Pilih Guru'})
          this.editedIndex = -1
          this.add = false;
          this.getDudis();
          this.getGurus();
        }, 300)
    },
    getGurus(){
      var self = this;
      axios.get('http://localhost:4567/api/getgurus', {headers: {'X-Access-Token': self.token}})
           .then((res) => {
             self.gurus = res.data;
             var i = 0;
             for (i; i < res.data.length; i++) {
              self.foto.push('/public/user-profiles/'+res.data[i]._id+'.jpg');
             }
           });
    },
    cetak_data(){
         window.frames["print_frame"].document.head.innerHTML = "<style>table{width: 100%;}table, th,td{border:1px solid #666;border-collapse:collapse;} td{padding: 2px 5px;word-wrap: wrap} .datatable__actions,th i{display:none} </style>";
         window.frames["print_frame"].document.body.innerHTML += "<h3 style='text-align:center'>DATA GURU PEMBIMBING</h3>";
         window.frames["print_frame"].document.body.innerHTML += document.getElementById("printableTable").innerHTML;
         window.frames["print_frame"].window.focus();
         window.frames["print_frame"].window.print();
    },
    export_xls() {
          var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
          var textRange; var j=0;
          var tab = document.getElementById('tbl_guru'); // id of table
          var rows = tab.getElementsByTagName("tr");

          for(j = 0 ; j < rows.length ; j++) 
          {     
            // console.log(rows);
              tab_text=tab_text+rows[j].innerHTML+"</tr>";
              //tab_text=tab_text+"</tr>";
          }

          tab_text=tab_text+"</table>";
          tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
          // tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
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
    }
  },
  computed: {
    formTitle () {
        return this.editedIndex == -1 ? 'Tambah Dudi' : 'Edit Dudi'
      }
  }
}
</script>
<style scoped>

</style>
