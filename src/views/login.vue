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
          :rules="rules"
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
        <el-form-item>
          <el-row :gutter="20" justify="space-between" style="width: 210px">
            <el-col :span="6"> <el-button type="primary" class="login-btn" @click="submitForm(ruleFormRef)">
              登录
            </el-button></el-col>
            <el-col :span="6"></el-col>
            <el-col :span="6"></el-col>
            <el-col :span="6"><el-button type="primary" class="login-btn" @click="create()">
              注册
            </el-button></el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance } from 'element-plus';
import { useInfoStore } from '@/stores/userStore.ts';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {type Login, login_API} from "@/requests/login/login.ts"

const user = useInfoStore();
const router = useRouter();
const ruleFormRef = ref<FormInstance>()

// 表单模型
const ruleForm = reactive<Login>({
  account: '',
  password: '',
});

// 表单验证规则
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 11, message: '账号的长度在3-11位之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 10, message: '密码的长度在3-10位之间', trigger: 'blur' },
  ],
};

// 提交表单的方法
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    // 处理登录成功的情况
    if (valid) {
      login_API(ruleForm).then((res) => {
        if(res.data.code===200){
          user.setUserInfo(res.data.data);
          console.log(user);
          ElMessage.success("登录成功")
          router.push('/home');
        }else{
          ElMessage.error("登录失败，请检查账号密码")
          console.error("登录失败："+res.data.message);
        }
      }).catch((error: any) => {
        ElMessage.error("登陆失败，请检查账号密码")
        console.error("登录失败：", error);
      });
    } else {
      ElMessage.error("登陆失败，请检查账号密码")
      console.log('error submit!')
    }
  })
}
const create = () => {
  router.push('/create');
}

// 跳转到注册页面的方法
const toCreate = () => {
  // 实现跳转逻辑，例如使用 Vue Router
  router.push('/register'); // 确保有对应的路由
};
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