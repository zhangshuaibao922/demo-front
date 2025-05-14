<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="chart-card">
          <div slot="header" class="card-header">
            <span>专家抽取情况概览</span>
          </div>
          <div class="chart-container" ref="expertChartRef"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="card-header">
            <span>任务履行情况</span>
          </div>
          <div class="chart-container" ref="taskCompletionRef"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div slot="header" class="card-header">
            <span>专家领域分布</span>
          </div>
          <div class="chart-container" ref="expertFieldRef"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="chart-card">
          <div slot="header" class="card-header">
            <span>高频抽中专家</span>
          </div>
          <div class="chart-container" ref="topExpertsRef"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getTableDataApi as getExpertData, getFieldUserCount } from "@/requests/expert";
import { getTableDataApiTeacher as getTaskData, getTasksWithExpertCount } from "@/requests/task/task.ts";
import { getTableDataApi as getTaskResultData, getTopSelectedUsers } from "@/requests/taskresult/taskresult.ts";
import { getTaskStatusCount } from "@/requests/task/task.ts";

const expertChartRef = ref(null);
const taskCompletionRef = ref(null);
const expertFieldRef = ref(null);
const topExpertsRef = ref(null);

let expertChart: echarts.ECharts | null = null;
let taskCompletionChart: echarts.ECharts | null = null;
let expertFieldChart: echarts.ECharts | null = null;
let topExpertsChart: echarts.ECharts | null = null;

interface TaskType {
  id: string;
  taskName: string;
  status: number;
  [key: string]: any;
}

interface ExpertFieldType {
  name: string;
  value: number;
}

interface FieldUserCountType {
  fieldName: string;
  number: number;
}

interface TaskExpertCountType {
  taskName: string;
  expertCount: number;
}

interface UserSelectCountType {
  userId: string;
  userName: string;
  count: number;
}

// 专家抽取情况数据
const expertData = ref({
  expertTotal: 0,
  assignedExperts: 0,
  expertsByTask: [] as TaskExpertCountType[]
});

// 任务分配情况数据
const taskDistributionData = ref({
  tasks: [] as string[],
  expertCounts: [] as number[]
});

// 任务履行情况数据
const taskCompletionData = ref({
  status1: 0, // 初始化
  status2: 0, // 资源准备完成
  status3: 0, // 抽取状态
  status4: 0, // 评审状态
  status5: 0  // 评审完成
});

// 专家领域分布数据
const expertFieldData = ref<ExpertFieldType[]>([]);

// 热门专家数据
const topExpertsData = ref<UserSelectCountType[]>([]);

// 获取专家数据
const fetchExpertData = async () => {
  try {
    // 获取所有专家总数
    const res = await getExpertData({
      page: 1,
      size: 100,
      name: '',
    });
    
    expertData.value.expertTotal = res.data.data.total;
    
    // 获取任务专家抽取数据
    const taskExpertRes = await getTasksWithExpertCount();
    if (taskExpertRes.data.code === 200) {
      expertData.value.expertsByTask = taskExpertRes.data.data;
      
      // 更新任务分配数据
      taskDistributionData.value.tasks = expertData.value.expertsByTask.map(item => item.taskName);
      taskDistributionData.value.expertCounts = expertData.value.expertsByTask.map(item => item.expertCount);
      
      // 计算已分配专家总数
      expertData.value.assignedExperts = expertData.value.expertsByTask.reduce((sum, item) => sum + item.expertCount, 0);
    }
    
    // 初始化专家图表
    initExpertChart();
  } catch (error) {
    console.error('获取专家数据失败:', error);
  }
};

// 获取任务数据
const fetchTaskData = async () => {
  try {
    // 获取任务状态数量数据
    const statusRes = await getTaskStatusCount();
    if (statusRes.data.code === 200) {
      const statusData = statusRes.data.data;
      taskCompletionData.value.status1 = statusData.status1;
      taskCompletionData.value.status2 = statusData.status2;
      taskCompletionData.value.status3 = statusData.status3;
      taskCompletionData.value.status4 = statusData.status4;
      taskCompletionData.value.status5 = statusData.status5;
    }
    
    // 初始化任务完成情况图表
    initTaskCompletionChart();
  } catch (error) {
    console.error('获取任务数据失败:', error);
  }
};

