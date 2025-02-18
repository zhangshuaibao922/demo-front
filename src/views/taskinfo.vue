<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {CirclePlus, Delete, RefreshRight} from "@element-plus/icons-vue";
import type {resource, resourceDto} from "@/requests/taskinfo/type.ts";
import {add, deleteTableDataApi, getTableDataApi} from "@/requests/taskinfo/taskinfo.ts";
import { taskInfoStore } from '@/stores/taskInfoStore.ts';
import {useInfoStore} from "@/stores/userStore.ts"
import { useRouter } from 'vue-router';
import {cloneDeep} from "lodash-es";
import {ElMessage} from "element-plus";
const router = useRouter();
const taskInfo=taskInfoStore();
const userInfo=useInfoStore();
const loading = ref<boolean>(false)
// 修改 ref 类型声明（在文件顶部）
const fileInput = ref<HTMLInputElement | null>(null); // 原为 ref(null)
const resourceData= ref<resourceDto[]>([])
const fileName=ref('')
const dialogVisible=ref(false)

// 修改后的处理函数
const handleFileChange = () => {
  const files = fileInput.value?.files; // 现在能正确识别 files 属性
  if (files && files.length > 0) {
    const file = files[0];
    console.log('选择的文件:', file.name);
    fileName.value=file.name;
    ElMessage.success("文件选择成功");
    dialogVisible.value=true;
  }
};
// 修改后的上传处理
const uploadFile = async () => {
  loading.value = true;
  const files = fileInput.value?.files;

  if (!files || files.length === 0) {
    ElMessage.warning('请选择要上传的文件');
    loading.value = false;
    return;
  }
  const formData = new FormData();
  formData.append('file', files[0]); // 单文件上传字段

  try {
    await add(taskInfo.taskInfo.id, userInfo.user.id, formData);
    ElMessage.success('文件上传成功');
    dialogVisible.value=false;
    fileName.value=''
    loading.value = true;
    const response=await getTableDataApi(taskInfo.taskInfo.id);
    resourceData.value=response.data.data;
    loading.value = false;
  } catch (error) {
    ElMessage.error('文件上传失败');
    console.error('上传错误:', error);
  }
};
const select=async ()=>{
  fileInput.value?.click();
}
const reFlash=async ()=>{
  loading.value = true;
  const response=await getTableDataApi(taskInfo.taskInfo.id);
  resourceData.value=response.data.data;
  loading.value = false;
}
function resetForm(){
  dialogVisible.value=false;
  fileName.value='';
}
const toOpen=async (data:resourceDto)=>{
  window.open(data.resourceUrl,'_blank');
}
const deleteResource = (data:resourceDto) => {
  loading.value = true;
  deleteTableDataApi(data.id).then(async () => {
    ElMessage.success("删除成功");
    const response = await getTableDataApi(taskInfo.taskInfo.id);
    resourceData.value = response.data.data;
    loading.value = false;
  })
}

onMounted(async ()=>{
  const response=await getTableDataApi(taskInfo.taskInfo.id);
  resourceData.value=response.data.data;
})

</script>

<template>
  <div class="app-container" style="  padding: 20px;background-color: #F5F5F5">
    <div v-show="false">
      <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          accept="*/*"
      >
      <button @click="uploadFile">上传文件</button>
    </div>

    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="select">
            新增资源
          </el-button>
        </div>
        <div>
          <el-text class="mx-1" size="large"></el-text>
          <el-tooltip content="刷新资源">
            <el-button type="primary" :icon="RefreshRight" circle @click="reFlash"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="resourceData" >
          <el-table-column  label="任务名称" align="center">
            <template #default="scope">
              {{taskInfo.taskInfo.taskName}}
            </template>
          </el-table-column>
          <el-table-column prop="userName"  label="上传人" align="center"/>
          <el-table-column prop="resourceType"  label="文件类型" align="center"/>
          <el-table-column  label="文件" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="toOpen(scope.row)">
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="deleteResource(scope.row)" >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
        v-model="dialogVisible"
        :title="'新增资源'"
        width="30%"
        @closed="resetForm"
    >
      <el-text class="mx-1">{{fileName}}</el-text>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消上传
        </el-button>
        <el-button type="primary" :loading="loading" @click="uploadFile">
          确认上传
        </el-button>
      </template>
    </el-dialog>



    <el-card v-loading="loading" shadow="never" class="search-wrapper">
    </el-card>
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <div class="search-bar" style="height: 80px"></div>
    </el-card>
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <div class="search-bar" style="height: 80px"></div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>