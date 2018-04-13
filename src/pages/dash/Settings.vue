<template lang="pug">
	v-template
		h1 Pengaturan
		v-layout(column)
			v-container(fluid grid-list-md)
				v-layout(row wrap)
					v-flex(xs4)
						v-card(color="amber" dark)
							v-card-title
								h3 Periode
								v-btn(small color="orange darken-3" dark fab right absolute ripple icon)
									v-icon mdi-plus
							v-card-text
					v-flex(xs4)
						v-card(color="orange" dark)
							v-card-title
								h3 Kelas
								v-btn(small color="amber lighten-3" light fab right absolute ripple icon)
									v-icon mdi-plus
							v-card-text

					v-flex(xs4)
						v-card(color="red lighten-1" dark)
							v-card-title
								h3 Periode
								v-btn(small color="grey lighten-3" light fab right absolute ripple icon)
									v-icon mdi-plus
							v-card-text
					v-flex(xs4)
						v-card(color="pink lighten-1" dark)
							v-card-title
								h3 Periode
								v-btn(small color="grey" dark fab right absolute ripple icon)
									v-icon mdi-plus
							v-card-text
</template>

<script>
export default {

  name: 'Settings',

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
</style>
