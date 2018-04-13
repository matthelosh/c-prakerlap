<template lang="pug">
  div
    v-layout(row)
      v-flex(xs10 offset-xs1)
        v-card
          v-btn(color="primary" flat @click.native="dialog=true") 
            i.fa.fa-calendar-plus-o
            | &nbsp; Tambah Jadwal
          v-btn(color="success" @click.native="cetak_data" flat)
            i.fa.fa-print
            | &nbsp; Cetak
          v-btn(color="warning" @click.native="export_xls" flat)
            i.fa.fa-table
            | &nbsp; Export
    v-layout(row)
      v-flex(xs10 offset-xs1)
        v-card
          v-card-title
            h3 {{ page_title.toUpperCase()}}
            v-spacer
            v-text-field.no-print(append-icon="search" label="Pencarian" single-line hide-details v-model="search")
            <v-dialog v-model="dialog" max-width="500px">
              //- <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-menu ref="menustart" lazy :close-on-content-click="false" v-model="menustart" transition="scale-transition" offset-y s full-width :nudge-right="40" min-width="290px" :return-value.sync="datestart" >
                          <v-text-field label="Mulai" v-bind:value="editedJadwal.start" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-calendar"  v-model="editedJadwal.start" slot="activator"></v-text-field>
                          <v-date-picker v-model="editedJadwal.start" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.menustart.save(editedJadwal.start)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm6 md6>
                        <v-menu ref="menuend" lazy :close-on-content-click="false" v-model="menuend" transition="scale-transition" offset-y s full-width :nudge-right="40" min-width="290px" :return-value.sync="dateend" >
                          <v-text-field label="Akhir" v-bind:value="editedJadwal.end" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-calendar" v-model="editedJadwal.end" slot="activator" readonly></v-text-field>
                          <v-date-picker v-model="editedJadwal.end" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.menuend.save(editedJadwal.end)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 sm10 md10>
                        <v-text-field label="Kegiatan" v-model="editedJadwal.kegiatan" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-tasks" multi-line rows="3"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm8 md8>
                        <v-text-field label="Pelaksana" v-model="editedJadwal.pelaksana" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-users"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm4 md4>
                        <v-text-field label="Tempat" v-model="editedJadwal.tempat" required validate-on-blur :rules="[rules.required]" append-icon="fa fa-map-marker"></v-text-field>
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
            v-data-table#tbl_jadwal(:headers="headers" :items="jadwals" :search="search" sort-icon="fa fa-sort" next-icon="fa fa-angle-double-right" prev-icon="fa fa-angle-double-left")
                  template(slot="items" slot-scope="props")
                    td {{ props.item._id }}
                    td.text-xs-center {{ props.item.start}}
                    td.text-xs-left {{ props.item.end }}
                    td.text-xs-left {{ props.item.kegiatan }}
                    td.text-xs-left {{ props.item.pelaksana }}
                    td {{ props.item.tempat }}
                    td.justify-center.layout.px-0
                      <v-btn icon class="mx-0" @click="editItem(props.item)">
                        <v-icon color="teal">fa-pencil</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="pink">fa-trash</v-icon>
                      </v-btn>
                  v-alert(slot="no-results" :value="true" color="error" icon="warning")
                    | Pencarian Anda akan "{{ search }}" tidak ditemukan.
  
    <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>

</template>

<script>
import axios from 'axios'
export default {
  data(){
      return {
        datestart: null,
        dateend: null,
        menustart: false,
        menuend: false,
        editedIndex: -1,
        mask :"date-with-time",
        value: '01/02/2018 22:00',
        dialog: false,
        page_title: 'Jadwal Kunjungan',
        token: sessionStorage.getItem('token'),
        jadwals: [],
        headers: [
          {
          text: 'No',
          align: 'left',
          sortable: true,
          value: 'index'
          },
          { text: 'Waktu Mulai', value: 'start' },
          { text: 'Waktu Akhir', value: 'end' },
          { text: 'Kegiatan', value: 'kegiatan' },
          { text: 'Pelaksana', value: 'pelaksana' },
          { text: 'Tempat', value: 'tempat' },
          { text: 'Aksi', value: 'aksi' }
        ],
        search: '',
        editedJadwal:{
          _id:'',
          start: '',
          end: '',
          kegiatan: '',
          pelaksana: '',
          tempat: ''
        },
        defaultJadwal:{
          _id:'',
          start: '',
          end: '',
          kegiatan: '',
          pelaksana: '',
          tempat: ''
        },
        rules:{
          required: (value) => !!value || 'Harus diisi'
        },
      }
  },
  created() {
    this.getJadwal();
  },
  methods: {
    editItem (item) {
        this.editedIndex = this.jadwals.indexOf(item)
        this.editedJadwal = Object.assign({}, item)
        // this.selJadwal._id = this.editedDudi._guru._id;
        // this.selJadwal.nama = this.editedDudi._guru.nama;
        this.dialog = true
    },

    deleteItem (item) {
      const index = this.jadwals.indexOf(item)
      confirm('Yakin Menghapus Jadwal ini?') && this.jadwals.splice(index, 1)
    },
    getJadwal() {
      var self = this;
      axios.get('http://localhost:4567/api/jadwal', {headers:{'X-Access-Token': self.token}})
           .then((res) => {
             self.jadwals = res.data;
           });
    },
    cetak_data(){
         window.frames["print_frame"].document.head.innerHTML = "<style>table{width: 100%;}table, th,td{border:1px solid #666;border-collapse:collapse;} td{padding: 2px 5px;word-wrap: wrap} .datatable__actions,th i{display:none} </style>";
         window.frames["print_frame"].document.body.innerHTML += "<h3 style='text-align:center'>Jadwal Kunjungan</h3>";
         window.frames["print_frame"].document.body.innerHTML += document.getElementById("printableTable").innerHTML;
         window.frames["print_frame"].window.focus();
         window.frames["print_frame"].window.print();
    },
    export_xls() {
          var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
          var textRange; var j=0;
          var tab = document.getElementById('tbl_jadwal'); // id of table
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
          var  sa = window.open("data:application/vnd.ms-excel;charset=UTF-8," + encodeURIComponent(tab_text));  

          return (sa);
    },
    close () {
        this.dialog = false
        setTimeout(() => {
          this.editedJadwal = Object.assign({}, this.defaultJadwal)
          this.editedIndex = -1
        }, 300)
    },
    save(){
      var self = this;
      var data = self.editedJadwal;
      console.log(data);
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