// 获取专家领域分布数据
const fetchExpertFieldData = async () => {
  try {
    // 获取专家领域分布数据
    const res = await getFieldUserCount();
    if (res.data.code === 200) {
      // 将后端返回的数据转换为图表需要的格式
      expertFieldData.value = res.data.data.map((item: FieldUserCountType) => ({
        name: item.fieldName,
        value: item.number
      }));
    } else {
      // 如果获取失败，使用模拟数据
      expertFieldData.value = [
        { name: '计算机科学', value: 20 },
        { name: '电子工程', value: 15 },
        { name: '机械工程', value: 10 },
        { name: '材料科学', value: 8 },
        { name: '人工智能', value: 12 }
      ];
    }
    
    // 初始化专家领域分布图表
    initExpertFieldChart();
  } catch (error) {
    console.error('获取专家领域数据失败:', error);
    // 如果出错，使用模拟数据
    expertFieldData.value = [
      { name: '计算机科学', value: 20 },
      { name: '电子工程', value: 15 },
      { name: '机械工程', value: 10 },
      { name: '材料科学', value: 8 },
      { name: '人工智能', value: 12 }
    ];
    initExpertFieldChart();
  }
};

// 获取热门专家数据
const fetchTopExpertsData = async () => {
  try {
    const res = await getTopSelectedUsers();
    if (res.data.code === 200) {
      topExpertsData.value = res.data.data;
      initTopExpertsChart();
    } else {
      console.error('获取热门专家数据失败:', res.data.msg);
      // 填充模拟数据
      topExpertsData.value = [
        { userId: '1', userName: '专家A', count: 15 },
        { userId: '2', userName: '专家B', count: 12 },
        { userId: '3', userName: '专家C', count: 10 },
        { userId: '4', userName: '专家D', count: 8 },
        { userId: '5', userName: '专家E', count: 7 },
        { userId: '6', userName: '专家F', count: 6 },
        { userId: '7', userName: '专家G', count: 5 },
        { userId: '8', userName: '专家H', count: 4 },
        { userId: '9', userName: '专家I', count: 3 },
        { userId: '10', userName: '专家J', count: 2 }
      ];
      initTopExpertsChart();
    }
  } catch (error) {
    console.error('获取热门专家数据失败:', error);
    // 填充模拟数据
    topExpertsData.value = [
      { userId: '1', userName: '专家A', count: 15 },
      { userId: '2', userName: '专家B', count: 12 },
      { userId: '3', userName: '专家C', count: 10 },
      { userId: '4', userName: '专家D', count: 8 },
      { userId: '5', userName: '专家E', count: 7 },
      { userId: '6', userName: '专家F', count: 6 },
      { userId: '7', userName: '专家G', count: 5 },
      { userId: '8', userName: '专家H', count: 4 },
      { userId: '9', userName: '专家I', count: 3 },
      { userId: '10', userName: '专家J', count: 2 }
    ];
    initTopExpertsChart();
  }
};

// 初始化专家抽取情况图表
const initExpertChart = () => {
  if (!expertChartRef.value) return;
  
  expertChart = echarts.init(expertChartRef.value);
  
  const options = {
    title: {
      text: `专家总数: ${expertData.value.expertTotal} | 已分配: ${expertData.value.assignedExperts}`,
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: taskDistributionData.value.tasks.length > 0 ? 
        taskDistributionData.value.tasks : 
        ['任务1', '任务2', '任务3', '任务4', '任务5']
    },
    yAxis: {
      type: 'value',
      name: '专家数量'
    },
    series: [
      {
        name: '抽取专家数',
        type: 'bar',
        data: taskDistributionData.value.expertCounts.length > 0 ? 
          taskDistributionData.value.expertCounts : 
          [10, 15, 8, 12, 6],
        itemStyle: {
          color: '#5470c6'
        }
      }
    ]
  };
  
  expertChart.setOption(options);
};

