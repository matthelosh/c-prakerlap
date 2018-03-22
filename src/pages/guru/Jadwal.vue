<template lang="pug">
  div
    v-layout(row)
      v-flex(xs10 offset-xs1)
        v-card
          v-btn(color="primary" flat) 
            i.fa.fa-child
            | Tambah Praktikan
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
          #printableTable
            v-data-table#tbl_jadwal(:headers="headers" :items="jadwals" :search="search" sort-icon="fa fa-sort" next-icon="fa fa-angle-double-right" prev-icon="fa fa-angle-double-left")
                  template(slot="items" slot-scope="props")
                    td {{ props.index+1 }}
                    td.text-xs-center {{ props.item.start}}
                    td.text-xs-left {{ props.item.end }}
                    td.text-xs-left {{ props.item.kegiatan }}
                    td.text-xs-left {{ props.item.pelaksana }}
                    td {{ props.item.tempat }}

                  v-alert(slot="no-results" :value="true" color="error" icon="warning")
                    | Pencarian Anda akan "{{ search }}" tidak ditemukan.
  
    <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
</template>

<script>
import axios from 'axios'
export default {
  data(){
      return {
          page_title: 'Jadwal Kunjungan',
          token: sessionStorage.getItem('token'),
          jadwals: [],
          headers: [
            {
            text: 'No',
            align: 'left',
            sortable: false,
            value: 'index'
            },
            { text: 'Waktu Mulai', value: 'start' },
            { text: 'Waktu Akhir', value: 'end' },
            { text: 'Kegiatan', value: 'kegiatan' },
            { text: 'Pelaksana', value: 'pelaksana' },
            { text: 'Tempat', value: 'tempat' }
          ],
          search: ''
      }
  },
  created() {
    this.getJadwal();
  },
  methods: {
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
  },
  computed: {

  }
}
</script>

<style scoped>

</style>

