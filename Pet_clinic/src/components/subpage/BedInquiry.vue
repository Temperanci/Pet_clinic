<template>
  <div class="mainPage">
    <el-aside>

      <div class="filter">

        <el-input class="option" v-model="Location" placeholder="请输入床位地址"></el-input>
        <el-select class="option" placeholder="请选择科室" v-model="DepartmentId" style="width: 100%">
          <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled" />
        </el-select>
        <el-select class="option" placeholder="占用情况" v-model="Occupation" style="width: 100%">
          <el-option v-for="item in ocpOptions" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled" />
        </el-select>

        <div class="optionButton">
          <el-button class="button" @click="CRUDhandler.search({
          bedId: BedId,
          departmentId: DepartmentId,
          location: Location,
          occupation: Occupation
        });
        back = true;">筛选</el-button>
          <el-button v-if="back" class="button"
            @click="fetchBed(undefined, defaultNum); back = false; clearFilter();">返回</el-button>
        </div>

      </div>
    </el-aside>
    <div class="main">
      <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
          <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">

            <el-table-column prop="location" label="床位地址">
              <template #default="scope">
                <span>{{ scope.row.location }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="departmentId" label="科室">
              <template #default="scope">
                <span>{{ deptMap.get(scope.row.departmentId) }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="departmentId" label="占用情况">
              <template #default="scope">
                <span v-if="scope.row.occupation" style="color:crimson"><b>占用</b></span>
                <span v-else style="color:grey">未占用</span>
                <!-- <span>{{  scope.row.occupation?"占用":"未占用" }}</span> -->
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
import { pageQuery } from "../../apis/bed/bed"
import type { BedPageResponse, BedPageRequest } from "@/apis/bed/bed-interface"
import { Bed } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'


const BedPage = ref<BedPageResponse>({ datas: [], total: 0, limit: 0 });
class bedRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
  }//更新buffer
  deleteRow(Msg: Object[], index: number): void {
  }//删除
  editRow(Msg: Object[], index: number): void {
  }//修改
  createRow(msg: Object): void {
  }
  search(msg: Object): void {
    fetchBed(undefined, 999, msg, true);
  }
  constructor() {

  }
}
var CRUDhandler = new bedRowCRUD();
async function fetchBed(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = msg || {
    bedId: '',
    location: '',
    departmentId: ''
  }
  var request: BedPageRequest = {
    bedId: ((temp as Bed).bedId === '') ? undefined : (temp as Bed).bedId,
    location: ((temp as Bed).location === '') ? undefined : (temp as Bed).location,
    departmentId: ((temp as Bed).departmentId === '') ? undefined : (temp as Bed).departmentId,
    occupation: ((temp as Bed).occupation === null) ? undefined : (temp as Bed).occupation,
    currPageNo: pageNum || 1,
    limit: pageLimit || 20
  }
  console.log('request', request);
  try {
    const response = await pageQuery(request || undefined);
    if (response && response.data && response.data.datas) {
      BedPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = BedPage.value.datas;
      if (search || false) {
        tabLength.value = BedPage.value.total;
      }
      else { tabLength.value = BedPage.value.limit; }//保证搜索只有一页
      entryNum.value = BedPage.value.total;
      // eslint-disable-next-line vue/no-ref-as-operand
      isSelected = isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Bed()) as Bed[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched Bed:', BedPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching Bed:', error);
  }
}
onMounted(() => {
  getDeptInfo()
  getBedInfo()
  fetchBed(undefined, defaultNum);
});
//paginate
var defaultNum = 10;
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Bed[]> = ref<Bed[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  if(!back.value){
    fetchBed(currentPage, defaultNum);
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


const Location = ref('');
const DepartmentId = ref('');
const Occupation = ref();
const BedId = ref('');
function clearFilter() {
  Occupation.value = '';
  Location.value = '';
  DepartmentId.value = '';
  BedId.value = '';
}

const ocpOptions: Ref<any[]> = ref<any[]>([
  {value:false,label:"未占用"},
  {value:true,label:"占用"}
])
const deptOptions: Ref<any[]> = ref<any[]>([])
const deptMap: Ref<Map<any, any>> = ref<Map<any, any>>(new Map());
const bedMap: Ref<Map<any, any>> = ref<Map<any, any>>(new Map());
async function getBedInfo() {
  var request: BedPageRequest = {
    limit: 999
  }
  try {
    var bedResponse = await pageQuery(request);
    if (bedResponse && bedResponse.data && bedResponse.data.datas) {
      console.log('Fetched bed:', bedResponse.data.datas);
      for (var i = 0; i < bedResponse.data.datas.length; i++) {
        bedMap.value.set(bedResponse.data.datas[i].bedId, bedResponse.data.datas[i].bed);
      }
      console.log('bedMap', bedMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching bed:', error);
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
  name: "BedInquiry"
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


<!-- <template>
  <div class="container" >
    <el-aside style="margin-left: 5vw; width: 30%;">
      <el-select v-model="currentDepartment.name" placeholder="Select" style="margin-top: 3vw;">
        <el-option v-for="dep in departments" :key="dep.departmentId" :label="dep.name" :value="dep.name"
         @click="selectDepartment(dep.departmentId)"/>
      </el-select>
      <el-table :data="loadBedList()" style="margin-top: 3vw;">
        <el-table-column prop="bedId" label="床位号"/>
        <el-table-column prop="location" label="位置"/>
        <el-table-column prop="availability" label="使用状况"/>
      </el-table>
    </el-aside>
    <el-main style="margin-left: 5vw;">
      <h3 style="color:grey; text-align:center; font-size:20px">{{ currentDepartmentRef.name }} 床位图</h3>
      <div class="bed-image" style="display: flex; justify-content:center;">
          <el-image style="width: 60%; height: 60%;" :src="loadBedMap()"/>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { ref } from 'vue'

defineComponent({
  name: "BedInquiry"
})

// 选择科室
function selectDepartment(id: string) {
  var temp = departments.find(dep => dep.departmentId === id);
  if (temp != null) currentDepartmentRef.value = temp;
  loadBedMap();
  console.log(currentDepartmentRef.value.name);
}

// 返回所选科室的床位列表
function loadBedList(){
  var currentBedList:{bedId:string;departmentId:string;location:string;availability:string}[]=[];
  for(var index in bedList){
    if(bedList[index].departmentId==currentDepartmentRef.value.departmentId){
      currentBedList.push(bedList[index]);
    }
  }
  return currentBedList;
}

// 返回所选科室的床位图
function loadBedMap(){
  const bedMapURL = '/image/bedMap/'+currentDepartmentRef.value.departmentId+'.png';
  console.log('床位图地址: ',bedMapURL);
  return bedMapURL;
}

const departments = [
  {
    departmentId: '01',
    name: '门诊室',
    desc: '略'
  },
  {
    departmentId: '02',
    name: '治疗室',
    desc: '略'
  },
  {
    departmentId: '03',
    name: '手术准备室',
    desc: '略'
  },
  {
    departmentId: '04',
    name: '手术室',
    desc: '略'
  },
  {
    departmentId: '05',
    name: '住院部',
    desc: '略'
  }
]

const currentDepartment = departments[0];
const currentDepartmentRef = ref(currentDepartment);


const bedList = [
  {
    bedId: '0101',
    departmentId: '01',
    location: '01A',
    availability: '不可用'

  },
  {
    bedId: '0102',
    departmentId: '01',
    location: '01B',
    availability: '可用'
  },
  {
    bedId: '0103',
    departmentId: '01',
    location: '01C',
    availability: '可用'
  },
  {
    bedId: '0104',
    departmentId: '01',
    location: '01D',
    availability: '不可用'
  },
  {
    bedId: '0105',
    departmentId: '01',
    location: '01E',
    availability: '不可用'
  },
  {
    bedId: '0201',
    departmentId: '02',
    location: '02A',
    availability: '可用'

  }

]


</script>

<style scoped lang="scss">
.container{
  height: 65vh;
  width: 100%;
  border:solid lightgrey 2px;
  border-radius: 30px;
  display: flex;
}
</style> -->
