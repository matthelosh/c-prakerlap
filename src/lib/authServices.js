import router from './../router/index'
// var path = router.stringifyPath();
export default {
  // cekToken(){
  //   console.log(path);
  //   var self = this;
  //   var token = sessionStorage.getItem("token");
  //   if(token == null){
  //     if(this.router.path == '/') {
  //       return false;
  //     } else {
  //       this.$router.push('/');
  //       sessionStorage.removeItem("isLoggedIn");
  //     }
  //   } else {
  //     self.parseJwt = function(token){
  //       var base64Url = token.split('.')[1];
  //       var base64 = base64Url.replace('-', '+').replace('_', '/');
  //       return JSON.parse(window.atob(base64));
  //     }
  //     var expTime = self.parseJwt(token);
  //     var timeStamp = Math.floor(Date.now()/1000);

  //     var timeCheck = expTime.exp - timeStamp;
  //     // console.log(timeCheck);
  //     if(timeCheck <= 0) {
  //       alert('Maaf! Token Anda habis. Silahkan Login kembali');
  //       sessionStorage.removeItem("isLoggedIn");
  //       sessionStorage.removeItem("token");
  //       window.location.href='/';


  //     }
  //   }
  // }
}
