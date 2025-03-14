<script lang="ts" setup>

import {CirclePlus, DArrowLeft, Delete, Download, Refresh, RefreshRight, Search} from "@element-plus/icons-vue"
import {onMounted, reactive, ref, watch} from "vue";
import {usePagination} from "@/requests/user/usePagination.ts";
import type {TableData} from "@/requests/taskresult/type.ts";
import {ElMessage, ElMessageBox, type FormInstance} from "element-plus";
import {getTableDataApi,deleteAllTableDataApi,queryByName,addTableDataApi,deleteById} from "@/requests/taskresult/taskresult.ts";
import {taskInfoStore} from "@/stores/taskInfoStore.ts";
import { useRouter } from 'vue-router';
const taskInfo=taskInfoStore();
const router=useRouter();
defineOptions({
  // 命名当前组件
  name: "Table",
})
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()


// #region 查
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  taskId: taskInfo.taskInfo.id,
  name: "",
  fieldId: undefined,
})
const addValue=ref('')
function getTableData() {
  loading.value = true
  getTableDataApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    taskId: searchData.taskId,
    name: searchData.name ,
    fieldId: searchData.fieldId ,
  }).then((res) => {
    paginationData.total = res.data.data.total
    tableData.value = res.data.data.records
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}
function handleSearch() {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
function resetSearch() {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const selectionTable = ref<TableData[]>([])

function handleSelectionChange(selection: TableData[]) {
  selectionTable.value = selection;
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

// 表单数据
const formData = ref({
  name: '',
  id: '',
  // 其他表单字段
})

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    id: '',
    // 重置其他表单字段
  }
}

// 查询评阅人
const queryReviewers = async (query: string, callback: (data: any[]) => void) => {
  if (query.length < 1) {
    callback([])
    return
  }
  
  try {
    // 调用后端API进行模糊查询
    const response = await queryByName(query)
    
    // 假设返回的数据格式为 [{id: 1, name: '张三', department: '技术部'}, ...]
    callback(response.data.data)
  } catch (error) {
    console.error('查询评阅人失败:', error)
    callback([])
  }
}

// 选择评阅人
const handleSelect = (item: any) => {
  formData.value.id = item.id
  formData.value.name = item.name
  // 不需要手动触发事件，Element Plus 会自动处理
}

// 添加创建评阅人的方法
const handleCreate = () => {
  if (!formData.value.id || !formData.value.name) {
    ElMessage.warning('请选择有效的评阅人')
    return
  }
  console.log(formData.value.id)
  
  loading.value = true

  addTableDataApi(taskInfo.taskInfo.id,formData.value.id).then(() => {
    ElMessage.success('添加成功')
    dialogVisible.value = false
    getTableData()
  }).catch((error: any) => {
    console.error('添加失败:', error)
    ElMessage.error('添加失败')
  }).finally(() => {
    loading.value = false
  })
  
}

function handleDelete(id: string) {
  ElMessageBox.confirm(`确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteById(id).then(() => {
      ElMessage.success('删除成功')
      getTableData()
    })
  })
}
const toTask=async ()=>{
  router.push("/task")
}
onMounted(async () => {

});
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container" style="  padding: 20px;background-color: #F5F5F5">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item>
          <el-tooltip content="返回">
            <el-button type="primary" :icon="DArrowLeft" circle @click="toTask"/>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-show="false" prop="fieldName" label="领域">
          <el-input v-model="searchData.fieldId" placeholder="请输入" />
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
            新增用户
          </el-button>
          <el-button type="danger" :icon="Delete" @click="deleteAll">
            批量删除
          </el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle  />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="userName" label="姓名" align="center" />
          <el-table-column prop="fieldName" label="领域" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" width="200" />
          <el-table-column  label="评分" align="center">
            <template #default="scope">
              <el-text v-if="scope.row.score===-1" tag="b"  type="danger">暂无评分</el-text>
              <el-text v-else tag="b">{{ scope.row.score }}</el-text>
            </template>
          </el-table-column>

          <el-table-column prop="description" label="评语" align="center" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <!-- <el-button type="primary" text bg size="small">
                修改
              </el-button> -->
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row.id)">
                作废
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
        :title="'新增评阅人'"
        width="30%"
        @closed="resetForm"
    >
      <!-- 添加用户搜索选择器 -->
      <el-form :model="formData" label-width="80px">
        <el-form-item label="评阅人">
          <el-autocomplete
            v-model="formData.name"
            :fetch-suggestions="queryReviewers"
            placeholder="请输入评阅人姓名"
            clearable
            @select="handleSelect"
            style="width: 100%"
            value-key="name"
          >
            <template #default="{ item }">
              <div class="suggestion-item">
                <div class="name">{{ item.name }}</div>
                <div class="info" v-if="item.department">{{ item.department }}</div>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleCreate">
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

.suggestion-item {
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}
.suggestion-item .name {
  font-weight: bold;
}
.suggestion-item .info {
  font-size: 12px;
  color: #999;
}
</style>
