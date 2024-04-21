<script lang="ts">
import PetClinicLayout from './components/PetClinicLayout.vue'
import BackgroundLayout from './components/BackgroundLayout.vue'
import LogIn from './components/Login.vue'
import {ref} from 'vue'
export default {
  name: 'App',
  components: {
    PetClinicLayout,
    BackgroundLayout,
    LogIn
  }
}
</script>
<script setup lang="ts">

 const status = ref(2)//0:back 1:front 2:login 
</script>
<template>
  <div id="app" >
    <router-view></router-view>
    <!-- <router-view name="home"></router-view>
    <router-view name="login"></router-view> -->

    <!-- <LogIn v-if="status === 2" @switch="(index) => status = index"/>
    <BackgroundLayout  v-if="status === 0" @switch="(index) => status = index"/>
    <PetClinicLayout  v-if="status === 1" @switch="(index) => status = index"/> -->
  </div>
</template>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>

