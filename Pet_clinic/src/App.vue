<script lang="ts">
import PetClinicLayout from './components/PetClinicLayout.vue'
import Background from './components/Background.vue'
import {ref} from 'vue'
export default {
  name: 'App',
  components: {
    PetClinicLayout,
    Background
  }
}
</script>
<script setup lang="ts">
 const status = ref(0)
</script>
<template>
  <div id="app" >
    <Background  v-if="status === 0" @switch="(index) => status = index"/>
    <PetClinicLayout  v-if="status === 1" @switch="(index) => status = index"/>
  </div>
</template>

