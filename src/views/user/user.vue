<script lang="ts" setup>
import type {CreateOrUpdateTableRequestData, Field, Role, TableData} from "@/requests/user/type.ts"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus"
import {
  createTableDataApi, deleteAllTableDataApi,
  deleteTableDataApi, getExcelApi,
  getFieldDataApi,
  getRoleDataApi,
  getTableDataApi,
  updateTableDataApi
} from "@/requests/user"
import { usePagination } from "@/requests/user/usePagination.ts"
import { CirclePlus, Delete, Download, Refresh, RefreshRight, Search } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"
import {onMounted, reactive, ref, watch} from "vue";

defineOptions({
  // 命名当前组件
  name: "Table",
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// #region 增
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: undefined,
  account: "",
  password: "",
  name: "",
  fieldId: 0,
  roleId: 0,
  old: 0,
  score: 0,
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 11, message: '账号的长度在3-11位之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 10, message: '密码的长度在3-10位之间', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名长度在2-10位之间', trigger: 'blur' },
  ],
};
function handleCreateOrUpdate() {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error("表单校验不通过")
      return
    }
    if(formData.value.roleId==0){
      ElMessage.error("未选择权限")
    }else if(formData.value.fieldId==0 ){
      ElMessage.error("未选择领域")
    }else {
      loading.value = true
      const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi
      api(formData.value).then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTableData()
      }).finally(() => {
        loading.value = false
      })
    }
  })
}
function resetForm() {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
// #endregion

// #region 删
function handleDelete(row: TableData) {
  ElMessageBox.confirm(`正在删除用户：${row.name}，确认删除？`, "提示", {
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
function deleteAll(){
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

// #region 改
function handleUpdate(row: TableData) {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
  console.log(formData.value)
}
// #endregion

// #region 查
const tableData = ref<TableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  fieldName: "",
  score:"",
})
function getTableData() {
  loading.value = true
  getTableDataApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name || undefined,
    fieldName: searchData.fieldName || undefined,
    score: searchData.score || undefined,
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

const FieldList=ref<Field[]>([{
  fieldId: 0,
  fieldName:"未选择"
}])
const RoleList=ref<Role[]>([{
  roleId: 0,
  roleName: "未选择"
}])
const findFieldName = (fieldId:number) => {
  const field = FieldList.value.find(r => r.fieldId === fieldId);
  return field ? field.fieldName : '未知领域';
};
const getField=async ()=>{
  await getFieldDataApi().then((res) => {
    for (const data of res.data.data) {
      FieldList.value.push({
        fieldId: data.fieldId,
        fieldName: data.fieldName,
      })
    }
  })
}
const findRoleName = (roleId:number) => {
  const role = RoleList.value.find(r => r.roleId === roleId);
  return role ? role.roleName : '未知角色';
};

const getRoleType = (roleId:number) => {
  return roleId === 1 ? 'warning' : 'primary';
};
const getRole=async ()=>{
  await getRoleDataApi().then((res) => {
    for (const data of res.data.data) {
      RoleList.value.push({
        roleId: data.roleId,
        roleName: data.roleName,
      })
    }
  })
}
const selectionTable = ref<TableData[]>([])
function handleSelectionChange(selection: TableData[]) {
  selectionTable.value = selection;
}
const downloadExcel = async () => {
  try {
    await getExcelApi().then((res) => {
      console.log(res.data.data)
      window.open(res.data.data,'_blank');
    }).catch((err) => {
      ElMessage.error("下载失败")
    })
  } catch (error) {
    ElMessage.error("下载失败")
  }
};
// #endregion
onMounted(async () => {
  await getField()
  await getRole()
});
// 监听分页参数的变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container" style="  padding: 20px;background-color: #f8f8f8">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="fieldName" label="领域">
          <el-input v-model="searchData.fieldName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="score" label="评分">
          <el-input v-model="searchData.score" placeholder="请输入" />
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
            <el-button type="primary" :icon="Download" circle  @click="downloadExcel"/>
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="account" label="账号" align="center" />
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="roleId" label="权限" align="center">
            <template #default="scope">
              <div v-if="findRoleName(scope.row.roleId)">
                <el-tag :type="getRoleType(scope.row.roleId)" effect="plain" disable-transitions>
                  {{ findRoleName(scope.row.roleId) }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fieldId" label="领域" align="center" >
            <template #default="scope">
              <div v-if="findFieldName(scope.row.fieldId)">
                  {{ findFieldName(scope.row.fieldId) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="old" label="年限" align="center" />
          <el-table-column prop="score" label="评分" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.score<=5" type="success" effect="plain" disable-transitions>
                优秀
              </el-tag>
              <el-tag v-else-if="scope.row.score<=15" type="primary" effect="plain" disable-transitions>
                良好
              </el-tag>
              <el-tag v-else-if="scope.row.score<=25" type="warning" effect="plain" disable-transitions>
                一般
              </el-tag>
              <el-tag v-else  type="danger" effect="plain" disable-transitions>
                及格
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
        :title="formData.id === undefined ? '新增用户' : '修改用户'"
        width="30%"
        @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData"  label-width="100px" label-position="left"  :rules="rules">
        <el-form-item prop="account" label="账号">
          <el-input v-model="formData.account" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="用户名">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item  prop="roleId" label="权限">
          <el-select
              v-model="formData.roleId"
              placeholder="Select"
          >
            <el-option
                v-for="item in RoleList"
                :key="item.roleName"
                :label="item.roleName"
                :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item  prop="fieldId" label="领域">
          <el-select
              v-model="formData.fieldId"
              placeholder="Select"
          >
            <el-option
                v-for="item in FieldList"
                :key="item.fieldName"
                :label="item.fieldName"
                :value="item.fieldId"
            />
          </el-select>
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
