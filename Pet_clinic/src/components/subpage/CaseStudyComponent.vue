<template>
  <div class="study-panel">
    <el-menu
        class="el-menu-vertical-demo"
    >
      <!-- 遍历疾病列表，为每个疾病创建菜单项 -->
      <el-menu-item
        v-for="disease in diseasePage.datas"
        :key="disease.diseaseId"
        :index="disease.diseaseId"
        @click="showCaseDetails(disease)"
      >
        {{ disease.name }}
      </el-menu-item>
    </el-menu>
    <div class="case-details" v-if="selectedCase">
      <h1>{{ selectedCase.name }}</h1>
      <p>{{ selectedCase.desc }}</p>
      <el-divider />
      <p>病例列表：(点击条目展开详情)</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <el-button type="primary" @click="showDialog = true">上传病例</el-button>
      </div>
      <el-dialog title="上传新病例" v-model="showDialog">
        <el-form ref="uploadForm" :model="form">
          <el-form-item label="病例详情">
            <el-input type="textarea" v-model="form.details"></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              class="upload-demo"
              drag
              multiple
              :on-change="handleFileChange"
              :on-preview="handlePreview"
              :auto-upload="false"
              v-model:file-list="form.fileList"
              list-type="picture">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传视频">
            <el-upload
              class="upload-demo"
              drag
              multiple
              :on-change="handleFileChange"
              :auto-upload="false"
              v-model:file-list="form.videoList">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button @click="showDialog = false">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </span>
        </template>
      </el-dialog>

      <el-collapse v-model="activeInstance" accordion class="collapse-area">
        <el-collapse-item
          v-for="instance in selectedCaseInstance"
          :key="instance.instanceId"
          :name="instance.instanceId"
          class="instance-item"
        >
          <template #title>
            <h2>病情描述：{{ instance.desc }}</h2>
          </template>
          <div>
            <!-- 在这里可以放置病例的详细内容，如图片、视频等 -->
            <p>病例ID：{{ instance.instanceId }}</p>
            <img
              v-for="(picUrl, index) in instance.pictureUrlList"
              :key="index"
              :src="picUrl"
              alt="病例图片"
              class="case-image"
            >
            <!-- 如果有视频URL列表，展示所有视频 -->
            <video
              v-for="(videoUrl, index) in instance.fileUrlList"
              :key="index"
              :src="videoUrl"
              controls
              class="case-video"
            ></video>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineComponent, onMounted, ref, reactive, watch} from 'vue'
import {ElForm, ElMenu, ElMenuItem, ElDialog, ElMessageBox, ElMessage} from 'element-plus'
import type { UploadProps, UploadFile} from 'element-plus'
import { pageQuery as DiseasePageQuery } from '@/apis/disease/disease'
import type { DiseaseBO, DiseaseInstanceBO } from '@/apis/schemas'
import type { DiseasePageResponse } from '@/apis/disease/disease-interface'
import type { DiseaseInstancePageResponse } from '@/apis/diseaseInstance/diseaseInstance-interface'
import { pageQuery } from '@/apis/diseaseInstance/diseaseInstance'
import { update } from '@/apis/diseaseInstance/diseaseInstance'
import type { DiseaseInstanceUpdateRequest } from "@/apis/diseaseInstance/diseaseInstance-interface";
import axios from "axios";
import {requestUploadLink} from "@/apis/fileStore/fileStore";

// 声明组件名称
defineComponent({
  name: 'CaseStudyComponent'
})

// 定义疾病页面的响应式数据
const diseasePage = ref<DiseasePageResponse>({ datas: [], total: 0, limit: 0 })
// 定义选中的疾病详情
const selectedCase = ref<DiseaseBO | null>(null)
const activeInstance = ref(null)

// 定义获取疾病列表的函数
async function fetchDisease() {
  try {
    const response = await DiseasePageQuery()
    diseasePage.value = response.data
  } catch (error) {
    console.error('Failed to fetch disease:', error)
  }
}
const diseaseInstance = ref<DiseaseInstancePageResponse>({ datas: [], total: 0, limit: 0 })
const selectedCaseInstance = ref<DiseaseInstanceBO[] | null>(null)
async function fetchDiseaseInstance() {
  try {
    const response = await pageQuery()
    // console.log('response:', response)
    diseaseInstance.value = response.data
  } catch (error) {
    // console.error('Failed to fetch diseaseInstance:', error);
  }
}

