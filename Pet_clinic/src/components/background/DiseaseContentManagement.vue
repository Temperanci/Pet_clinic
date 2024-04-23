<template>
    <div style="height: 100%;display: flex;flex-flow: column;">
        <div style="height: 90%;" class="table">
          <el-table :data="queryData" height="100%" empty-text="来到了没有数据的荒原...">
            <el-table-column prop="contentId" label="配置编号">
              <template #default="scope">
                <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].contentId"></el-input> -->
                <el-input v-if="searchBar[scope.$index]" v-model="edited[0].contentId"></el-input>
                <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].contentId"></el-input>
                <span v-else>{{ scope.row.contentId }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="配置名称">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].title"></el-input>
                <span v-else>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="描述">
              <template #default="scope">
                <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].content"></el-input>
                <span v-else>{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="diseaseId" label="病种">
              <template #default="scope">
                <el-select v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].diseaseId" placeholder="Select" style="width: 100%">
        <el-option
          v-for="item in diseaseOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
                <span v-else>{{ diseaseMap.get(scope.row.diseaseId) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="indexStatus" label="学习情况">
              <template #default="scope">
                <!-- <el-input v-if="isSelected[scope.$index] === true" v-model="edited[scope.$index].contentId"></el-input> -->
                <el-input v-if="searchBar[scope.$index]" v-model="edited[0].indexStatus"></el-input>
                <el-input v-else-if="unwritableBar[scope.$index]" disabled v-model="edited[scope.$index].indexStatus"></el-input>
                <span v-else-if="indexMap.get(scope.row.indexStatus)==='已学习'" style="color: green;">{{ indexMap.get(scope.row.indexStatus) }}</span>
                <span v-else style="color:grey">{{ indexMap.get(scope.row.indexStatus) }}</span>
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
    import { pageQuery as DCPageQuery ,update as DCUpdate} from "../../apis/diseaseContent/diseaseContent"
    import type { DiseaseContentPageRequest, DiseaseContentPageResponse,DiseaseContentUpdateRequest } from "@/apis/diseaseContent/diseaseContent-interface"
    import { DiseaseContent } from "@/apis/class";
    import { type rowCRUD } from '../../scripts/tableOpt'
    import { throwMessage } from "@/scripts/display";
    const DiseaseContentPage = ref<DiseaseContentPageResponse>({ datas: [], total: 0, limit: 0 });
    var searchBar = ref([false]);
    var unwritableBar = ref([false]);
    class diseaseContentRowCRUD implements rowCRUD {
      updateMsg(Msg: Object[], data: any[], index: number): void {
        (Msg[index] as DiseaseContent).contentId = data[index].contentId;
        (Msg[index] as DiseaseContent).diseaseId = data[index].diseaseId;
        (Msg[index] as DiseaseContent).title = data[index].title;
        (Msg[index] as DiseaseContent).content = data[index].content;
        (Msg[index] as DiseaseContent).indexStatus = data[index].indexStatus;
        console.log('editedDiseaseContent',Msg);
      }//更新buffer
    async  deleteRow(Msg: Object[],index:number) {
        var request:DiseaseContentUpdateRequest = {
          diseaseContent:{
            contentId:(Msg[index] as DiseaseContent).contentId,
            // title:'',
            // diseaseId:'',
            // content:'',
            indexStatus:'DELETE'
          },
        delete:false
      }
        console.log('delete request',request);
        var DCDelResponse= await DCUpdate(request);
        if(DCDelResponse){//更改成功
          if(DCDelResponse)
          throwMessage('delete success');
          setTimeout(()=>{backToHome();},500);
          
        }
        else{
          throwMessage('unknown');
        }
        console.log('delete response',DCDelResponse); 
      }//删除
    async  editRow(Msg: Object[],index:number) {
        var request:DiseaseContentUpdateRequest = {
          diseaseContent:{
            contentId:(Msg[index] as DiseaseContent).contentId,
            diseaseId:(Msg[index] as DiseaseContent).diseaseId,
            title:(Msg[index] as DiseaseContent).title,
            content:(Msg[index] as DiseaseContent).content,
            // indexStatus:(Msg[index] as DiseaseContent).indexStatus
          },
        delete:false}
        console.log('update request',request);
        var DCUpdateResponse= await DCUpdate(request);
        if(DCUpdateResponse){//更改成功
          throwMessage('update success');
          setTimeout(()=>{backToHome();},500);
        }
        else{
          throwMessage('update fail');
        }
        console.log('update response',DCUpdateResponse);
      }//修改
      clear(edited:DiseaseContent){        
        edited.diseaseId='';
        edited.content='';
        edited.contentId='';
        edited.title='';
        edited.indexStatus='';
      }
     async createRow(msg:Object){
        var request:DiseaseContentUpdateRequest = {
          diseaseContent:{
            diseaseId:(msg as DiseaseContent).diseaseId,
            title:(msg as DiseaseContent).title,
            content:(msg as DiseaseContent).content, 
          },
        delete:false}
        console.log('create request',request);
        var DCCreateResponse=await DCUpdate(request);
        if(DCCreateResponse){//更改成功
          throwMessage('create success');
          setTimeout(()=>{backToHome();},500);
        }
        else{
          throwMessage('create fail');
        }
        console.log('create response',DCCreateResponse); 
      }//创建
      search(msg:Object):void{
        console.log('msg',msg)
        fetchDiseaseContents(undefined,999,msg,true);
      }//查询
      constructor(){
    
      }
    }
    var CRUDhandler = new diseaseContentRowCRUD();
    async function fetchDiseaseContents(pageNum?:number,pageLimit?:number,msg?:Object,search?:boolean) {
      var temp = msg||{
        diseaseId:'',
        contentId:'',
        title:'',
        content:''
      }
      var request:DiseaseContentPageRequest= {
        contentId:((temp as DiseaseContent).contentId==='')?undefined:(temp as DiseaseContent).contentId,
        diseaseId:((temp as DiseaseContent).diseaseId==='')?undefined:(temp as DiseaseContent).diseaseId,
        content:((temp as DiseaseContent).content==='')?undefined:(temp as DiseaseContent).content,
        title:((temp as DiseaseContent).title==='')?undefined:(temp as DiseaseContent).title,
        currPageNo:pageNum||1,
        limit:pageLimit||20
      }
      console.log('request',request);
      try {
        const response = await DCPageQuery(request);
        if (response && response.data && response.data.datas) {
          DiseaseContentPage.value = response.data; // 假设响应中有data属性，且包含datas数组
          queryData.value = DiseaseContentPage.value.datas;
          if(search||false){
            tabLength.value = DiseaseContentPage.value.total;
          }
          else{tabLength.value = DiseaseContentPage.value.limit;}//保证搜索只有一页
          entryNum.value = DiseaseContentPage.value.total;
          isSelected=isSelectGen(tabLength.value);
          edited.value = EditedGen(tabLength.value, new DiseaseContent()) as DiseaseContent[];
          // selectPage(currentPage - 1, tableData, queryData);
          console.log('Fetched diseaseContents:', DiseaseContentPage.value.datas);
        } else {
          console.error('No data returned from the API');
        }
      } catch (error) {
        console.error('Error fetching diseaseContents:', error);
      }
    }
    onMounted(() => {
      getDiseaseInfo();
      fetchDiseaseContents(undefined,defaultNum);
    });
    //paginate
    const defaultNum =10;
    var entryNum = ref(0);
    var tabLength = ref(0);//每页展示的条目数
    const clearPara = ref(false);//让子组件复位
    const back = ref(false);//渲染back键
    var isSelected:Ref<boolean[]> = ref<boolean[]>([]);
    var edited: Ref<DiseaseContent[]> = ref<DiseaseContent[]>([]);
    var queryData = ref<any[]>([]);
    var currentPage = 1;
    function pagination(val: number) {
      currentPage = val
      if(val!=1){
    backToHome();
  }
      //恢复初始值
      isSelected=clearIsSelected(isSelected);
      clearPara.value = true;
      searchBar.value[0]=false;
      unwritableBar.value[0]=false;
    }
    function backToHome(){
      fetchDiseaseContents(currentPage,defaultNum);
    }
    //filter && view
    import { pageQuery as diseasePageQuery } from "@/apis/disease/disease";
    import { type DiseasePageRequest } from '@/apis/disease/disease-interface';
    const diseaseOptions: Ref<any[]> = ref<any[]>([])
    const diseaseMap:Ref<Map<any,any>> = ref<Map<any,any>>(new Map());
    async function getDiseaseInfo() {
      var request: DiseasePageRequest = {
    limit: 999
  }
  try {
    var diseaseResponse = await diseasePageQuery(request);
    if (diseaseResponse && diseaseResponse.data && diseaseResponse.data.datas) {
      console.log('Fetched diseases:', diseaseResponse.data.datas);
      for (var i = 0; i < diseaseResponse.data.datas.length; i++) {
        diseaseOptions.value.push({
          value: diseaseResponse.data.datas[i].diseaseId,
          label: diseaseResponse.data.datas[i].name
        });
        diseaseMap.value.set(diseaseResponse.data.datas[i].diseaseId, diseaseResponse.data.datas[i].name);
      }
      console.log('deptMap', diseaseMap)
    } else {
      console.error('No data returned from the API');
    }

  } catch (error) {
    console.error('Error fetching diseases:', error);
  }
    }
//filter && display
const indexMap= new Map([
  ["NO_INDEX","学习中"],
  ["HAS_INDEX","已学习"]
]);
    const component = defineComponent({
      name: "DiseaseContent"
    })
    </script>
    
    <style scoped lang="scss">
    // .el-table__body, .el-table__header{
    //     width: 100%;
    //   }
    </style>
    ../../scripts/data.js../../scripts/paginate.js