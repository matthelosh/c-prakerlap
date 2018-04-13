<template lang="pug">
  div
    br
    v-layout(row)
      v-flex(xs3 offset-xs1)
        v-card(hover @hover="showEdit")
          
          v-card-media(:src="foto" height="200px")
            v-btn(color="pink" fab right absolute dark flat v-show="offerEdit")
              v-icon mdi-account-edit
          v-card-title(primary-title)
            div
              h3.headline.mb-0 {{user.nama}}
              div {{user.alamat}} <br> {{user.hp}}
      v-flex(xs5 offset-xs1)
        v-card.teal.darken-1.white--text(hover)
          //- v-card-media(:src="foto" height="200px")
          v-card-title(primary-title)
            div
              h3.headline.mb-0 <i class="fa fa-building"></i> Daftar Du/Di
          v-list(two-line subheader v-for="dudi in dudis" :key="dudi._id")
            v-list-tile
              v-list-tile-content
                v-list-tile-title {{dudi.namaDudi}}
                v-list-tile-sub-title {{dudi.alamat}}
                v-list-tile-sub-title {{dudi.kota}}
            v-divider
                
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      token: sessionStorage.getItem('token'),
      uname: sessionStorage.getItem('user'),
      role: sessionStorage.getItem('role'),
      user: {},
      foto : '',
      dudis:[],
      offerEdit: false,
      // items: [
      //     { icon: 'fa-building fa-2x', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' },
      //     { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Recipes', subtitle: 'Jan 17, 2014' },
      //     { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' }
      //   ]
    }
  },
  created(){
    this.getme();
    this.getMyDudi();
  },
  methods: {
    getme(){
      var self = this;
      axios.get('http://localhost:4567/api/profile?id='+self.uname+'&role='+self.role, {headers: {'X-Access-Token': self.token}})
           .then((res) => {
             self.user = res.data[0];
             self.foto = '/public/user-profiles/'+res.data[0]._id+'.jpg';

           });
    },
    getMyDudi() {
        var self = this;
        var id = sessionStorage.getItem("_id");
        axios.get('http://localhost:4567/api/getmydudis?id='+id, {headers: {'X-Access-Token': self.token}})
            .then(function(res){
                self.dudis = res.data;
            });
    },
    showEdit(){
      this.offerEdit = true;
    }
  },
  computed: {
    // foto(){
    //   var self = this;
    //   return self.user._id;
    // }
  }
}
</script>

<style lang="sass" scoped>

</style>
