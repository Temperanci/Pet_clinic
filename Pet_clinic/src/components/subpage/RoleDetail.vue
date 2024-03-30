<template>
  <div class="role-detail-overlay" v-if="selectedRole">
    <div class="overlay-content">
      <!-- 左侧条目列表 -->
      <div class="entries-list">
        <h3>{{ selectedRole.name }}</h3>
        <ul>
          <li v-for="entry in selectedRole.entries" :key="entry.id" @click="selectEntry(entry)">
            {{ entry.title }}
          </li>
        </ul>
      </div>
      <!-- 右侧条目详情 -->
      <div class="entry-detail" v-if="selectedEntry">
        <h2>{{ selectedEntry.title }}</h2>
        <p>{{ selectedEntry.content }}</p>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <button class="close-overlay" @click="closeOverlay">Close</button>
  </div>
</template>



<script setup lang="ts">
import {ref, computed} from 'vue';
const props = defineProps({
  name: String
});

// Emitter for closing the overlay
const emit = defineEmits(['close']);

// Selected entry state
const selectedEntry = ref<Entry | null>(null);

// Function to handle entry selection
const selectEntry = (entry) => {
  selectedEntry.value = entry;
};

// Close overlay function
const closeOverlay = () => {
  emit('close');
};
// 定义条目数据结构
interface Entry {
  id: number;
  title: string;
  content: string;
}

// 定义角色数据结构
interface Role {
  id: number;
  name: string;
  entries: Entry[]; // 每个角色都有相关的条目列表
}

// 示例数据
const roles: Role[] = [
  {
    id: 1,
    name: '前台',
    entries: [
      // 前台相关的条目
      { id: 1, title: '接待访客', content: '负责接待进入诊所的访客，提供咨询服务。' },
      { id: 2, title: '电话服务', content: '管理来电，确保通讯畅通。' },
      // ... 更多条目
    ],
  },
  {
    id: 2,
    name: '医助',
    entries: [
      // 医助相关的条目
      { id: 1, title: '患者病历管理', content: '负责整理和管理患者的病历资料，确保资料的完整性与准确性。' },
      { id: 2, title: '协助检查', content: '在医师进行诊断和治疗时提供必要的协助，如准备工具、解释检查流程等。' },
      { id: 3, title: '跟踪患者情况', content: '负责跟踪患者的治疗进展，包括药物反应、恢复情况等，并及时向医师报告。' },
      // 更多条目...
    ],
  },
  {
    id: 3,
    name: '医师',
    entries: [
      // 医师相关的条目
      { id: 1, title: '诊断疾病', content: '根据患者的病历、体检和必要的检查结果，对患者的疾病进行诊断。' },
      { id: 2, title: '制定治疗方案', content: '根据诊断结果，为患者制定个性化的治疗计划，包括药物治疗、手术治疗等。' },
      { id: 3, title: '进行手术', content: '对需要手术治疗的患者进行手术操作，确保手术的顺利进行和患者的安全。' },
      { id: 4, title: '患者复诊', content: '定期对治疗中的患者进行复诊，评估治疗效果，调整治疗方案。' },
      // 更多条目...
    ],
  }

  // ... 其他角色及其条目
];
const selectedRole = computed(() => {
  return roles.find(role => role.name === props.name);
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
}

.entries-list, .entry-detail {
  flex: 1;
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
