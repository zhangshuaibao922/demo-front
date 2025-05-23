<script lang="ts" setup>
import type {CreateOrUpdateTableRequestData, TableData} from "@/requests/task/type.ts"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus"
import {createTableDataApi, deleteAllTableDataApi, deleteTableDataApi, getTableDataApi,getTableDataApiTeacher} from "@/requests/task/task.ts"
import {usePagination} from "@/requests/user/usePagination.ts"
import {CirclePlus, Delete, Download, Refresh, RefreshRight, Search, DArrowLeft} from "@element-plus/icons-vue"
import {cloneDeep} from "lodash-es"
import {onMounted, reactive, ref, watch} from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();
import { taskInfoStore } from '@/stores/taskInfoStore.ts';
import dayjs from "dayjs";
const taskInfo=taskInfoStore();
import { useInfoStore } from '@/stores/userStore.ts';
const userInfo = useInfoStore();
defineOptions({
  // 命名当前组件
  name: "Table",
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const statusList = [
  {
    value: 1,
    label: '创建',
  },
    {
    value: 2,
    label: '资源',
  },
  {
    value: 3,
    label: '抽取',
  },
  {
    value: 4,
    label: '评审',
  },
  {
    value: 5,
    label: '完成',
  },
  {
    value: 6,
    label: '全部',
  },
]
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

function handleCreateOrUpdate() {
  console.log(formData.value)
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    loading.value = true
    const api =createTableDataApi ;
    api(formData.value,userInfo.user.id).then(() => {
      ElMessage.success("操作成功")
      dialogVisible.value = false
      getTableData()
    }).finally(() => {
      loading.value = false
    })

  })
}

function resetForm() {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}

// #endregion

// #region 删
function handleDelete(row: TableData) {
  ElMessageBox.confirm(`正在删除任务：${row.taskName}以及对应的资源文件，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

function deleteAll() {
  ElMessageBox.confirm(`确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAllTableDataApi(selectionTable.value).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}


// #endregion

// #region 查
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  taskName: "",
  status: 6,
})

function getTableData() {
  loading.value = true
  getTableDataApiTeacher({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    taskName: searchData.taskName || undefined,
    status: searchData.status || undefined,
    id:userInfo.user.roleId==1?undefined:userInfo.user.id
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
  searchData.status=5
  searchFormRef.value?.resetFields()
  handleSearch()
}
// 根据 status 获取 label
const getStatusLabel = (status: number) => {
  const item = statusList.find(s => s.value === status);
  return item ? item.label : '未知状态';
};

function pushTaskInfo(row: TableData){
  taskInfo.setTaskInfo(row)
  router.push('/taskinfo')
}

function routerTaskResult(row: TableData){
  if(row.status>=3){
    taskInfo.setTaskInfo(row)
    router.push('/taskresult')
  }else{
    ElMessage.error("暂未抽取评审人员")
  }
}


const selectionTable = ref<TableData[]>([])

function handleSelectionChange(selection: TableData[]) {
  selectionTable.value = selection;
}

// const downloadExcel = async () => {
//   // try {
//   //   await getExcelApi().then((res) => {
//   //     console.log(res.data.data)
//   //     window.open(res.data.data,'_blank');
//   //   }).catch((err) => {
//   //     ElMessage.error("下载失败")
//   //   })
//   // } catch (error) {
//   //   ElMessage.error("下载失败")
//   // }
// };

// #endregion
onMounted(async () => {
  if(userInfo.user.roleId!=1&&userInfo.user.roleId!=2&&userInfo.user.roleId!=3){
  router.push("/login")
}
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
        <el-form-item prop="status" label="状态">
          <el-select v-model="searchData.status" placeholder="状态" style="width: 200px">
            <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">
            新增任务
          </el-button>
          <el-button type="danger" :icon="Delete" @click="deleteAll">
            批量删除
          </el-button>
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
        <el-table :data="tableData" @selection-change="handleSelectionChange" empty-text="暂无任务数据">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="taskName"  label="任务名称" align="center"/>
          <el-table-column prop="siphonTime" label="抽取时间" width="150" align="center" >
            <template #default="scope">
              <el-text v-if="scope.row.status<=2" tag="b"  >{{ formatDate(scope.row.siphonTime) }}</el-text>
              <el-text v-else tag="del">{{ formatDate(scope.row.siphonTime) }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="评审时间" width="150" align="center" >
            <template #default="scope">
              <el-text v-if="scope.row.status<=3" tag="b">{{ formatDate(scope.row.startTime) }}</el-text>
              <el-text v-else tag="del">{{ formatDate(scope.row.startTime) }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="150" align="center" >
            <template #default="scope">
              <el-text v-if="scope.row.status<=4">{{ formatDate(scope.row.endTime) }}</el-text>
              <el-text v-else  tag="del">{{ formatDate(scope.row.endTime) }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center" >
            <template #default="scope">
              <el-tag :type="'success'" effect="light" disable-transitions>
                {{ getStatusLabel(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="pushTaskInfo(scope.row)">
                资源详情
              </el-button>
              <el-button type="primary" v-if="scope.row.status==3" text bg size="small" @click="routerTaskResult(scope.row)">
                评审名单
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">
                删除
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
    <!-- 新增/修改 -->
    <el-dialog
        v-model="dialogVisible"
        :title="formData.id === undefined ? '新增任务' : '修改任务'"
        width="30%"
        @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" label-width="100px" label-position="left">
        <el-form-item prop="taskName" label="任务名称">
          <el-input v-model="formData.taskName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="account" label="抽取时间">
          <el-date-picker
              v-model="formData.siphonTime"
              type="datetime"
              placeholder="Select date and time"
              style="width: 310px"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="x"
          />
        </el-form-item>
        <el-form-item prop="password" label="评审时间">
          <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              placeholder="Select date and time"
              style="width: 310px"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="x"
          />
        </el-form-item>
        <el-form-item prop="name" label="结束时间">
          <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              placeholder="Select date and time"
              style="width: 310px"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="x"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleCreateOrUpdate">
          确认
        </el-button>
      </template>
    </el-dialog>
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
