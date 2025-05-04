<!-- src/components/Login.vue -->
<template>
  <div class="login-background">

    <div class="login-title-background">
      <!-- 标题 -->
      <el-text class="login-title">评审专家预约抽取系统</el-text>

      <!-- 登录表单 -->
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          label-width="80px"
          class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input
              v-model="ruleForm.account"
              autocomplete="off"
              style="width: 220px"
              placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="ruleForm.password"
              type="password"
              autocomplete="off"
              style="width: 220px"
              placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
              v-model="ruleForm.name"
              autocomplete="off"
              style="width: 220px"
              placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
              v-model="ruleForm.email"
              autocomplete="off"
              style="width: 130px"
              placeholder="请输入邮箱"
          />
          <el-button type="primary" style="margin-left: 10px" @click="sendCode">验证码</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input
              v-model="code"
              autocomplete="off"
              style="width: 220px"
              placeholder="请输入验证码"
          />
        </el-form-item>
        <el-form-item  prop="fieldId" label="领域">
          <el-select
              v-model="ruleForm.fieldId"
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
        <el-form-item>
          <el-row :gutter="20" justify="space-between" style="width: 210px">
            <el-col :span="6"> <el-button type="primary" class="login-btn" @click="submitForm(ruleFormRef)">
              登录
            </el-button></el-col>
            <el-col :span="6"></el-col>
            <el-col :span="6"></el-col>
            <el-col :span="6"><el-button type="primary" class="login-btn">
              注册
            </el-button></el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import type { FormInstance } from 'element-plus';
import { useInfoStore } from '@/stores/userStore.ts';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {type Login,type Create, create_API, sendCode_API} from "@/requests/login/login.ts"
import {
  createTableDataApi, deleteAllTableDataApi,
  deleteTableDataApi, getExcelApi,
  getFieldDataApi,
  getRoleDataApi,
  getTableDataApi,
  updateTableDataApi
} from "@/requests/user"
const user = useInfoStore();
const router = useRouter();
const ruleFormRef = ref<FormInstance>()

// 表单模型
const ruleForm = reactive<Create>({
  id:undefined,
  account: '',
  password: '',
  name: '',
  email: '',
  fieldId: 0,
  relationship: '',
  roleId: 2,
  old: 0,
  score: 0,
});
const code=ref<string>("");

const sendCode=()=>{
  if(ruleForm.email===""){
    ElMessage.error("请输入邮箱")
    return
  }
  sendCode_API(ruleForm.email).then((res)=>{
    ElMessage.success("验证码发送成功")
  })
}

// 提交表单的方法
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    // 处理登录成功的情况
    if (valid) {
      create_API(ruleForm,code.value).then((res) => {
          // user.setUserInfo(res.data.data);
          // console.log(user);
          ElMessage.success("注册成功，跳转登录")
          router.push('/login');
      }).catch((error: any) => {
        ElMessage.error("注册失败，请检查账号密码")
        console.error("注册失败：", error);
      });
    } else {
      ElMessage.error("注册失败，请检查账号密码")
      console.log('error submit!')
    }
  })
}
export interface Field{
  fieldId: number
  fieldName:string
}
const FieldList=ref<Field[]>([{
  fieldId: 0,
  fieldName:"未选择"
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

// 跳转到注册页面的方法
const toCreate = () => {
  // 实现跳转逻辑，例如使用 Vue Router
  router.push('/register'); // 确保有对应的路由
};
// #endregion
onMounted(async () => {
  await getField()
});
</script>

<style lang="scss" scoped>
.login-background {
  width: 100%;
  height: 100vh; /* 设置高度为视口高度 */
  background: url("@/assets/login-bg.jpg") no-repeat center center; /* 使用 @ 符号引用图片 */
  background-size: cover; /* 确保图片覆盖整个容器 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-title-background {
  width: 400px;
  /* height: 200px; 移除固定高度，让内容决定高度 */
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  justify-content: center; /* 在垂直方向上居中 */
  align-items: center;     /* 在水平方向上居中 */
  margin-bottom: 20px;     /* 添加下方间距 */
  padding: 20px;           /* 添加内边距 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* 可选：添加阴影效果 */
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px; /* 添加下方间距，避免与表单紧密 */
}

.demo-ruleForm {
  width: 100%;       /* 适应容器宽度 */
  max-width: 300px;  /* 设置表单最大宽度 */
}

//.login-btn {
//  width: 50px; /* 可根据需要调整按钮宽度 */
//}

@media (max-width: 768px) {
  .login-title-background {
    width: 200px;
    padding: 15px;
  }

  .login-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .demo-ruleForm {
    max-width: 300px;
  }

  .login-btn {
    width: 5px;
  }
}
</style>