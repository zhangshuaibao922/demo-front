<template>
  <div class="login-background">
    <div class="login-title-background">
      <!-- 您可以在这里添加内容，例如标题图标等 -->
      <el-text class="login-title">课程管理系统</el-text>
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="80px"
          class="demo-ruleForm"
      >
        <h2>在线批阅系统</h2>
        <el-form-item label="账号：" prop="username">
          <el-input v-model="ruleForm.account" autocomplete="off" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
              v-model="ruleForm.password"
              type="password"
              autocomplete="off"
              style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="submitForm(ruleFormRef)">
            登录
          </el-button>
          <el-button type="primary" class="login-btn" style="margin-left: 75px" @click="toCreat()">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInfoStore } from '@/stores/useInfoStore';
import type {UserInfo} from "@/requests/model/userInfo.ts";
import {reactive,ref} from "vue";
import type {FormInstance,ElMessage} from 'element-plus';

const userInfo = useInfoStore();
const ruleFormRef = ref<FormInstance>()
const ruleForm: UserInfo = reactive({
  account: "",
  password: "",
  identity: "",
});

const rules = {
  account: [
    {required: true, message: '请输入账号', trigger: 'blur'},
    {min: 3, max: 11, message: '账号的长度在10位', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 3, max: 10, message: '密码的长度在3-10之间', trigger: 'blur'},
  ],
};


const submitForm = async (formEl: FormInstance | undefined) => {

}
const toCreat = async (formEl: FormInstance | undefined) => {
}
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
  width: 200px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px; /* 添加间距 */
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
</style>