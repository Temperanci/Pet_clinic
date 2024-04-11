<template>
  <div class="mainPage">
    <el-aside>
      <div>
        <el-container>
          <el-input class="searchBar" v-model="input" placeholder="请输入内容"></el-input>
          <el-button class="searchBar">搜索</el-button>
        </el-container>
      </div>
      <div class="filter">
        <el-input class="option" v-model="ServiceId" placeholder="请输入服务编号"></el-input>
        <el-input class="option" v-model="Title" placeholder="请输入服务名称"></el-input>
        <el-input class="option" v-model="PriceId" placeholder="请输入价格编号"></el-input>
        <el-input class="option" v-model="DepartmentId" placeholder="请输入科室编号"></el-input>
        <el-input class="option" v-model="Type" placeholder="请输入服务类型"></el-input>
        <!-- <el-select class="option" v-model="service" clearable placeholder="请选择服务名称">
          <el-option v-for="item in services" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="option" v-model="serviceType" clearable placeholder="请选择服务类型">
          <el-option v-for="item in serviceTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="option" v-model="department" clearable placeholder="请选择科室">
          <el-option v-for="item in departments" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-button class="optionButton">筛选</el-button>
      </div>
    </el-aside>
    <div class="main">
      <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
          <el-table :data="queryData" height="100%">
            <el-table-column prop="serviceId" label="服务编号">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].serviceId"></el-input>
                <span v-else>{{ scope.row.serviceId }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="服务名称">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].title"></el-input>
                <span v-else>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="服务类型">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].type"></el-input>
                <span v-else>{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="描述">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].desc"></el-input>
                <span v-else>{{ scope.row.desc }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="priceId" label="价格编号">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true"
                  v-model="edited[scope.$index].priceId"></el-input>
                <span v-else>{{ scope.row.priceId }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="departmentId" label="科室">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true"
                  v-model="edited[scope.$index].departmentId"></el-input>
                <span v-else>{{ scope.row.departmentId }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-block">
          <el-pagination @current-change="pagination" layout="prev, pager, next"
            :total="getPagination(entryNum, tabLength)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'
import { getPagination } from '../../scripts/paginate.ts'
import '@/assets/table.css'
//request
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery} from "../../apis/price/price.ts"
import type { PricePageResponse, PricePageRequest } from "@/apis/price/price-interface.ts"
import { Price } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt.ts'

var currentPage = 1;
var entryNum = ref(0);
const ServiceId = ref('');
const input = ref('');
const Type = ref('');
const Title = ref('');
const DepartmentId = ref('');
const PriceId = ref('');
const PricePage = ref<PricePageResponse>({ datas: [], total: 0, limit: 0 });
class priceRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
  }//更新buffer
  deleteRow(Msg: Object[], index: number): void {
  }//删除
  editRow(Msg: Object[], index: number): void {
  }//修改
  constructor() {

  }
}
var CRUDhandler = new priceRowCRUD();
async function fetchPrice() {
  try {
    var request: PricePageRequest = {
      priceId: PriceId.value,
      type: Type.value,
      title: Title.value,
      departmentId: DepartmentId.value,
      serviceId: ServiceId.value
    }
    console.log('request', request);
    const response = await pageQuery(request);
    if (response && response.data && response.data.datas) {
      PricePage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = PricePage.value.datas;
      tabLength.value = PricePage.value.limit;
      entryNum.value = PricePage.value.total;
      isSelected = isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Price()) as Price[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched price:', PricePage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching price:', error);
  }
}
onMounted(() => {
  fetchPrice();
});
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Price[]> = ref<Price[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  isSelected = clearIsSelected(isSelected);
  clearPara.value = true;
}
defineComponent({
  name: "ServiceCharge"
})
// const services = [{
//   value: '选项1',
//   label: '黄金糕'
// }, {
//   value: '选项2',
//   label: '双皮奶'
// }, {
//   value: '选项3',
//   label: '蚵仔煎'
// }, {
//   value: '选项4',
//   label: '龙须面'
// }, {
//   value: '选项5',
//   label: '北京烤鸭'
// }];

// const serviceTypes = [{
//   value: '选项1',
//   label: '黄金糕'
// }, {
//   value: '选项2',
//   label: '双皮奶'
// }, {
//   value: '选项3',
//   label: '蚵仔煎'
// }, {
//   value: '选项4',
//   label: '龙须面'
// }, {
//   value: '选项5',
//   label: '北京烤鸭'
// }];

// const departments = [{
//   value: '选项1',
//   label: '黄金糕'
// }, {
//   value: '选项2',
//   label: '双皮奶'
// }, {
//   value: '选项3',
//   label: '蚵仔煎'
// }, {
//   value: '选项4',
//   label: '龙须面'
// }, {
//   value: '选项5',
//   label: '北京烤鸭'
// }];
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  width: 100%;
  background: rgb(244, 244, 245);
  overflow: hidden;
}

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
  width: 100%;
  height: 100%;
}

.mainPage {
  display: flex;
  margin-top: 1%;
  width: 100%;
  border-style: solid;
  border-radius: 10px;
  border-color: #DCDFE6;
}

.searchBar {
  margin-top: 6%;
  margin-right: 3%;
  margin-left: 3%;
}

.description {
  width: 100%;
}

.entry {
  width: 100%;
}

.filter {
  margin-top: 10%;
  margin-left: 3%;
  margin-right: 3%;
}

.option {
  margin-top: 3%;
}

.optionButton {
  width: 50%;
  margin-top: 3%;
}
</style>
