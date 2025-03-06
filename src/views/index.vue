<template>
  <el-container class="layout-container-demo" style="height: 100%;">
    <!-- 侧边栏 -->
    <el-aside :width="asideWidth">
      <!-- 上部：Logo / Icon + 名称，折叠时只显示图标 -->
      <div class="aside-top">
        <!-- 图标（LOGO）始终显示 -->
        <img
            class="logo"
            src="@/assets/logo.svg"
            alt="logo"
        />
        <!-- 如果折叠了，就只显示 logo，不显示文字；如果没折叠，显示文字 -->
        <span class="system-title" v-if="!isCollapse">V3 Admin</span>
      </div>

      <!-- 菜单区域（可滚动） -->
      <el-scrollbar style="background-color: #001428">
        <el-menu
            :collapse="isCollapse"
            background-color="#001428"
            text-color="#cfd3dc"
            active-text-color="#ffffff"
            :collapse-transition="false"
            :default-openeds="['1', '2', '3']"
            border="false"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon> <Notification/></el-icon>
              <span>信息管理</span>
            </template>
              <el-menu-item  @click="addTab(Tabs[0])">{{Tabs[0].title}}</el-menu-item>
              <el-menu-item @click="addTab(Tabs[1])">{{Tabs[1].title}}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon> <Notification/></el-icon>
              <span>任务管理</span>
            </template>
            <el-menu-item  @click="addTab(Tabs[2])">{{Tabs[2].title}}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon> <Notification/></el-icon>
              <span>评审管理</span>
            </template>
<!--            <el-menu-item  @click="addTab(Tabs[3])">{{Tabs[3].title}}</el-menu-item>-->
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 右侧容器 -->
    <el-container>
      <!-- 将“折叠按钮”放到 Header 中 -->
      <el-header style="text-align: right; font-size: 12px">
        <!-- 左侧折叠按钮 + 右侧操作 -->
        <div class="header-content">
          <div class="header-top">
            <el-icon :size="20" class="icon"  @click="toggleCollapse">
              <Expand v-if="isCollapse" />
              <Fold v-else />
            </el-icon>
            <div class="spacer" style="flex-grow: 1"></div>
            <Screenfull style="margin-left: 10px;height: 20px;width: 20px"/>
            <Notify style="margin-left: 10px;height: 20px;width: 20px"/>
            <el-dropdown style="margin-left: 20px">
              <div>
                <el-avatar :icon="UserFilled" :size="30" />
                <span style="margin-left: 5px">{{ userInfo.user.name }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <a target="_blank" href="https://github.com/un-pany/v3-admin-vite">
                    <el-dropdown-item>GitHub</el-dropdown-item>
                  </a>
                  <a target="_blank" href="https://gitee.com/un-pany/v3-admin-vite">
                    <el-dropdown-item>Gitee</el-dropdown-item>
                  </a>
                  <el-dropdown-item divided @click="">
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <!-- Main 内容 -->
      <el-main>
        <el-tabs
            v-model="editableTabsValue"
            type="card"
            class="demo-tabs"
            @tab-remove="removeTab"
            @tab-click="handleTabClick"
            tabPosition="bottom"
        >
          <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              :closable="item.name !== 'home'"
          >
          </el-tab-pane>
        </el-tabs>
        <el-watermark :font="font" :content="[userInfo.user.name]">
          <!--        <el-divider style="margin: 1px" />-->
          <router-view style="width: 100%;height: 100%;"/>
        </el-watermark>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Screenfull from "@/views/Screenfull/index.vue"
import Notify from "@/views/Notify/index.vue"
import {ref, computed, reactive} from 'vue'
import {
  Expand, Fold,
  Message, Notification, UserFilled
} from '@element-plus/icons-vue'
import { useInfoStore } from '@/stores/userStore.ts';
import { useRouter } from 'vue-router';
const userInfo = useInfoStore();
const router = useRouter();

// 是否折叠侧边栏
const isCollapse = ref(false)
// 动态计算 aside 宽度
const asideWidth = computed(() => (isCollapse.value ? '64px' : '250px'))

// 切换折叠
function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}


///
interface Tab{
  title: string,
  name: string,
  path:string
}
let tabIndex = 1
const editableTabsValue = ref('home')
const Tabs = reactive<Tab[]>([
  {
    title: '人员管理',
    name: 'user',
    path:'/user'
  },
  {
    title: '标签管理',
    name: 'expert',
    path:'/expert'
  },
  {
    title: '任务信息',
    name: 'task',
    path:'/task'
  },
    // {
    //   title: '评审信息',
    //   name: 'taskresult',
    //   path:'/taskresult'
    // },
])
const editableTabs=ref<Tab[]>([
  {
    title: '首页',
    name: 'home',
    path:'/home'
  },
]);

const addTab = (demo: Tab) => {
  const existingTab = editableTabs.value.find(t => t.name === demo.name);
  if (!existingTab) {
    editableTabs.value.push({
      title: demo.title,
      name: demo.name,
      path:demo.path,
    })
  }
  editableTabsValue.value = demo.name;
  router.push(demo.path);
}
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  let activePath=''
  if (activeName === targetName) {
    tabs.forEach((tab:any, index:any) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
          activePath= nextTab.path
        }
      }
    })
  }

  editableTabsValue.value = activeName
  router.push(activePath);
  editableTabs.value = tabs.filter((tab:any) => tab.name !== targetName)
}
// 点击标签的处理函数
const handleTabClick = (tabEvent:any) => {
  const tabName = tabEvent.props.name; // 假设tabEvent是从UI库传递的事件对象，具有props属性
  const tab = editableTabs.value.find(t => t.name === tabName);
  editableTabsValue.value = tabName;
  router.push(tab.path);
  console.log(tabEvent.props.path)
  console.log(tab?.path);
  console.log(editableTabsValue.value);
};

const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
</script>

<style scoped>
/* 布局样式 */
.layout-container-demo {
  /* 使整个容器占满高度，可根据需要调整 */
  height: 100%;

  /* Header 设置统一高度 80px */
  .el-header {
    position: relative;
    background-color: #ffffff;
    color: var(--el-text-color-primary);
    height: 35px; /* <<<<<< 统一高度 */
    /* 如果想让内部文字/按钮在垂直方向居中，可以加 line-height: 80px;
       但要注意与子元素的 flex 布局兼容性。 */
  }

  .el-aside {
    color: var(--el-text-color-primary);
  }
  .el-menu {
    border-right: none;
  }
  .el-main {
    padding: 0;
  }
}

/* 顶部区域：图标 + 名称 */
.aside-top {
  align-items: center;
  height: 80px; /* <<<<<< 统一高度 */
  padding: 0 8px;
  background-color: #001428;
}

/* LOGO样式 */
.logo {
  width: 32px;  /* 自行调整LOGO大小 */
  height: 32px;
  margin-right: 8px;
  margin-left: 8px;
}

/* 系统名称 */
.system-title {
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

/* Header 里的内容排版 */
.header-content {
  flex-direction: column; /* 设置主轴为垂直方向 */
  height: 100%;         /* 或者可以设置为具体的高度，如 500px */
}
.header-top {
  display: flex;         /* 为子 div 启用 flex 布局 */
  align-items: center;   /* 子 div 内容垂直居中 */
  justify-content: space-between; /* 子 div 内部元素在水平方向上均匀分布 */
  padding: 5px;         /* 添加内边距 */
}
.demo-tabs{
  height: 50px;
}
</style>