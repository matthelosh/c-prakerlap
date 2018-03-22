<template>
  <div class="dash-home">
      <h1>Home</h1>
      <v-icon>mi-android</v-icon>
      <h4>{{text}}</h4>
  </div>
</template>

<script>
export default {
    data () {
        return {
            text: 'Selamat Datang!'
        }
    },
    computed: {
    }
}
</script>

<style>
.dash-home {
    background: #689546
}
</style>

