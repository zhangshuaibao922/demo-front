<template>
  <div class="score-container">
    <el-affix position="top" :offset="120" style="position: absolute; right: 10px;">
      <div style="display: flex; flex-direction: column; gap: 5px;">
        <el-button type="primary" @click="drawerVisible = true">资源列表</el-button>
        <el-button type="primary" @click="scoreDrawerVisible = true">打分</el-button>
      </div>
    </el-affix>
    <el-drawer
      v-model="drawerVisible"
      title="资源列表"
      direction="rtl"
      size="30%"
    >
      <el-table :data="resourceList" style="width: 100%">
        <el-table-column prop="resourceName" label="资源名称" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="showResourceDetail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-drawer
      v-model="scoreDrawerVisible"
      title="评分"
      direction="rtl"
      size="30%"
    >
      <div class="score-form">
        <div class="score-buttons">
          <el-button
            v-for="score in 11"
            :key="score"
            :type="selectedScore === score ? 'primary' : 'default'"
            @click="selectedScore = score"
          >
            {{ score - 1 }}
          </el-button>
        </div>
        <el-input
          v-model="comment"
          type="textarea"
          :rows="4"
          placeholder="请输入评价内容"
          class="comment-input"
        />
        <div class="score-actions">
          <el-button type="primary" @click="submitScore">确定</el-button>
          <el-button @click="resetScore">取消</el-button>
        </div>
      </div>
    </el-drawer>

    <div class="content-panel" :class="{ 'pdf-mode': selectedResource?.resourceType === 'pdf' }">
      <div v-if="selectedResource" class="resource-preview">
        <template v-if="selectedResource.resourceType === 'image/jpeg'||selectedResource.resourceType === 'image/png'||selectedResource.resourceType === 'jpg'">
          <img :src="selectedResource.resourceUrl" alt="图片预览" class="preview-image" />
        </template>
        <template v-else-if="selectedResource.resourceType === 'pdf'">
          <iframe :src="pdfViewerUrl" class="preview-iframe"></iframe>
        </template>
        <template v-else-if="selectedResource.resourceType === 'docx'">
          <div ref="docxContainer" class="docx-preview"></div>
        </template>
        <template v-else>
          <p>不支持预览的文件类型</p>
          <a :href="selectedResource.resourceUrl" target="_blank">点击下载查看</a>
        </template>
      </div>
      <div v-else class="no-selection">
        <p>请选择要预览的资源</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { getResourceList ,submitScoreApi} from '@/requests/resource'
import type { Resource } from '@/requests/resource/type'
import { ElTable, ElTableColumn, ElButton, ElDrawer, ElAffix, ElBacktop, ElMessage } from 'element-plus'
import { renderAsync } from 'docx-preview'
import { useInfoStore } from '@/stores/userStore.ts';
import { taskInfoStore } from '@/stores/taskInfoStore.ts';
import { useRouter } from 'vue-router';
const drawerVisible = ref(false)
const scoreDrawerVisible = ref(false)
const resourceList = ref<Resource[]>([])
const selectedResource = ref<Resource | null>(null)
const pdfBlobUrl = ref<string>('')
const docxContainer = ref<HTMLElement | null>(null)
const selectedScore = ref<number>(0)
const comment = ref<string>('')
const router = useRouter();
const taskInfo=taskInfoStore();
const userInfo = useInfoStore();
const pdfViewerUrl = computed(() => {
  if (!pdfBlobUrl.value) return ''
  return `/public/js/pdfJs/web/viewer.html?file=${encodeURIComponent(pdfBlobUrl.value)}#toolbar=0&navpanes=0&scrollbar=0`
})



const showResourceDetail = async (resource: Resource) => {
  selectedResource.value = resource
  drawerVisible.value = false
  if (resource.resourceType === 'pdf') {
    try {
      const response = await fetch(resource.resourceUrl)
      const blob = await response.blob()
      if (pdfBlobUrl.value) {
        URL.revokeObjectURL(pdfBlobUrl.value)
      }
      pdfBlobUrl.value = URL.createObjectURL(blob)
    } catch (error) {
      console.error('加载 PDF 文件失败:', error)
    }
  } else if (resource.resourceType === 'docx') {
    try {
      const response = await fetch(resource.resourceUrl)
      const blob = await response.blob()
      await nextTick()
      if (docxContainer.value) {
        docxContainer.value.innerHTML = ''
        await renderAsync(blob, docxContainer.value)
      }
    } catch (error) {
      if (docxContainer.value) {
        docxContainer.value.innerHTML = '<p style="color:red;">文档预览失败</p>'
      }
      console.error('docx预览失败', error)
    }
  }
}

const resetScore = () => {
  selectedScore.value = 0
  comment.value = ''
}

const submitScore = async () => {
  if (!comment.value) {
    ElMessage.warning('请先输入评价内容')
    return
  }
  try {
    // 这里调用后端的评分接口
    const res=await submitScoreApi({
      id: "",                     // 主键，使用可选字段
      taskId: taskInfo.taskInfo.id, // 任务名称
      userId: userInfo.user.id,     // 条件id
      userName: null,               // 抽取时间，使用 ISO 格式的字符串
      fieldId: null,                // 开始评审时间，使用 ISO 格式的字符串
      score: selectedScore.value-1,   // 结束时间，使用 ISO 格式的字符串
      description: comment.value,   // 得分
    })
    ElMessage.success('评分提交成功')
    scoreDrawerVisible.value = false
    resetScore()
    router.push('/taskone')
  } catch (error) {
    ElMessage.error('评分提交失败')
    console.error('评分提交失败:', error)
  }
}

onMounted(async () => {
  try {
    const response = await getResourceList(taskInfo.taskInfo.id)
    resourceList.value = response.data.data
  } catch (error) {
    console.error('获取资源列表失败:', error)
  }
})
</script>

<style scoped>
.score-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  gap: 20px;
}

.content-panel {
  width: 100%;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 500px;
}

.content-panel.pdf-mode {
  max-height: 1500px;
}

.resource-preview {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;

}

.preview-iframe {
  width: 100%;
  height: 1500px;
  border: none;
}

.docx-preview {
  width: 100%;
  min-height: 400px;
  background: #fff;
  overflow: auto;
  padding: 16px;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.score-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.comment-input {
  margin: 20px 0;
}

.score-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
