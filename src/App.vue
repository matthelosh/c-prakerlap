<template>
  <v-app>
    <v-content>
      <transition name="page" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
       fixed: true
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

</style>

