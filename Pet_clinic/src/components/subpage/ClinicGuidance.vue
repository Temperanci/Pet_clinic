<template>
  <el-container>
    <l-map ref="map" v-model:zoom="zoom" :center="[40, 39.5]" :useGlobalLeaflet=false>
      <l-image-overlay
          :url="url"
          :bounds="imageBounds"
      ></l-image-overlay>
      <l-marker v-for="marker in markers"
                :key="marker.id"
                :id="marker.id.toString()"
                :lat-lng="marker.position"
                @click="onMarkerClicked(marker.id)">
        <l-icon
            :icon-url="markerUrl"
            :shadow-url="shadowMarkerUrl"
            :icon-size="[40, 40]"
            :shadow-size="[40, 40]"
            :icon-anchor="[20, 40]"
            :shadow-anchor="[20, 40]"
        ></l-icon>
        <l-tooltip>{{ marker.name }}</l-tooltip>
      </l-marker>
    </l-map>
  </el-container>
</template>

<script setup lang="ts">
import { defineComponent, ref} from "vue";
import 'leaflet/dist/leaflet.css';
import {LImageOverlay, LMap, LMarker, LIcon, LTooltip} from "@vue-leaflet/vue-leaflet";
import type {LatLngTuple} from "leaflet";

defineComponent({
  name: "ClinicGuidance"
})
const url = '/image/clinic-layout.png'
const markerUrl = '/image/marker.png'
const shadowMarkerUrl = '/image/marker-shadow.png'
interface MarkerData {
  id: number;
  name: string;
  position: LatLngTuple;
}
const markers = ref<MarkerData[]>([
  // 咨询数据...
  { id: 1, name: '药房', position: [39.85, 38.75]},
  { id: 2, name: '门诊室', position: [39.95, 38.95]},
  { id: 3, name: '治疗室', position: [40.05, 39.15]},
  { id: 4, name: '手术准备室', position: [40.13, 39.35]},
  { id: 5, name: '手术室', position: [40.23, 39.55]},
  { id: 6, name: '住院部', position: [40.25, 39.95]},
  { id: 7, name: '档案室', position: [40.10, 40.30]},
  { id: 8, name: '影像学检查室', position: [40.00, 39.87]},
  { id: 9, name: '输液室', position: [39.95, 39.58]},
  { id: 10, name: '病理剖析室', position: [39.88, 39.80]},
  { id: 11, name: '免疫室', position: [39.85, 39.25]},
  { id: 12, name: '化验室', position: [39.75, 39.45]},
  { id: 13, name: '前台区', position: [39.70, 39.20]},
]);

const zoom = ref(9);
const imageBounds: [LatLngTuple, LatLngTuple] = [[39.5, 38.5], [40.5, 40.5]];

const emit = defineEmits(['marker-clicked']);

function onMarkerClicked(id: number) {
  // 直接调用 emit 发送事件
  emit('marker-clicked', id);
}

</script>

<style scoped lang="scss">
.el-container{
  display: flex;
  justify-content: center;
  position: relative;
}
.l-map{
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