// 初始化任务履行情况图表
const initTaskCompletionChart = () => {
  if (!taskCompletionRef.value) return;
  
  taskCompletionChart = echarts.init(taskCompletionRef.value);
  
  const options = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 'bottom',
      type: 'scroll',
      padding: [0, 10],
      itemGap: 10
    },
    series: [
      {
        name: '任务状态',
        type: 'pie',
        radius: ['30%', '65%'],
        center: ['50%', '45%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          { 
            value: taskCompletionData.value.status1, 
            name: '初始化',
            itemStyle: { color: '#ee6666' }
          },
          { 
            value: taskCompletionData.value.status2, 
            name: '资源准备完成',
            itemStyle: { color: '#fac858' }
          },
          { 
            value: taskCompletionData.value.status3, 
            name: '抽取状态',
            itemStyle: { color: '#5470c6' }
          },
          { 
            value: taskCompletionData.value.status4, 
            name: '评审状态',
            itemStyle: { color: '#73c0de' }
          },
          { 
            value: taskCompletionData.value.status5, 
            name: '评审完成',
            itemStyle: { color: '#91cc75' }
          }
        ]
      }
    ]
  };
  
  taskCompletionChart.setOption(options);
};

// 初始化专家领域分布图表
const initExpertFieldChart = () => {
  if (!expertFieldRef.value) return;
  
  expertFieldChart = echarts.init(expertFieldRef.value);
  
  const options = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      bottom: 'bottom',
      padding: [0, 10],
      itemGap: 10
    },
    series: [
      {
        name: '专家领域分布',
        type: 'pie',
        radius: ['30%', '65%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: expertFieldData.value.map(item => ({
          name: item.name,
          value: item.value
        }))
      }
    ]
  };
  
  expertFieldChart.setOption(options);
};

// 初始化热门专家图表
const initTopExpertsChart = () => {
  if (!topExpertsRef.value) return;
  
  topExpertsChart = echarts.init(topExpertsRef.value);
  
  // 数据排序和准备
  const sortedData = [...topExpertsData.value].sort((a, b) => a.count - b.count);
  const userNames = sortedData.map(item => item.userName);
  const counts = sortedData.map(item => item.count);
  
  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    title: {
      text: '被抽中次数最多的前10名专家',
      left: 'center',
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '抽取次数'
    },
    yAxis: {
      type: 'category',
      data: userNames,
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    series: [
      {
        name: '抽取次数',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: function(params: any) {
            // 根据数值大小设置不同的颜色深度
            const colorList = [
              '#83bff6', '#188df0', '#005eaa', '#0042a8', '#00318b'
            ];
            const index = Math.min(Math.floor(params.value / 4), colorList.length - 1);
            return colorList[index];
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      }
    ]
  };
  
  topExpertsChart.setOption(options);
};

// 窗口大小变化时重新调整图表大小
const handleResize = () => {
  expertChart?.resize();
  taskCompletionChart?.resize();
  expertFieldChart?.resize();
  topExpertsChart?.resize();
};

onMounted(async () => {
  // 获取数据并初始化图表
  await fetchExpertData();
  await fetchTaskData();
  await fetchExpertFieldData();
  await fetchTopExpertsData();
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 取消监听并销毁图表
  window.removeEventListener('resize', handleResize);
  expertChart?.dispose();
  taskCompletionChart?.dispose();
  expertFieldChart?.dispose();
  topExpertsChart?.dispose();
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #F5F5F5;
}

.chart-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 400px;
  width: 100%;
}

/* 针对并排显示的图表调整高度 */
.el-row:nth-child(2) .chart-container {
  height: 350px;
}
</style> 