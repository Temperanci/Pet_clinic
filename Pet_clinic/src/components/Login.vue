<template>
    <div class="login-body">
        <div class="login-panel">
            <div class="login-title">用户登录</div>
            <el-form :model="formData" :rules="rules" ref="formDataRef">
                <el-form-item prop="username">
                    <el-input placeholder="请输入账号" v-model="formData.username" size="large" type="text">
                        <template #prefix>
                            <el-icon>
                                <i-ep-user />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码"  show-password v-model="formData.password" size="large" type="password"
                      >
                        <template #prefix>
                            <el-icon>
                                <i-ep-lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label="">
                    <div class="check-code-panel">
                        <el-input placeholder="请输入验证码" v-model="formData.checkCode" class="input-panel" />
                        <img src="checkCodeUrl" class="check-code">
                    </div>
                </el-form-item> -->
                <!-- <el-form-item label="">
                    <el-checkbox label="记住密码" name="type" />
                </el-form-item> -->
                <el-form-item label="">
                    <el-button type="primary" style="width: 100%;" @click="Login();" size="large">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineComponent} from 'vue'
import { ref, reactive, } from 'vue'
// Element-Plus的依赖采用的是自动导入，所以这里无需显示的引入，其他地方的element-plus引用同理
// import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

// const checkCodeUrl = "api/checkCode?" + new Date().getTime();
//表单
const formDataRef = ref();
let formData = reactive({
    username: "",
    password: ""
});
const rules = {
    username: [{
        required: true,
        message: "请输入用户名"
    }],
    password: [{
        required: true,
        message: "请输入密码"
    },
    {
    pattern:/^.{8,20}$/,
    message:"密码应该包含8~20个字符"
  },
  // {
  //   pattern:/^.{,20}$/,
  //   message:"密码最多为20个字符"
  // },
  {
    pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]/,
    message:"密码应该包含大小写字母数字和特殊字符"
  }
  ],
    // checkCode: [{
    //     required: true,
    //     message: "请输入验证码"
    // }],
}

const router = useRouter();
defineComponent({
  name: "LogIn"
})
// const login = () => {
//     var form_obj = JSON.parse(JSON.stringify(formData));
//     // console.log(form_obj);
//     // console.log(form_obj.username);
//     // console.log(form_obj.password);

//     request.post("/user/login", form_obj).then(res => {
//         if (res) {
//             ElMessage({
//                 message: '登录成功',
//                 type: 'success',
//             })

//             let tokenObj = { token: " isLogin", startTime: new Date().getTime() };
//             window.localStorage.setItem("isLogin", JSON.stringify(tokenObj));
//             localStorage.setItem("username", JSON.parse(JSON.stringify(formData.username)));

//             router.push("/");
//         } else {
//             ElMessage.error('账号或密码错误！！！登录失败！！！')
//         }
//     });
// };
//登录逻辑
import {defineEmits} from 'vue'
import { store } from '@/main';
import { StorageToken } from '@/scripts/storage';
import { type PersonnelPageRequest,type PersonnelPageResponse } from '@/apis/personnel/personnel-interface';
import { pageQuery as personnelPageQuery } from '@/apis/personnel/personnel';
import { onMounted } from 'vue';
import { throwMessage } from '@/scripts/display';
const emit = defineEmits(['switch'])
function Switch(n:number){
    emit('switch',n)
}
// const userPhone = ref('')
// const userName = ref('')
// const userPwdLogin = ref('')
// const userPwdRegister = ref('')
// const userPwdConfirm = ref('')

async function Login(){
  await LoginRequest(formData.username,formData.password);
  if(PersonnelPage.value.datas.length>0){
    if(PersonnelPage.value.datas[0].status!='banned'){
      let token = PersonnelPage.value.datas[0];
    store.commit('setToken',token)
    router.push('home');
    
    console.log('Login.userName',store.state.token.name)
    console.log('Login.userPhone',store.state.token.phoneNumber)
    }else{
      throwMessage('banned');
    }
    
  }
  else{
    throwMessage('No user or wrong psw');
  }
}
// function Register(){
//
// }
function refreshLogin(){
  if(StorageToken.get('token')!==null){
    store.commit('setToken',StorageToken.get('token'));
    router.push('home');
    console.log('refreshLogin.store.state.token',store.state.token);
  }
  console.log('refreshLogin.StrorageToken',StorageToken.get('token'))
}
const PersonnelPage = ref<PersonnelPageResponse>({ datas: [], total: 0, limit: 0 });
async function LoginRequest(phone:string,pwd:string){
  let request:PersonnelPageRequest={
    phoneNumber:phone,
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
</script>

<style lang="scss" scoped >
.login-body {
    background: url("../assets/img/R.jpg") no-repeat center center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;

    .login-panel {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;

        padding: 25px;
        width: 26%;
        min-width: 460px;
        height: 30%;
        min-height: 300px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 5%;
        box-shadow: 2px 2px 10px #ddd;

        .login-title {
            font-size: 22px;
            text-align: center;
            margin-bottom: 22px;
        }
    }
}
</style>