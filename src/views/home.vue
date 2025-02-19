<template>
  <div class="condition-form" style="width: 100px;height: 100px">
    <el-form ref="formRef" :model="formData" >
      <div v-for="(item, index) in formData.conditions" :key="index" class="condition-row" style="height: 50px; display: flex; align-items: center;">
        <!-- 条件类型选择 -->
        <el-select
            v-model="item.condition_name"
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
            v-model="item.condition_if"
            placeholder="选择运算符"
            style="width: 120px; margin-right: 10px"
            :disabled="!item.condition_name"
        >
          <el-option
              v-for="opt in getOperators(item.condition_name)"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>

        <!-- 动态值输入 -->
        <template v-if="item.condition_name">
          <!-- 领域名称（单选） -->
          <el-select
              v-if="item.condition_name === 'fieldName'"
              v-model="item.condition_value"
              placeholder="选择领域"
              style="width: 300px"
          >
            <el-option
                v-for="field in fieldOptions"
                :key="field"
                :label="field"
                :value="field"
            />
          </el-select>

          <!-- 数值输入（old/score） -->
          <el-input-number
              v-else-if="['old', 'score'].includes(item.condition_name)"
              v-model="item.condition_value"
              :precision="0"
              :min="0"
              controls-position="right"
              style="width: 200px"
          />

          <!-- 小数输入（classmate/colleague） -->
          <el-slider
              v-else-if="['classmate', 'colleague'].includes(item.condition_name as string)"
              v-model="item.condition_value"
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
            @click="removeCondition(index)"
            type="danger"
            style="margin-left: 10px"
        >删除
        </el-button>
      </div>
      <!-- 新增按钮 -->
      <el-button @click="addCondition" type="primary" style="margin-top: 10px;">
        新增条件
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'

type ConditionType = 'old' | 'score' | 'fieldName' | 'classmate' | 'colleague'

interface Condition {
  condition_name: ConditionType | null
  condition_if: string
  condition_value: any
}

const formData = reactive({
  conditions: [{ condition_name: null, condition_if: '', condition_value: null }] as Condition[]
})

// 条件选项
const conditionOptions = [
  { label: '工作年限', value: 'old' },
  { label: '项目得分', value: 'score' },
  { label: '专业领域', value: 'fieldName' },
  { label: '同学关系', value: 'classmate' },
  { label: '同事关系', value: 'colleague' }
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
  ]
}

// 领域选项（示例数据）
const fieldOptions = reactive<string[]>([])
const fetchFieldOptions = async () => {
  // 这里调用接口获取领域列表
  fieldOptions.push('人工智能', '大数据', '前端开发', '后端开发', 'DevOps')
}

// 获取运算符选项
const getOperators = (type: ConditionType | null) => {
  return type ? operatorsMap[type] || [] : []
}

onMounted(() => {
  fetchFieldOptions()
})

// 新增条件
const addCondition = () => {
  formData.conditions.push({ condition_name: null, condition_if: '', condition_value: null })
}

// 删除条件
const removeCondition = (index: number) => {
  formData.conditions.splice(index, 1)
}

// 切换条件类型时重置值
const handleConditionChange = (index: number) => {
  const condition = formData.conditions[index]
  condition.condition_if = ''
  condition.condition_value = null

  // 设置默认值
  if (['classmate', 'colleague'].includes(condition.condition_name as string)) {
    condition.condition_value = 0.5
  }
}
</script>