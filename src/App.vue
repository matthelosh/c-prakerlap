<template lang="pug">
  v-app
    transition(name="page" mode="out-in")
      router-view
    footer
</template>

<script>
  import Footer from './Footer'
  export default {
    components: {Footer},
    props: {Footer},
    data () {
      return {
        
       fixed: false,
       clipped: false,
       versi: this.$store.state.versi
      }
    }
  }
</script>

<style lang="css" scoped>
  .page-enter-active, .page-leave-active {
    transition: opacity .5s, transform .5s;
  }
  .page-enter, .page-leave-to {
    opacity: 0;
    transform: translateX(-50%);
  }
  footer{

  }

</style>

