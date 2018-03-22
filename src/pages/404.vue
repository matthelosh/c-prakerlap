<template>
    <div>
        <div class="page">
            <v-content>
                <v-container fluid>
                    <v-layout column align-center justify-center>
                        <h1>Tidak Ketemu</h1>
                        <br>
                        <br>
                        <br>
                        <!-- <img src="/public/404.png" alt=""> -->
                        <h1><i class="fa fa-ban fa-4x"></i></h1>
                    </v-layout>
                </v-container>
            </v-content>
        </div>
    </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
    .page {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #f89060;
        color: #efefef;

    }
    img{
        filter: drop-shadow(0 0 5px rgba(255,255,255,0.8))
    }
</style>

