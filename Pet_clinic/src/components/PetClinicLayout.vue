<template>
  <el-container>
    <el-header>
      <div class="h1">
        Pet Clinic 宠物医院在线导览
      </div>
      <el-card v-if="ifLogined" shadow="hover">
        <div class="card-container">
          <div class="card-left">
            <el-avatar :size="40" />
            <el-text>{{userName}}</el-text>
          </div>
          <div class="card-right">
            <div style="width: 100%;margin:auto;">
              <el-text  v-if="userStatus === 0" @click="Switch(0)">后台页面</el-text>
            </div>
            <!-- <el-divider /> -->
            <div style="height: 50%;">
              <el-text @click="Logout">注销</el-text>
            </div>
            
          </div>
        </div>
      </el-card>
      <div v-else class="login">
        <el-popover
          :visible="loginVisible"
          placement="left"
          :width="300"
          style="display: flex;flex-direction: column;">
          <template #reference>
            <el-button class="loginBtn" @click="()=>{loginVisible=!loginVisible;registerVisible=false;}">登录</el-button>
          </template>
          <div style="width: 100%;">
            <el-input v-model="userName" class="input" placeholder="用户名" />
          </div>
          <div style="width: 100%;">
            <el-input v-model="userPwdLogin" type="password" show-password class="input" placeholder="密码" />
          </div>
          <div style="width: 100%;">
            <el-button class="Btn" @click="Login">登录</el-button>
            <el-button class="Btn" @click="()=>loginVisible=false">取消</el-button>
          </div>
        </el-popover>
        <el-popover
          :visible="registerVisible"
          placement="left"
          :width="300">
          <template #reference>
            <el-button class="registerBtn" @click="()=>{registerVisible=!registerVisible;loginVisible=false;}">注册</el-button>
          </template>
          <div >
            <el-input v-model="userName" class="input" placeholder="用户名" />
          </div>
          <div>
            <el-input v-model="userPwdRegister" type="password" show-password class="input" placeholder="密码" />
          </div>
          <div>
            <el-input v-model="userPwdConfirm" type="password" show-password class="input" placeholder="确认密码" />
          </div>
          <div style="width: 100%;">
            <el-button class="Btn" @click="Login">注册</el-button>
            <el-button class="Btn" @click="()=>registerVisible=false">取消</el-button>
          </div>
        </el-popover>
      </div>

    </el-header>
    <el-main>
      <el-menu mode="horizontal"
               :default-active="activeIndex"
               @select="handleSelect"
      >
        <el-menu-item index="1">医院导览</el-menu-item>
        <el-menu-item index="2">科室详情</el-menu-item>
        <el-menu-item index="3">药品资源</el-menu-item>
        <el-menu-item index="4">服务收费</el-menu-item>
        <el-menu-item index="5">床位查询</el-menu-item>
        <el-menu-item index="6">职能学习</el-menu-item>
      </el-menu>
      <div class="content-area">
        <!-- 动态组件会在这里渲染 -->
        <ClinicGuidance v-if="activeIndex === '1'" @marker-clicked="markerClicked" />
        <DepartmentDetails v-if="activeIndex === '2'" :name="selectedDepartmentName" />
        <DrugResource v-if="activeIndex === '3'" />
        <ServiceCharge v-if="activeIndex === '4'" />
        <BedInquiry v-if="activeIndex === '5'" />
        <FunctionalStudy v-if="activeIndex === '6'" />
      </div>
    </el-main>
    <el-footer>
      <el-text>© 2024 Pet Clinic Online   All right reserved</el-text>
    </el-footer>
  </el-container>
</template>
<script lang="ts">
const ifLogined = ref(false)//false:未登录
</script>
<script setup lang="ts">
import { defineComponent } from 'vue'
import type { DefineComponent } from 'vue';
import { ref } from 'vue'
import ClinicGuidance from './subpage/ClinicGuidance.vue'
import ServiceCharge from './subpage/ServiceCharge.vue'
import DepartmentDetails from './subpage/DepartmentDetails.vue'
import DrugResource from './subpage/DrugResource.vue'
import BedInquiry from './subpage/BedInquiry.vue'
import FunctionalStudy from './subpage/FunctionalStudy.vue'
import {accout} from  '../scripts/data'
import {store} from '@/main'
import { onMounted } from 'vue';
import {StorageToken} from '../scripts/storage'
import { Personnel } from '@/apis/class';
import type { PersonnelPageRequest, PersonnelPageResponse,PersonnelUpdateRequest } from "@/apis/personnel/personnel-interface"
import { pageQuery as personnelPageQuery } from "@/apis/personnel/personnel"
defineComponent({
  name: "PetClinicLayout"
})
const emit = defineEmits(['switch'])
function Switch(n:number){
    emit('switch',n)
}
interface ComponentsMap {
  [key: string]: DefineComponent<{}, {}, any>;
}
const componentsMap: ComponentsMap = {
  '1': ClinicGuidance,
  '2': DepartmentDetails,
  '3': DrugResource,
  '4': ServiceCharge,
  '5': BedInquiry,
  '6': FunctionalStudy
  // 对应的其他组件...
}

