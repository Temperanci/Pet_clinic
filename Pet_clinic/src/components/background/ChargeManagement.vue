<template>
<div style="height: 100%;display: flex;flex-flow: column;">
    <div style="height: 90%;" class="table">
      <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
        <el-table-column prop="serviceId" label="服务编号">
          <template #default="scope">
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].serviceId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].serviceId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].serviceId"></el-input>
            <span v-else>{{ scope.row.serviceId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="服务名称">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].title"></el-input>
            <span v-else>{{ scope.row.title }}</span>
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
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].priceId"></el-input> -->
            <el-input v-if="searchBar[scope.$index]" v-model="edited[0].priceId"></el-input>
            <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].priceId"></el-input>
            <span v-else>{{ scope.row.priceId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格">
          <template #default="scope">
            <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].price"></el-input>
            <span v-else>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentId" label="科室">
          <template #default="scope">
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].departmentId" placeholder="Select" style="width: 100%">
    <el-option
      v-for="item in deptOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
            <span v-else>{{ deptMap.get(scope.row.departmentId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="服务类型">
          <template #default="scope">
            <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].type" placeholder="Select" style="width: 100%">
    <el-option
      v-for="item in typeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
            <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].type"></el-input> -->
            <span v-else>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <tableOption 
          :clear=clearPara
          :num = tabLength
          :back = back
          @edit-confirm="(index)=>{CRUDhandler.editRow(edited,index);}"
          @edit="(index) => { CRUDhandler.updateMsg(edited,queryData,index);isSelected[index] = !isSelected[index]; clearPara=false;}" 
          @cancel="(index) =>{isSelected[index] = !isSelected[index]; clearPara=false;unwritableBar[0]=false;searchBar[0]=false;}"
          @delete="(index) =>{CRUDhandler.updateMsg(edited,queryData,index);clearPara=false;}"
          @delete-confirm="(index)=>{CRUDhandler.deleteRow(edited,index);}"
          @create="(index)=>{CRUDhandler.clear(edited[index]);isSelected[index] = true;clearPara=false;unwritableBar[0]=true;}"
          @create-confirm="(index)=>{CRUDhandler.createRow(edited[index]);unwritableBar[0]=false;}"
          @search="(index)=>{CRUDhandler.clear(edited[index]);isSelected[index] = true;clearPara=false;searchBar[0]=true;}"
          @search-confirm="(index)=>{CRUDhandler.search(edited[index]);searchBar[0]=false;back=true;}"
          @back="backToHome();back=false;"
          />
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination @current-change="pagination" layout="prev, pager, next" :total="getPagination(entryNum,tabLength)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
//分页
import { ref } from 'vue'
import { getPagination, LENGTH } from '../../scripts/paginate'
import '@/assets/table.css'
//request
import tableOption from "../subComponents/tableOption.vue";
import { isSelectGen, EditedGen,clearIsSelected } from "../subComponents/tableOption.vue";
import { onMounted } from "vue";
import type { Ref } from "vue";
import { pageQuery ,update} from "../../apis/price/price"
import type { PricePageRequest, PricePageResponse,PriceUpdateRequest } from "@/apis/price/price-interface.ts"
import { Price } from "@/apis/class";
import { type rowCRUD } from '../../scripts/tableOpt'
import { throwMessage } from "@/scripts/display";
const PricePage = ref<PricePageResponse>({ datas: [], total: 0, limit: 0 });
var searchBar = ref([false]);
var unwritableBar = ref([false]);
class priceRowCRUD implements rowCRUD {
  updateMsg(Msg: Object[], data: any[], index: number): void {
    (Msg[index] as Price).priceId = data[index].priceId;
    (Msg[index] as Price).type = data[index].type;
    (Msg[index] as Price).departmentId = data[index].departmentId;
    (Msg[index] as Price).serviceId = data[index].serviceId;
    (Msg[index] as Price).title = data[index].title;
    (Msg[index] as Price).price = data[index].price;
    (Msg[index] as Price).desc = data[index].desc;
    console.log('editedPrice',Msg);
  }//更新buffer
async  deleteRow(Msg: Object[],index:number) {
    var request:PriceUpdateRequest = {
      price:{
        priceId:(Msg[index] as Price).priceId,
        price:0,
        title:'',
        type:'',
        departmentId:'',
        desc:'',
        serviceId:''  
      },
    delete:true}
    console.log('delete request',request);
    var chargeDelResponse= await update(request);
    if(chargeDelResponse){//更改成功
      throwMessage('delete fail');
    }
    else{
      throwMessage('delete success');
      setTimeout(()=>{backToHome();},500);
    }
    console.log('delete response',chargeDelResponse); 
  }//删除
async  editRow(Msg: Object[],index:number) {
    var request:PriceUpdateRequest = {
      price:{
        priceId:(Msg[index] as Price).priceId,
        type:(Msg[index] as Price).type, 
        departmentId:(Msg[index] as Price).departmentId,
        serviceId:(Msg[index] as Price).serviceId,
        title:(Msg[index] as Price).title,
        price:(Msg[index] as Price).price,
        desc:(Msg[index] as Price).desc,
      },
    delete:false}
    console.log('update request',request);
    var chargeUpdateResponse= await update(request);
    if(chargeUpdateResponse){//更改成功
      throwMessage('update success');
      setTimeout(()=>{backToHome();},500);
    }
    else{
      throwMessage('update fail');
    }
    console.log('update response',chargeUpdateResponse);
  }//修改
  clear(edited:Price){
    edited.priceId='';
    edited.departmentId='';
    edited.type='';
    edited.desc='';
    edited.price=0;
    edited.serviceId='';
    edited.title='';
  }
 async createRow(msg:Object){
    var request:PriceUpdateRequest = {
      price:{
        type:(msg as Price).type, 
        departmentId:(msg as Price).departmentId,
        title:(msg as Price).title,
        price:(msg as Price).price,
        desc:(msg as Price).desc, 
      },
    delete:false}
    console.log('create request',request);
    var chargeCreateResponse=await update(request);
    if(chargeCreateResponse){//更改成功
      throwMessage('create success');
      setTimeout(()=>{backToHome();},500);
    }
    else{
      throwMessage('create fail');
    }
    console.log('create response',chargeCreateResponse); 
  }//创建
  search(msg:Object):void{
    console.log('msg',msg)
    fetchPrices(undefined,999,msg,true);
  }//查询
  constructor(){

  }
}
var CRUDhandler = new priceRowCRUD();
async function fetchPrices(pageNum?:number,pageLimit?:number,msg?:Object,search?:boolean) {
  var temp = msg||{
    priceId:'',
    type:'',
    departmentId:'',
    serviceId:'',
    title:'',
    price:0,
    desc:''
  }
  var request:PricePageRequest= {
    priceId:((temp as Price).priceId==='')?undefined:(temp as Price).priceId,
    type:((temp as Price).type==='')?undefined:(temp as Price).type, 
    departmentId:((temp as Price).departmentId==='')?undefined:(temp as Price).departmentId,
    serviceId:((temp as Price).serviceId==='')?undefined:(temp as Price).serviceId,
    price:((temp as Price).price===0)?undefined:(temp as Price).price,
    desc:((temp as Price).desc==='')?undefined:(temp as Price).desc,
    title:((temp as Price).title==='')?undefined:(temp as Price).title,
    currPageNo:pageNum||1,
    limit:pageLimit||20
  }
  console.log('request',request);
  try {
    const response = await pageQuery(request||undefined);
    if (response && response.data && response.data.datas) {
      PricePage.value = response.data; // 假设响应中有data属性，且包含datas数组
      queryData.value = PricePage.value.datas;
      if(search||false){
        tabLength.value = PricePage.value.total;
      }
      else{tabLength.value = PricePage.value.limit;}//保证搜索只有一页
      entryNum.value = PricePage.value.total;
      isSelected=isSelectGen(tabLength.value);
      edited.value = EditedGen(tabLength.value, new Price()) as Price[];
      // selectPage(currentPage - 1, tableData, queryData);
      console.log('Fetched prices:', PricePage.value.datas);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
}
onMounted(() => {
  getDeptInfo();
  fetchPrices(undefined,defaultNum);
});
//paginate
const defaultNum =10;
var entryNum = ref(0);
var tabLength = ref(0);//每页展示的条目数
const clearPara = ref(false);//让子组件复位
const back = ref(false);//渲染back键
var isSelected:Ref<boolean[]> = ref<boolean[]>([]);
var edited: Ref<Price[]> = ref<Price[]>([]);
var queryData = ref<any[]>([]);
var currentPage = 1;
function pagination(val: number) {
  currentPage = val
  if(!back.value){
    backToHome();
  }
  //恢复初始值
  isSelected=clearIsSelected(isSelected);
  clearPara.value = true;
  searchBar.value[0]=false;
  unwritableBar.value[0]=false;
}
function backToHome(){
  fetchPrices(currentPage,defaultNum);
}
//filter && view
import { pageQuery as deptPageQuery } from "@/apis/department/department";
import { type DepartmentPageRequest } from '@/apis/department/department-interface';
const deptOptions: Ref<any[]> = ref<any[]>([])
  const deptMap:Ref<Map<any,any>> = ref<Map<any,any>>(new Map());
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
const typeOptions = [
  {
    label:'药品',
    value:'药品'
  },
  {
    label:'服务',
    value:'服务'
  }
]
const component = defineComponent({
  name: "ChargeManagement"
})
const columnMap = new Map([
  ['priceId','收费编号'],
  ['type','类型'],
  ['serviceId','服务编号'],
  ['title','标题'],
  ['price','价格'],
  ['departmentId','科室编号']
])
</script>

<style scoped lang="scss">
// .el-table__body, .el-table__header{
//     width: 100%;
//   }
</style>
../../scripts/data.js../../scripts/paginate.js