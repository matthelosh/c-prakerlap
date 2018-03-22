<template lang="pug">
  div
    v-layout(row)
      v-flex(xs12)
        v-card
          v-btn(color="primary" flat @click.native="dialog=true") 
            i.fa.fa-child
            | Tambah Praktikan
          v-btn(color="success" @click.native="cetak_data" flat)
            i.fa.fa-print
            | &nbsp; Cetak
          v-btn(color="warning" @click.native="export_xls" flat)
            i.fa.fa-table
            | &nbsp; Export
    v-layout(row)
      v-flex(xs-12)
        v-card
          v-card-title
            h4 Data Praktikan
            v-spacer
            v-text-field.no-print(append-icon="search" label="Pencarian" single-line hide-details v-model="search")
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
                      <v-flex xs12 sm8 md8>
                        <v-select append-icon="fa fa-angle-down" v-bind:items="gurus" v-model="selGuru" label="Pilih Guru" item-text="nama" item-value="_id" return-object :hint="`${selGuru.nama}, ${selGuru._id}`" input="selGuru._id" persistent-hint autocomplete></v-select>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-select append-icon="fa fa-angle-down" v-bind:items="dudis" v-model="selDudi" label="Pilih Dudi" item-text="namaDudi" item-value="_id" return-object :hint="`${selDudi.namaDudi}, ${selDudi._id}`" input="selDudi._id" persistent-hint autocomplete ></v-select>
                      </v-flex>
                      

                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          #printableTable
            v-data-table#tbl_praktikan(:headers="headers" :items="siswas" :search="search" sort-icon="fa fa-sort" next-icon="fa fa-angle-double-right" prev-icon="fa fa-angle-double-left")
                  template(slot="items" slot-scope="props")
                    td {{ props.index+1 }}
                    td.text-xs-center {{ props.item._id}}
                    td.text-xs-left {{ props.item.nama }}
                    td.text-xs-left {{ props.item.kelas }}
                    td.text-xs-left {{ props.item.progli }}
                    td {{ props.item.hp }}
                    td 
                      span(v-if="props.item._dudi == null || props.item._dudi == '' || props.item._dudi == '0'") Belum ditempatkan
                      span(v-else) {{ props.item._dudi.namaDudi }}
                    td 
                      span(v-if="props.item._guru == null || props.item._guru == '' || props.item._guru == '0'") Kosong
                      span(v-else) {{ props.item._guru.nama}}
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
export default {
  data() {
    return {
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
        _dudi: '',
        _guru: '',
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
        _dudi: '',
        _guru: '',
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
          { text: 'Dudi', sortable: false, value: '_dudi.namaDudi' },
          { text: 'Pembimbing', sortable: true, value: '_guru.nama' },
          { text: 'Aksi', sortable: false, value: '_id' }
      ]
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
        this.selDudi._id = this.editedSiswa._dudi._id;
        this.selDudi.namaDudi = this.editedSiswa._dudi.namaDudi;
        this.selGuru._id = this.editedSiswa._guru._id;
        this.selGuru.nama = this.editedSiswa._guru.nama;
        this.dialog = true
        

    },

    deleteItem (item) {
      const index = this.siswas.indexOf(item)
      confirm('Yakin Menghapus Du/Di ini?') && this.dudis.splice(index, 1)
      // alert('hapue');
    },
    getSiswas(){
      var self = this;
      axios.get('http://localhost:4567/api/getsiswas', {headers: {'X-Access-Token': self.token}})
           .then((res) => {
            self.siswas = res.data;
            var data = res.data;
            // var i = 0;
            // for(i=0; i < data.length; i++ ) {
            //   self.dudis.push(data[i]._dudi);
            //   self.gurus.push(data[i]._guru);
            // }
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
    // toggleEdit(ev, id){
    //   // this.editable = !this.editable;   
    //   id.$set('editable', !id.editable);
        
    //     // Focus input field
    //     if(id.editable){
    //         Vue.nextTick(function() {
    //       ev.$$.input.focus();
    //     });   
    //     }
    // },
    close () {
        this.dialog = false
        setTimeout(() => {
          this.editedSiswa = Object.assign({}, this.defaultSiswa)
          this.selDudi = Object.assign({_id: 'Default', namaDudi: 'Pilih Dudi'})
          this.selGuru = Object.assign({_id: 'Default', nama: 'Pilih Guru'})
          this.editedIndex = -1
        }, 300)
    },
    save () {
      alert('hi');
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

