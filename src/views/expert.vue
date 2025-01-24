<template>
  <div class="app-container" style="  padding: 20px;background-color: #F5F5F5">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchData.name" placeholder="请输入" />
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
<!--          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true;formDataType=true;">-->
<!--            新增用户-->
<!--          </el-button>-->
          <el-button type="danger" :icon="Delete" @click="deleteAll">
            批量删除
          </el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="classmate" label="同门" align="center">
            <template #default="scope">
              <el-tag
                  style="margin-left: 1px"
                  v-for="(tag,index) in scope.row.classmate"
                  :key="tag"
                  :disable-transitions="false"
                  :type="getTagType(index)"
              >
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="colleague" label="同事" align="center">
            <template #default="scope">
              <el-tag
                  style="margin-left: 1px"
                  v-for="(tag,index) in scope.row.colleague"
                  :key="tag"
                  :disable-transitions="false"
                  :type="getTagType(index)"
              >
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">
                修改
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
        :title="formDataType === true ? '新增用户' : '修改用户'"
        width="30%"
        @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData"  label-width="100px" label-position="left">
        <el-form-item   prop="name" label="用户名">
        <el-autocomplete
            v-if="formDataType === true"
            v-model="formData.name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入"
            @select="handleSelect"
        />
          <el-input v-if="formDataType !== true" v-model="formData.name" placeholder="请输入" disabled>
            </el-input>
        </el-form-item>
        <el-form-item prop="classmate" label="同门">
          <el-tag
              style="margin-left: 1px"
              v-for="(tag,index) in formData.classmate"
              :key="tag"
              closable
              :disable-transitions="false"
              :type="getTagType(index)"
              @close="classmateHandleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
              style="margin-left: 1px"
              v-if="classmateInputVisible"
              ref="InputRef"
              v-model="classmateInputValue"
              class="w-20"
              size="small"
              @keyup.enter="classmateHandleInputConfirm"
              @blur="classmateHandleInputConfirm"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入"
              @select="handleSelect"
          />
          <el-button style="margin-left: 1px" v-else class="button-new-tag" size="small" @click="classmateShowInput">
            新增
          </el-button>
        </el-form-item>
        <el-form-item prop="classmate" label="同事">
          <el-tag
              style="margin-left: 1px"
              v-for="(tag,index) in formData.colleague"
              :key="tag"
              closable
              :disable-transitions="false"
              :type="getTagType(index)"
              @close="colleagueHandleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
              style="margin-left: 1px"
              v-if="colleagueInputVisible"
              ref="InputRef"
              v-model="colleagueInputValue"
              class="w-20"
              size="small"
              @keyup.enter="colleagueHandleInputConfirm"
              @blur="colleagueHandleInputConfirm"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入"
              @select="handleSelect"
          />
          <el-button style="margin-left: 1px" v-else class="button-new-tag" size="small" @click="colleagueShowInput">
            新增
          </el-button>
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
<script setup lang="ts">
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {CirclePlus, Delete, Refresh, RefreshRight, Search} from "@element-plus/icons-vue";
import {cloneDeep} from "lodash-es";
import {ElInput, ElMessage, ElMessageBox, type FormInstance, type InputInstance} from "element-plus";
import {
  createTableDataApi, deleteAllExpertDataApi,
  deleteTableDataApi,
  getTableDataApi,
  getUserDataApi,
  updateTableDataApi
} from "@/requests/expert";
import type {TableData} from "@/requests/expert/type.ts";
import type {User} from "@/requests/model/user.ts";
import {usePagination} from "@/requests/user/usePagination.ts";
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const loading = ref<boolean>(false)
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
})
const dialogVisible = ref<boolean>(false)
const tableData = ref<TableData[]>([])
// #region 增
const DEFAULT_FORM_DATA: TableData = {
  id: "",
  name: "",
  classmate: [],
  colleague: [],
}
const formData = ref<TableData>(cloneDeep(DEFAULT_FORM_DATA));
const formDataType=ref<boolean>(false)
function handleSearch() {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
function resetSearch() {
  searchFormRef.value?.resetFields()
  handleSearch()
}
function deleteAll(){
  ElMessageBox.confirm(`确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAllExpertDataApi(selectionTable.value).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
function handleDelete(row: TableData) {
  ElMessageBox.confirm(`正在删除用户：${row.name}， 确认删除？`, "提示", {
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
function getTableData() {
  loading.value = true
  getTableDataApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name,
  }).then((res) => {
    paginationData.total = res.data.data.total
    tableData.value = res.data.data.records
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}
const selectionTable = ref<TableData[]>([])
function handleSelectionChange(selection: TableData[]) {
  selectionTable.value = selection;
  console.log(selection);
}
function handleUpdate(row: TableData) {
  dialogVisible.value = true
  formDataType.value=false
  formData.value = cloneDeep(row)
  console.log(formData.value)
}
const formRef = ref<FormInstance | null>(null)
function resetForm() {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
function handleCreateOrUpdate() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
      loading.value = true
      const api = formDataType.value===true ? createTableDataApi : updateTableDataApi
      api(formData.value).then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTableData()
      }).finally(() => {
        loading.value = false
      })

  })
}
const tagTypes = ['primary', 'success', 'warning', 'danger', 'info'];
const classmateInputValue = ref('')
const colleagueInputValue = ref('')
const classmateInputVisible = ref(false)
const colleagueInputVisible = ref(false)
const InputRef = ref<InputInstance>()
const getTagType = (index: number) => {
  return tagTypes[index % tagTypes.length] // 循环使用标签类型
}
const classmateHandleClose = (tag: string) => {
  formData.value.classmate.splice(formData.value.classmate.indexOf(tag), 1)
}
const colleagueHandleClose= (tag: string) => {
  formData.value.colleague.splice(formData.value.colleague.indexOf(tag), 1)
}
const classmateShowInput = () => {
  classmateInputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
const colleagueShowInput = () => {
  colleagueInputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
const classmateHandleInputConfirm = () => {
  if (classmateInputValue.value) {
    formData.value.classmate.push(classmateInputValue.value)
  }
  console.log(classmateInputValue.value)
  classmateInputVisible.value = false
  classmateInputValue.value = ''
}
const colleagueHandleInputConfirm = () => {
  if (colleagueInputValue.value) {
    formData.value.colleague.push(colleagueInputValue.value)
  }
  console.log(colleagueInputValue.value)
  colleagueInputVisible.value = false
  colleagueInputValue.value = ''
}



interface LinkItem {
  value: string
  link: string
}


let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  if (!queryString) {
    cb([])
    return
  }
  // loading.value = true
  try {
     await getUserDataApi(queryString)
        .then(res => {
          const userList:User[] = res.data.data
          console.log(userList)
          const data: LinkItem[]=[];
          for (let user of userList) {
            data.push({
              value:user.name,
              link:user.name,
            })
          }

          cb(data)
        }).catch(err => {
          console.error('搜索失败:', err)
          ElMessage.error('搜索失败，请稍后再试')
        })
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后再试')
    cb([])
  } finally {
    // loading.value = false
  }
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

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