// 定义展示疾病详情的函数
function showCaseDetails(disease: DiseaseBO) {
  selectedCase.value = disease
  selectedCaseInstance.value = diseaseInstance.value.datas.filter(
    (item) => item.diseaseId === disease.diseaseId
  )
}

// 组件挂载后获取疾病数据

onMounted(() => {
  fetchDisease()
  fetchDiseaseInstance()
})

const showDialog = ref(false)
const uploadForm = ref<InstanceType<typeof ElForm>>()

const form = reactive({
  details: '',
  fileList: [], // 这里假设 fileList 是 File 类型的数组
  videoList: [], // 同上，videoList 是 File 类型的数组
});

// 监控 form 对象中所有属性的变化
watch(() => form, (newForm) => {
  console.log('Form changed:', newForm);
}, {
  deep: true  // 设置 deep 为 true 来侦听嵌套属性
});

function handleFileChange(file: any) {
  console.log('File changed:', file)
}

function submitForm() {
  ElMessageBox.confirm('确定要提交这个病例吗？', '提交确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    uploadForm.value?.validate(async (valid: boolean) => {
      if (valid) {
        try {
          // 上传图片和视频
          const pictureUrls = await uploadFiles(form.fileList);
          const videoUrls = await uploadFiles(form.videoList);
          console.log('上传成功', pictureUrls, videoUrls, selectedCase.value?.diseaseId);

          // 提交表单和文件
          const request:DiseaseInstanceUpdateRequest = {
            diseaseInstance: {
              desc: form.details,
              time: Date.now(),
              diseaseId: selectedCase.value?.diseaseId,
              pictureUrlList: pictureUrls,
              fileUrlList: videoUrls,
              // ...其他表单数据
            }
          };
          const updateResponse = await update(request);
          console.log('病例更新成功', updateResponse);
          ElMessage({
            message: '病例提交成功',
            type: 'success',
            duration: 3000 // 显示3秒后消失
          });
          await refreshCurrentCase(); // 刷新当前病例
          showDialog.value = false; // 关闭对话框
        } catch (error) {
          console.error('提交数据失败', error);
          ElMessage.error('病例提交失败');
        }
      } else {
        console.log('表单验证失败');
        ElMessage.error('表单验证失败');
      }
    });
  }).catch(() => {
    console.log('取消提交');
    ElMessage.info('取消提交');
  });
}
async function uploadFiles(files: UploadFile[]) {
  const urls = [];
  for (const file of files) {
    const extension = file.name.slice(file.name.lastIndexOf(".")); // 获取扩展名，包括点
    console.log('Extension:', extension)
    const { uploadUrl, downloadUrl } = await requestUploadLink({ extension });
    await axios.put(uploadUrl, file.raw, {
      headers: { 'Content-Type': file.raw?.type }
    });
    urls.push(downloadUrl);
  }
  return urls;
}
async function refreshCurrentCase() {
  if (selectedCase.value) {
    await fetchDisease();  // 重新获取疾病列表
    await fetchDiseaseInstance();  // 重新获取疾病实例
    showCaseDetails(selectedCase.value);  // 刷新显示的疾病详情
  }
}
const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}
</script>

<style scoped lang="scss">
.study-panel {
  display: flex;
  justify-content: center; // 垂直居中
  width: 100vw; // 视口宽度
  height: 100vh; // 视口高度
}

.el-menu-vertical-demo {
  background-color: #fff; // 菜单背景色
  width: 20%; // 根据需要调整宽度
  max-height: 90vh; // 最大高度占视口的80%
  overflow-y: auto; // 内容超出时垂直滚动
  border-radius: 20px;
  border: #3d3a3a 1px solid;
}

.case-details {
  background-color: #fff; // 详情背景色
  margin-left: 10px; // 与菜单的间隔
  padding: 20px; // 内边距
  width: 60%; // 根据需要调整宽度
  max-height: 85vh; // 最大高度占视口的80%
  border-radius: 20px;
  border: #2a1f1f 1px solid;
}
.collapse-area {
  height: 60vh;
  overflow: scroll;
}
.instance-item {
  justify-content: space-around;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  border: #2a1f1f 1px solid;
}
.case-images,
.case-videos {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.case-image {
  width: 48%; /* 每张图片占行宽的48%，留下一些空间以避免精确到100%导致换行 */
  margin-bottom: 10px; /* 添加底部间隔 */
}

.case-video {
  width: 100%; /* 视频宽度占满整个容器宽度 */
  margin-bottom: 10px; /* 添加底部间隔 */
}
.el-dialog {
  z-index: 2000; /* 或更高，取决于其他元素的z-index */
}
</style>
