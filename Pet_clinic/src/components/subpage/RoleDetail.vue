<template>
  <div class="role-detail-overlay" v-if="selectedRole">
    <div class="overlay-content">
      <!-- 左侧条目列表 -->
      <div class="entries-list">
        <h1 class="h1">{{ selectedRole.name }}</h1>
        <el-menu default-active="1" class="menu-list">
          <el-menu-item
              v-for="process in filteredProcesses"
              :key="process.processId"
              :index="process.processId"
              @click="selectedList(process.title)"
          >
            {{ process.title }}
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 右侧条目详情 -->
      <div class="entry-detail" v-if="processChosen.processId">
        <h2>{{ processChosen.title }}</h2>
        <p>{{ processChosen.content }}</p>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <button class="close-overlay" @click="closeOverlay">Close</button>
  </div>
</template>


<script setup lang="ts">
import {computed, defineComponent, ref} from 'vue';
import type {ProcessPageResponse} from "@/apis/process/process-interface";
import {processPageQuery} from "@/apis/process/process";
import {onMounted} from "vue";
import type {ProcessBO} from "@/apis/schemas";

defineComponent({
  name: "RoleDetail",
})

const props = defineProps({
  name: String
});

// Emitter for closing the overlay
const emit = defineEmits(['close']);
// Close overlay function
const closeOverlay = () => {
  emit('close');
};


// 定义角色数据结构
interface Role {
  name: string;
}

const selectedRole = computed(() => {
  return roles.find(role => role.name === props.name);
});

const filteredProcesses = computed(() => {
  return processList.value.datas.filter(process => process.type === props.name);
});

// 示例数据
const roles: Role[] = [
  {
    name: '前台',
  },
  {
    name: '医助',
  },
  {
    name: '医师',
  }

];

const processChosen = ref<ProcessBO>({
  type: '',
  title: '',
  content: '',
  processId: ''
})
function selectedList(name: string) {
  const foundProcess = processList.value.datas.find(process => process.title === name);
  processChosen.value = foundProcess || { type: '', title: '', content: '', processId: '' }; // 提供默认空对象
}

const processList = ref<ProcessPageResponse>({ datas: [], total: 0, limit: 0 });
async function fetchProcess() {
  try {
    const response = await processPageQuery();
    if (response && response.data && response.data.datas) {
      processList.value = response.data;
    }
  }
  catch (error) {
    console.error("Failed to fetch process: ", error);
  }
}

onMounted(() => {
  fetchProcess();
});
</script>



<style scoped lang="scss">
.role-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.overlay-content {
  display: flex;
  background: white;
  width: 80%; /* 调整为所需的宽度 */
  height: 80%; /* 调整为所需的高度 */
  border-radius: 10px;
}

.entries-list {
  flex: 1;
  padding: 20px;
  .h1{
    font-size: 38px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-left: 1vw;
    margin-top: 5px;
    justify-content: center;
  }
}
.entry-detail {
  flex: 2;
  padding: 20px;
}

.close-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  cursor: pointer;
}

</style>
