<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {CirclePlus, Delete, DArrowLeft,RefreshRight} from "@element-plus/icons-vue";
import type {condtion, resource, resourceDto} from "@/requests/taskinfo/type.ts";
import {
  add,
  addCondtion, countUsers,
  deleteTableDataApi,
  getCondtionApi,
  getTableDataApi,
  updateTableDataApi
} from "@/requests/taskinfo/taskinfo.ts";
import { taskInfoStore } from '@/stores/taskInfoStore.ts';
import {useInfoStore} from "@/stores/userStore.ts"
import { useRouter } from 'vue-router';
import {cloneDeep} from "lodash-es";
import {ElMessage} from "element-plus";
import type {Field} from "@/requests/user/type.ts";
import {getFieldDataApi} from "@/requests/user";
const router = useRouter();
const taskInfo=taskInfoStore();
const userInfo=useInfoStore();
const loading = ref<boolean>(false)
// 修改 ref 类型声明（在文件顶部）
const fileInput = ref<HTMLInputElement | null>(null); // 原为 ref(null)
const resourceData= ref<resourceDto[]>([])
const fileName=ref('')
const dialogVisible=ref(false)
const bool=ref(false)
const userNumber=ref(2);

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
const toTask=async ()=>{
  router.push("/task")
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

//condition
export type ConditionType = 'old' | 'score' | 'fieldName' | 'classmate' | 'colleague' |'person'


const condtionformData = reactive({
  conditions: [] as condtion[]
})

// 条件选项
const conditionOptions = [
  { label: '工作年限', value: 'old' },
  { label: '项目得分', value: 'score' },
  { label: '专业领域', value: 'fieldName' },
  { label: '同学关系', value: 'classmate' },
  { label: '同事关系', value: 'colleague' },
  { label: '抽取人数', value: 'person' }
]

// 运算符配置
const operatorsMap: Record<ConditionType, Array<{label: string, value: string}>> = {
  old: [
    { label: '大于', value: '>' },
    { label: '等于', value: '=' },
    { label: '小于', value: '<' }
  ],
  score: [
    { label: '大于', value: '>' },
    { label: '等于', value: '=' },
    { label: '小于', value: '<' }
  ],
  fieldName: [
    { label: '等于', value: '=' }
  ],
  classmate: [
    { label: '等于', value: '=' }
  ],
  colleague: [
    { label: '等于', value: '=' }
  ],
  person:[
    { label: '等于', value: '=' }
  ]
}

export interface FieldDto{
  fieldId: string
  fieldName:string
}
// 领域选项（示例数据）
const fieldOptions = reactive<FieldDto[]>([])
const fetchFieldOptions = async () => {
  // 这里调用接口获取领域列表
  await getFieldDataApi().then((res) => {
    for (const data of res.data.data) {
      fieldOptions.push({
        fieldId: String(data.fieldId),
        fieldName: data.fieldName,
      })
    }
  })
}

// 获取运算符选项
const getOperators = (type: ConditionType | null) => {
  return type ? operatorsMap[type] || [] : []
}


// 新增条件
const addCondition = () => {
  condtionformData.conditions.push({ conditionId:taskInfo.taskInfo.conditionId,conditionName: null, conditionIf: '', conditionValue: '' })
  console.log(condtionformData.conditions)
}

// 删除条件
const removeCondition = (index: number) => {
  condtionformData.conditions.splice(index, 1)
}

// 切换条件类型时重置值
const handleConditionChange = (index: number) => {
  const condition = condtionformData.conditions[index]
  condition.conditionIf = ''
  condition.conditionValue = ''

  // 设置默认值
  if (['classmate', 'colleague'].includes(condition.conditionName as string)) {
    condition.conditionValue = '0.5'
  }
}

const saveCondition=async ()=>{
  const res=await addCondtion(condtionformData.conditions,taskInfo.taskInfo.conditionId);
  if(res.data.code==200){
    ElMessage.success("保存成功");
  }else {
    ElMessage.error("保存失败,请稍后重试");
  }
}

const  handleCardClickOne=async () =>{
  const res=await updateTableDataApi(taskInfo.taskInfo);
  if(res.data.code==200){
    ElMessage.success("保存成功");
    router.push('/task');
  }else {
    ElMessage.error("已经开始抽取评审,无法更改相关条件");
  }
}
const handleCardClickTwo = async () => {
  if(taskInfo.taskInfo.status==3){
    router.push('/taskresult');
  }else {
    ElMessage.warning("暂无抽取名单，请到规定时间查看");
  }
}

// condition
onMounted(async ()=>{
  // #endregion
  if(userInfo.user.roleId!=1&&userInfo.user.roleId!=2&&userInfo.user.roleId!=3){
  router.push("/login")
 }
  const response1=await countUsers()
  userNumber.value=response1.data.data;
  const response=await getTableDataApi(taskInfo.taskInfo.id);
  resourceData.value=response.data.data;
  await fetchFieldOptions()
  const res=await getCondtionApi(taskInfo.taskInfo.conditionId);
  if(taskInfo.taskInfo.status>=2){
    condtionformData.conditions=res.data.data;
    bool.value=true;
  }else {
    condtionformData.conditions.push({
      conditionId: taskInfo.taskInfo.conditionId,
      conditionName: "person",
      conditionIf: "=",
      conditionValue: "1"
    });
  }
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
          <el-tooltip content="返回">
            <el-button type="primary" :icon="DArrowLeft" circle @click="toTask"/>
          </el-tooltip>
          <el-button @click="handleCardClickOne()" type="danger" >
            结束上传资源
          </el-button>
          <el-button  v-if="taskInfo.taskInfo.status<=1" type="primary" :icon="CirclePlus" @click="select">
            新增资源
          </el-button>
        </div>
        <div>
          <el-text class="mx-1" size="large"></el-text>
          <el-tooltip  v-if="taskInfo.taskInfo.status<=1" content="刷新资源">
            <el-button type="primary" :icon="RefreshRight" circle @click="reFlash"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="resourceData"  empty-text="暂无任务数据">
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
              <el-button v-if="taskInfo.taskInfo.status<=1" type="danger" text bg size="small" @click="deleteResource(scope.row)" >
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
      <div class="toolbar-wrapper" v-if="taskInfo.taskInfo.status<=1">
        <div>
          <!-- 新增按钮 -->
          <el-button @click="addCondition" type="primary" :icon="CirclePlus">
            新增条件
          </el-button>
        </div>
        <div>
          <el-button type="primary"  @click="saveCondition">提交保存</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <div class="condition-form" >
          <el-form ref="formRef" :model="condtionformData" >
            <div v-for="(item, index) in condtionformData.conditions" :key="index" class="condition-row" style="height: 50px; display: flex; align-items: center;">
              <!-- 条件类型选择 -->
              <el-select
                  :disabled="bool"
                  v-model="item.conditionName"
                  placeholder="选择条件"
                  @change="handleConditionChange(index)"
                  style="width: 160px; margin-right: 10px"
              >
                <el-option
                    v-for="opt in conditionOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>

              <!-- 运算符选择 -->
              <el-select
                  v-model="item.conditionIf"
                  placeholder="选择运算符"
                  style="width: 120px; margin-right: 10px"
                  :disabled="bool"
              >
                <el-option
                    v-for="opt in getOperators(item.conditionName)"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                />
              </el-select>

              <!-- 动态值输入 -->
              <template v-if="item.conditionName">
                <!-- 领域名称（单选） -->
                <el-select
                    :disabled="bool"
                    v-if="item.conditionName === 'fieldName'"
                    v-model="item.conditionValue"
                    placeholder="选择领域"
                    style="width: 300px"
                >
                  <el-option
                      v-for="field in fieldOptions"
                      :key="field.fieldId"
                      :label="field.fieldName"
                      :value="field.fieldId"
                  />
                </el-select>

                <!-- 数值输入（old/score） -->
                <el-input-number
                    :disabled="bool"
                    v-else-if="['score'].includes(item.conditionName)"
                    v-model="item.conditionValue"
                    :precision="0"
                    :min="0"
                    :max="100"
                    controls-position="right"
                    style="width: 200px"
                />
                <!-- 数值输入（old/score） -->
                <el-input-number
                    :disabled="bool"
                    v-else-if="['old'].includes(item.conditionName)"
                    v-model="item.conditionValue"
                    :precision="0"
                    :min="1"
                    :max="10"
                    controls-position="right"
                    style="width: 200px"
                />
                <!-- 数值输入（old/score） -->
                <el-input-number
                    :disabled="bool"
                    v-else-if="['person'].includes(item.conditionName)"
                    v-model="item.conditionValue"
                    :precision="0"
                    :min="1"
                    :max="userNumber"
                    controls-position="right"
                    style="width: 200px"
                />

                <!-- 小数输入（classmate/colleague） -->
                <el-slider
                    :disabled="bool"
                    v-else-if="['classmate', 'colleague'].includes(item.conditionName as string)"
                    v-model="item.conditionValue"
                    :min="0.1"
                    :max="1.0"
                    :step="0.1"
                    show-input
                    :format-tooltip="(val: number) => val.toFixed(1)"
                    style="width: 300px"
                />
              </template>

              <!-- 删除按钮 -->
              <el-button
                  v-if="taskInfo.taskInfo.status<=1"
                  @click="removeCondition(index)"
                  type="danger"
                  style="margin-left: 10px"
              >删除
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
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