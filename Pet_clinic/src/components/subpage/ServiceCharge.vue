<template>
  <div class="mainPage">
    <el-aside>
      <!-- <div>
        <el-container>
          <el-input class="searchBar" v-model="input" placeholder="请输入内容"></el-input>
          <el-button class="searchBar">搜索</el-button>
        </el-container>
      </div> -->
      <div class="filter">
        <!-- <el-input class="option" v-model="ServiceId" placeholder="请输入服务编号"></el-input> -->
        <el-input class="option" v-model="Title" placeholder="请输入服务名称"></el-input>
        <!-- <el-input class="option" v-model="PriceId" placeholder="请输入价格编号"></el-input> -->
        <!-- <el-input class="option" v-model="DepartmentId" placeholder="请输入科室编号"></el-input> -->
        <!-- <el-input class="option" v-model="Type" placeholder="请输入服务类型"></el-input> -->
        <el-select class="option" placeholder="请选择服务类型" v-model="Type" style="width: 100%">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"
           />
        </el-select>
        <el-select class="option" placeholder="请选择科室" v-model="DepartmentId" style="width: 100%">
          <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled" />
        </el-select>
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
        <div class="optionButton">
          <el-button class="button" @click="CRUDhandler.search({
          priceId: PriceId,
          type: Type,
          title: Title,
          departmentId: DepartmentId,
          serviceId: ServiceId
        });
        back = true;">筛选</el-button>
        <el-button v-if="back" class="button" @click="fetchPrice(undefined,defaultNum); back = false; clearFilter();">返回</el-button>
        </div>
        
      </div>
    </el-aside>
    <div class="main">
      <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
          <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
            <!-- <el-table-column prop="serviceId" label="服务编号">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].serviceId"></el-input>
                <span v-else>{{ scope.row.serviceId }}</span>
              </template>
</el-table-column> -->
            <el-table-column prop="title" label="服务名称">
              <template #default="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="服务类型">
              <template #default="scope">
                <span>{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="描述">
              <template #default="scope">
                <span>{{ scope.row.desc }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="priceId" label="价格">
              <template #default="scope">
                <span>{{ priceMap.get(scope.row.priceId) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="departmentId" label="科室">
              <template #default="scope">       
                <span>{{ deptMap.get(scope.row.departmentId) }}</span>
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
import { getPagination } from '../../scripts/paginate'
import '@/assets/table.css'
//request
import { isSelectGen, EditedGen, clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery } from "../../apis/price/price"
import type { PricePageResponse, PricePageRequest } from "@/apis/price/price-interface"
import { Price } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'


const PricePage = ref<PricePageResponse>({ datas: [], total: 0, limit: 0 });
class priceRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
  }//更新buffer
  deleteRow(Msg: Object[], index: number): void {
  }//删除
  editRow(Msg: Object[], index: number): void {
  }//修改
  createRow(msg: Object): void {
  }
  search(msg: Object): void {
    fetchPrice(undefined, 999, msg, true);
  }
  constructor() {

  }
}
var CRUDhandler = new priceRowCRUD();
async function fetchPrice(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = msg || {
    priceId: '',
    type: '',
    departmentId: '',
    title: '',
    serviceId: '',
  }
  var request: PricePageRequest = {
    priceId: ((temp as Price).priceId === '') ? undefined : (temp as Price).priceId,
    type: ((temp as Price).type === '') ? undefined : (temp as Price).type,
    departmentId: ((temp as Price).departmentId === '') ? undefined : (temp as Price).departmentId,
    serviceId: ((temp as Price).serviceId === '') ? undefined : (temp as Price).serviceId,
    title: ((temp as Price).title === '') ? undefined : (temp as Price).title,
    currPageNo: pageNum || 1,
    limit: pageLimit || 20
  }
  console.log('request', request);
  try {
    const response = await pageQuery(request || undefined);
    if (response && response.data && response.data.datas) {
      PricePage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = PricePage.value.datas;
      if (search || false) {
        tabLength.value = PricePage.value.total;
      }
      else { tabLength.value = PricePage.value.limit; }//保证搜索只有一页
      entryNum.value = PricePage.value.total;
      // eslint-disable-next-line vue/no-ref-as-operand
      isSelected = isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Price()) as Price[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched Price:', PricePage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching Price:', error);
  }
}
onMounted(() => {
  getDeptInfo()
  getPriceInfo()
  fetchPrice(undefined,defaultNum);
});
//paginate
var defaultNum = 10;
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Price[]> = ref<Price[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  if(!back.value){
    fetchPrice(currentPage,defaultNum);
  }
  
  // eslint-disable-next-line vue/no-ref-as-operand
  isSelected = clearIsSelected(isSelected);
  clearPara.value = true;
}
//filter && view
import { pageQuery as deptPageQuery } from "@/apis/department/department";
import { type DepartmentPageRequest } from '@/apis/department/department-interface';
var entryNum = ref(0);
var back = ref(false);
const ServiceId = ref('');
const input = ref('');
const Type = ref('');
const Title = ref('');
const DepartmentId = ref('');
const PriceId = ref('');
function clearFilter() {
  ServiceId.value = '';
  Type.value = '';
  Title.value = '';
  DepartmentId.value = '';
  PriceId.value = '';
}
const typeOptions=[
  {
    label:'药品',
    value:'药品'
  },
  {
    label:'服务',
    value:'服务'
  }
]
const deptOptions: Ref<any[]> = ref<any[]>([])
const deptMap:Ref<Map<any,any>> = ref<Map<any,any>>(new Map());
const priceMap:Ref<Map<any,any>> =ref<Map<any,any>>( new Map());
async function getPriceInfo(){
  var request: PricePageRequest = {
    limit: 999
  }
  try {
    var priceResponse = await pageQuery(request);
    if (priceResponse && priceResponse.data && priceResponse.data.datas) {
      console.log('Fetched price:', priceResponse.data.datas);
      for (var i = 0; i < priceResponse.data.datas.length; i++) {
        priceMap.value.set(priceResponse.data.datas[i].priceId, priceResponse.data.datas[i].price);
      }
      console.log('priceMap', priceMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching price:', error);
  }
}
async function getDeptInfo() {
  var request: DepartmentPageRequest = {
    limit: 999
  }
  try {
    var deptResponse = await deptPageQuery(request);
    if (deptResponse && deptResponse.data && deptResponse.data.datas) {
      console.log('Fetched departments:', deptResponse.data.datas);
      for (var i = 0; i < deptResponse.data.datas.length; i++) {
        deptOptions.value.push({
          value: deptResponse.data.datas[i].departmentId,
          label: deptResponse.data.datas[i].name
        });
        deptMap.value.set(deptResponse.data.datas[i].departmentId, deptResponse.data.datas[i].name);
      }
      console.log('deptMap', deptMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching departments:', error);
  }
}
defineComponent({
  name: "ServiceCharge"
})
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
  display: flex;
  flex-direction: column;

  .button {
    margin: auto;
    width: 50%;
    margin-top: 3%;
  }
}
</style>
