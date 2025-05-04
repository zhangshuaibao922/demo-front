<script lang="ts" setup>
import type {CreateOrUpdateTableRequestData, TableData} from "@/requests/task/type.ts"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus"
import {createTableDataApi, deleteAllTableDataApi, deleteTableDataApi, getTableDataApi,getTableDataApiResult} from "@/requests/task/task.ts"
import {usePagination} from "@/requests/user/usePagination.ts"
import {CirclePlus, Delete, Download, Refresh, RefreshRight, Search, DArrowLeft} from "@element-plus/icons-vue"
import {cloneDeep} from "lodash-es"
import {onMounted, reactive, ref, watch} from "vue";
import { useRouter } from 'vue-router';
import { useInfoStore } from '@/stores/userStore.ts';
const userInfo = useInfoStore();
const router = useRouter();
import { taskInfoStore } from '@/stores/taskInfoStore.ts';
import dayjs from "dayjs";
const taskInfo=taskInfoStore();
defineOptions({
  // 命名当前组件
  name: "Table",
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
// #region 增
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: undefined,        // 主键，使用可选字段
  taskName: "",  // 任务名称
  conditionId:"",
  siphonTime: null,  // 抽取时间，使用 ISO 格式的字符串
  startTime: null,   // 开始评审时间，使用 ISO 格式的字符串
  endTime: null,   // 结束时间，使用 ISO 格式的字符串
  resultScore: 0, // 得分
  status: 1,     // 状态
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))


function resetForm() {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}


// #endregion
export interface TableDataResult {
    id: string;          // 主键，使用可选字段
    taskName: string;     // 任务名称
    conditionId: string; // 条件id
    number:string;
    siphonTime: string;  // 抽取时间，使用 ISO 格式的字符串
    startTime: string;   // 开始评审时间，使用 ISO 格式的字符串
    endTime: string;     // 结束时间，使用 ISO 格式的字符串
    resultScore: number; // 得分
    status: number;      // 状态
}

// #region 查
const tableData = ref<TableDataResult[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  taskName: "",
  status: 5,
})

function getTableData() {
  loading.value = true
  getTableDataApiResult({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    taskName: searchData.taskName || undefined,
    status: searchData.status || undefined,
    id:userInfo.user.id
  }).then((res) => {
    paginationData.total = res.data.data.total
    tableData.value = res.data.data.records
    console.log(tableData.value);
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}

function handleSearch() {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}

function  formatDate(timestamp:string) {
  return dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
}
function resetSearch() {
  searchData.taskName = ""
  searchFormRef.value?.resetFields()
  handleSearch()
}

function pushTaskInfo(row: TableDataResult){
  // 检查当前时间是否在评审时间范围内
  const currentTime = Date.now();
  const startTimeMs = Number(row.startTime);
  const endTimeMs = Number(row.endTime);
  
  if (currentTime < startTimeMs) {
    ElMessage.warning("评审尚未开始");
    return;
  }
  
  if (currentTime > endTimeMs) {
    ElMessage.warning("评审已结束");
    return;
  }
  console.log("当前时间在评审范围内，允许跳转");
  taskInfo.setTaskInfo(row)
  router.push('/score')
}

function routerTaskResult(row: TableDataResult){
  if(row.status>=3){
    taskInfo.setTaskInfo(row)
    router.push('/taskresultone')
  }else{
    ElMessage.error("暂未抽取评审人员")
  }
}

onMounted(async () => {

});
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})
</script>

<template>
  <div class="app-container" style="  padding: 20px;background-color: #F5F5F5">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="任务名称">
          <el-input v-model="searchData.taskName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button :icon="Refresh" @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
        </div>
        <div>
<!--          <el-tooltip content="下载">-->
<!--            <el-button type="primary" :icon="Download" circle @click="downloadExcel"/>-->
<!--          </el-tooltip>-->
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="taskName"  label="任务名称" align="center"/>
          <el-table-column prop="number" label="人数"  align="center" />
          <el-table-column prop="resultScore" label="得分"  align="center" />
          <el-table-column prop="startTime" label="结果" width="150" align="center" >
            <template #default="scope">
              <el-tag v-if="scope.row.resultScore>=6" type="success"  disable-transitions>
                通过
              </el-tag>
              <el-tag v-else type="danger"disable-transitions>
                驳回
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="routerTaskResult(scope.row)">
                查看结果
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
            background
            :layout="paginationData.layout"
            :page-sizes="paginationData.pageSizes"
            :total="paginationData.total"
            :page-size="paginationData.pageSize"
            :current-page="paginationData.currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
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

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