const activeIndex = ref('1')
const currentComponent = ref(componentsMap[activeIndex.value])
const selectedDepartmentName = ref("");
const userStatus = ref(0)//0:管理 1:路人
const loginVisible = ref(false)
const registerVisible = ref(false)
const handleSelect = (index: string) => {
  activeIndex.value = index
  currentComponent.value = componentsMap[index]
}
// TODO:登录注册的详细逻辑

const userName = ref('')
const userPwdLogin = ref('')
const userPwdRegister = ref('')
const userPwdConfirm = ref('')

async function Login(){
  await LoginRequest(userName.value,userPwdLogin.value);
  if(PersonnelPage.value.datas.length>0){
    ifLogined.value = true;
    userStatus.value = 1;//路人
    if(PersonnelPage.value.datas[0].role==="管理员"){
      userStatus.value = 0;
    }
    let token = new Personnel();
    token.name = userName.value;
    token.password = userPwdLogin.value;
    store.commit('setToken',token)
    console.log('Login.userName',store.state.token.name)
  }
}
function Register(){

}
function Logout(){
  userName.value='';
  userPwdLogin.value='';
  userStatus.value=1;
  ifLogined.value=false;
  store.commit('clearToken');
}
function refreshLogin(){
  if(StorageToken.get('token')!==null){
    store.commit('setToken',StorageToken.get('token'));
    ifLogined.value = true;
    userStatus.value = accout.status;
    userName.value = store.state.token.name;
    console.log('refreshLogin.store.state.token',store.state.token);
  }
  console.log('refreshLogin.StrorageToken',StorageToken.get('token'))
}
const PersonnelPage = ref<PersonnelPageResponse>({ datas: [], total: 0, limit: 0 });
async function LoginRequest(name:string,pwd:string){
  let request:PersonnelPageRequest={
    name:name,
    password:pwd
  }
  console.log('LoginRequest.request',request);
  try {
    const response:any = await personnelPageQuery(request||undefined);
    if (response && response.data && response.data.datas) {
      PersonnelPage.value = response.data; // 假设响应中有data属性，且包含datas数组
      console.log('Fetched personnels:', PersonnelPage.value.datas);
      // selectPage(currentPage - 1, tableData, queryData);
    } else {
      console.error('No data returned from the API');
    }
  } catch (error) {
    console.error('Error fetching personnels:', error);
  }
  console.log('LoginRequest.PersonnelPage');
}

onMounted(() => {
  console.log('onMounted','success');
  refreshLogin();
});
// 当 marker 被点击时调用
const markerClicked = (name: string) => {
  // 切换到科室详情页面
  activeIndex.value = '2';
  // 设置选中的科室 ID
  selectedDepartmentName.value = name;
};

</script>


<style scoped lang="scss">
.test{
  z-index: 999;
}
.el-container {
  height: 100vh;
  width: 100vw;
  background-color: #fcf7f4;
}
.el-header {
  height: 10vh;
  display: flex;
  font-size: x-large;
  font-weight: bold;
  color: #be9367;
  align-items: center;
  .h1{
    width: 90%;
    font-size: xx-large;
  }
  .el-card{
    width: 15vw;
    height: 10vh;
    background-color: #f6efef;
    margin-top: 2vh;
    .card-container {
      display: flex;
      justify-content: space-between; /* 根据需要选择 space-between 或其他 */
      align-items: center; /* 垂直居中 */
      margin-top: -1.5vh;
      .card-left{
        display: flex;
        justify-content: center;
        padding: 1vw 1vw 1vw 0 ;
        border-right: #DCDFE6 solid 2px;
        .el-avatar{
          margin-right: 0.5vw;
          margin-left: -0.5vw;
        }
        .card-right{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      }
      
    }
  }
}

.el-main{
  height: 87vh;
  width: 100%;
  display: grid;
  .el-menu{
    height: 6vh;
    flex-grow: 1;
    justify-content: center;
    background-color: #f6efef;
    --active-color: #be9367
  }
  .el-menu-item{
    width: 15vw;
    font-size: large;
  }
  .content-area{
    height: 70vh;
    display: flex;
    justify-content: center;
    overflow: auto;
  }
}
.el-footer{
  height: 3vh;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
  background-color: #ece2e2;
  color: #909399;
}
.login {
  width: 10%;
  display: flex;
  flex-direction: column;
  .loginBtn{
    margin: 0;
    border-radius: 0;
  }
  .registerBtn{
    margin: 0;
    border-radius: 0;
  }
}
.input {
      margin-left: auto;
      margin-bottom: 10px;
      width: 280px;
      }
.Btn{
  margin-left: 60px;
  width:47px;
}
</style>
