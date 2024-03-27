<script lang="ts">
import PetClinicLayout from './components/PetClinicLayout.vue'
import BackgroundLayout from './components/BackgroundLayout.vue'
import {ref} from 'vue'
export default {
  name: 'App',
  components: {
    PetClinicLayout,
    BackgroundLayout
  }
}
</script>
<script setup lang="ts">
 const status = ref(0)
</script>
<template>
  <div id="app" >
    <BackgroundLayout  v-if="status === 0" @switch="(index) => status = index"/>
    <PetClinicLayout  v-if="status === 1" @switch="(index) => status = index"/>
  </div>
</template>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>

