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
        <el-input class="option" v-model="DrugId" placeholder="请输入药品编号"></el-input>
        <el-input class="option" v-model="Name" placeholder="请输入药品名称"></el-input>
        <el-input class="option" v-model="Type" placeholder="请输入药品类型"></el-input>
        <el-input class="option" v-model="DepartmentId" placeholder="请输入科室"></el-input>
        <el-input class="option" v-model="DiseaseId" placeholder="请输入适用疾病"></el-input>
        <!-- <el-select class="option" v-model="drug" clearable placeholder="请选择药品名称">
          <el-option v-for="item in drugs" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="option" v-model="drugType" clearable placeholder="请选择药品类型">
          <el-option v-for="item in drugTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="option" v-model="department" clearable placeholder="请选择科室">
          <el-option v-for="item in departments" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="option" v-model="disease" clearable placeholder="请选择适用疾病">
          <el-option v-for="item in diseases" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-button v-if="back" class="optionButton" 
        @click="fetchDrugs();back=false;clearFilter();">返回</el-button>
        <el-button v-else class="optionButton" 
        @click="CRUDhandler.search({
            drugId: DrugId,
            type: Type,
            name: Name,
            departmentId: DepartmentId,
            diseaseIdList: [DiseaseId]
          });
          back=true;">筛选</el-button>
      </div>
    </el-aside>
    <div class="main">
      <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
          <el-table :data="queryData" height="100%">
            <el-table-column prop="drugId" label="药品编号">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].drugId"></el-input>
                <span v-else>{{ scope.row.drugId }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="药品名称">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].name"></el-input>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="药品类型">
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
            <el-table-column prop="diseaseIdList" label="适用疾病">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true"
                  v-model="edited[scope.$index].diseaseIdList"></el-input>
                <span v-else>{{ scope.row.diseaseIdList }}</span>
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
import { pageQuery, update } from "../../apis/drug/drug.ts"
import { pageQuery as deptQuery} from "../../apis/department/department.ts"
import { pageQuery as disQuery} from "../../apis/disease/disease.ts"
import type { DrugPageResponse, DrugPageRequest } from "@/apis/drug/drug-interface.ts"
import { Drug } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt.ts'
var currentPage = 1;
var entryNum = ref(0);
var back = ref(false);
const input = ref('');
const DrugId = ref('');
const Type = ref('');
const Name = ref('');
const DepartmentId = ref('');
const DiseaseId = ref('');
function clearFilter(){
  DrugId.value='';
  Type.value='';
  Name.value='';
  DepartmentId.value='';
  DiseaseId.value='';
}
const DrugPage = ref<DrugPageResponse>({ datas: [], total: 0, limit: 0 });
class drugRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
  }//更新buffer
  deleteRow(Msg: Object[], index: number): void {
  }//删除
  editRow(Msg: Object[], index: number): void {
  }//修改
  createRow(msg: Object): void {
  }
  search(msg: Object): void {
    console.log('drug111',(msg as Drug).diseaseIdList);
    fetchDrugs(undefined, 999, msg, true);
  }
  constructor() {

  }
}
var CRUDhandler = new drugRowCRUD();
async function fetchDrugs(pageNum?: number, pageLimit?: number, msg?: Object, search?: boolean) {
  var temp = msg || {
    drugId: '',
    type: '',
    name: '',
    departmentId: '',
    diseaseIdList: []
  }
  var request: DrugPageRequest = {
    drugId: ((temp as Drug).drugId === '') ? undefined : (temp as Drug).drugId,
    type: ((temp as Drug).type === '') ? undefined : (temp as Drug).type,
    departmentId: ((temp as Drug).departmentId === '') ? undefined : (temp as Drug).departmentId,
    diseaseId: ((temp as Drug).diseaseIdList.length > 0 && (temp as Drug).diseaseIdList[0] !== '') ? (temp as Drug).diseaseIdList[0] : undefined,
    name: ((temp as Drug).name === '') ? undefined : (temp as Drug).name,
    currPageNo: pageNum || 1,
    limit: pageLimit || 20
  }
  console.log('request', request);
  try {
    const response = await pageQuery(request || undefined);
    if (response && response.data && response.data.datas) {
      DrugPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = DrugPage.value.datas;
      if (search || false) {
        tabLength.value = DrugPage.value.total;
      }
      else { tabLength.value = DrugPage.value.limit; }//保证搜索只有一页
      entryNum.value = DrugPage.value.total;
      isSelected = isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Drug()) as Drug[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched Drugs:', DrugPage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching Drugs:', error);
  }
}
onMounted(() => {
  fetchDrugs();
});
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);
var isSelected: Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Drug[]> = ref<Drug[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  fetchDrugs(currentPage);
  //恢复初始值
  isSelected=clearIsSelected(isSelected);
  clearPara.value = true;
}
//request
defineComponent({
  name: "DrugResource"
})

// const drugs = [{
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

// const drugTypes = [{
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

// const diseases = [{
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
  align-content: center;
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
