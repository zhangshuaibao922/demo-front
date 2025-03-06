<script lang="ts" setup>

import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"
import {onMounted, reactive, ref, watch} from "vue";
import {usePagination} from "@/requests/user/usePagination.ts";
import type {CreateOrUpdateTableRequestData, TableData} from "@/requests/taskresult/type.ts";
import type {FormInstance} from "element-plus";
import {getTableDataApi} from "@/requests/taskresult/taskresult.ts";
import {taskInfoStore} from "@/stores/taskInfoStore.ts";
const taskInfo=taskInfoStore();
defineOptions({
  // 命名当前组件
  name: "Table",
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()


// #region 查
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  taskId: taskInfo.taskInfo.id,
  name: "",
  fieldName:"",
})
function getTableData() {
  loading.value = true
  getTableDataApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    taskId: searchData.taskId,
    name: searchData.name || undefined,
    fieldName: searchData.fieldName || undefined,
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


// #endregion
onMounted(async () => {

});
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container" style="  padding: 20px;background-color: #F5F5F5">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="fieldName" label="领域">
          <el-input v-model="searchData.fieldName" placeholder="请输入" />
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
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle  />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="userName" label="姓名" align="center" />
          <el-table-column prop="fieldName" label="账号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" width="200" />
          <el-table-column  label="评分" align="center">
            <template #default="scope">
              <el-text v-if="scope.row.score===-1" tag="b"  type="warning">暂无评分</el-text>
              <el-text v-else tag="b">{{ scope.row.score }}</el-text>
            </template>
          </el-table-column>

          <el-table-column prop="description" label="评语" align="center" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">

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
