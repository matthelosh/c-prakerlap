<template lang="pug">
  div
    v-layout(row dark)
      v-flex.orange(xs10 offset-xs1)
        v-card.grey.lighten-3
          v-spacer
          v-btn(color="primary" flat dark @click.native="dialog=true" class="mb-2") <i class="fa fa-building"></i> &nbsp;Tambah Dudi
          v-btn(color="success" flat @click.native="cetak_data")
            i.fa.fa-print
            | &nbsp; Cetak
          v-btn(color="red" flat @click.native="export_xls")
            i.fa.fa-table
            | &nbsp; Export
    v-layout(row)
      v-flex(xs10 offset-xs1)
        v-card.cetak_tabel
          v-card-title 
            h3 Data DU/DI
            v-spacer
            v-text-field.no-print(append-icon="search" label="Pencarian" single-line hide-details v-model="search")
          v-layout(row)
            v-flex(xs4 offset-xs8)
              v-switch(:label="`Dudi Aktif: ${dudiaktif.toString()}`" v-model="dudiaktif" label="Yang memiliki Pembimbing")  
          div#printableTable
            <v-dialog v-model="dialog" max-width="500px">
              //- <v-btn color="primary" dark slot="activator" class="mb-2">New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Kode Dudi" v-model="editedDudi._id"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Nama Dudi" v-model="editedDudi.namaDudi"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Alamat" v-model="editedDudi.alamat"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Kota" v-model="editedDudi.kota"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Guru Pembimbing" v-model="editedDudi._guru"></v-text-field>
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
            v-data-table#tbl_dudi(:headers="headers" :items="dudist" :search="search" sort-icon="fa fa-sort" next-icon="fa fa-angle-double-right" prev-icon="fa fa-angle-double-left")
              template(slot="items" slot-scope="props")
                td {{ props.index+1 }}
                td {{ props.item._id }}
                td.text-xs-right {{ props.item.namaDudi }}
                <td class="text-xs-left">{{ props.item.alamat }}</td>
                <td class="text-xs-center">{{ props.item.kota }}</td>
                <td class="text-xs-center" >
                    <span v-if="props.item._guru == undefined">Kosong</span>
                    <span v-else>{{props.item._guru.nama}}</span>
                </td>
                <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
                </td>
              v-alert(slot="no-results" :value="true" color="error" icon="warning")
                | Pencarian Anda akan "{{ search }}" tidak ditemukan.
    <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>      
</template>


<script>
import axios from 'axios'
export default {
  data() {
      return {
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
          { text: 'Pembimbing', value: '_guru' },
          { text: 'Action', value: '_id' },

        ],
        dudi: '',
        dudis: [],
        editedDudi: {
          '_id': '',
          'namaDudi': '',
          'alamat': '',
          'kota': '',
          '_guru': ''
        },
        defaultDudi: {
          '_id': '',
          'namaDudi': '',
          'alamat': '',
          'kota': '',
          '_guru': ''
        }
      }
  },
  created(){
    this.getDudis();
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
          console.log(res.data);
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
    toggleEdit(ev, id){
    	// this.editable = !this.editable;   
      id.$set('editable', !id.editable);
        
        // Focus input field
        if(id.editable){
            Vue.nextTick(function() {
    			ev.$$.input.focus();
	  		});   
        }
    },
    close () {
        this.dialog = false
        setTimeout(() => {
          this.editedDudi = Object.assign({}, this.defaultDudi)
          this.editedIndex = -1
        }, 300)
    },
    save () {
      alert('hi');
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