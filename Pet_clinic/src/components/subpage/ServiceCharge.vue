<template>
  <div class="mainPage">
    <el-container >
    <el-aside>
      <div>
        <el-container>
          <el-input class="searchBar" v-model="input" placeholder="请输入内容"></el-input>
          <el-button class="searchBar">搜索</el-button>
        </el-container>
      </div>
      <div class="filter">
          <el-input class="option" v-model="input" placeholder="请输入服务编号"></el-input>
          <el-select class="option" v-model="service" clearable placeholder="请选择服务名称">
            <el-option
              v-for="item in services"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="option" v-model="serviceType" clearable placeholder="请选择服务类型">
            <el-option
              v-for="item in serviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="option" v-model="department" clearable placeholder="请选择科室">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button class="optionButton">筛选</el-button>
      </div>
    <p>aside</p>
  </el-aside>
  <el-main>
    <el-table class="table" :data="chargeData" style="width: 100%">
      <el-table-column prop="id" label="服务编号" >
      </el-table-column>
      <el-table-column prop="service" label="服务名称" >
      </el-table-column>
      <el-table-column prop="serviceType" label="服务类型" >
      </el-table-column>
      <el-table-column prop="price" label="价格" >
      </el-table-column>
      <el-table-column prop="department" label="科室" >
      </el-table-column>
    </el-table>
    <p>main</p>
  </el-main>
  </el-container>
  </div>
</template>
<script setup lang="ts">

import {defineComponent,ref} from "vue";

defineComponent({
  name: "ServiceCharge"
})
const fits = ['fill']
const url =
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
const chargeData = ref(0);
const searchKey = ref(0);
const filterKey = ref(0);
const input = ref('');
const service = ref('');
const services = [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }];
const serviceType = ref('');
const serviceTypes = [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }];
const department = ref('');
const departments = [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }];
</script>

<style scoped lang="scss">
.el-aside {
    text-align: center;
    background: rgb(233, 233, 235);
    border-right-color: #DCDFE6;
    border-right-style: solid;
    border-right-width: 2px;
}
.el-main {
    text-align: center;
    background: rgb(244, 244, 245);
}
.el-container {
    width: 100% ;
    height: 100%;
  }
.mainPage {
  margin-top: 1%;
  width: 100%;
  border-style:solid;
  border-radius: 10px;
  border-color: #DCDFE6;
}
.searchBar {
  margin-top:6%;
  margin-right:3%;
  margin-left:3%;
}
.description {
  width: 100%;
}
.entry {
  width: 100%;
}
.table {
  margin-top:0%;
}
.filter {
  margin-top:10%;
  margin-left: 3%;
  margin-right:3%;
}
.option {
  margin-top :3%;
}
.optionButton {
  width:50%;
  margin-top :3%;
}
</style>
