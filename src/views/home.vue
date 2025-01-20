<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="openCreateDialog">新增领域</el-button>
    </el-header>

    <el-main>
      <el-row :gutter="20">
        <el-col :span="8" v-for="task in fields" :key="task.field_id">
          <el-card class="task-card" :body-style="{ padding: '20px' }">
            <div>
              <h3>{{ task.field_name }}</h3>
              <p><strong>领域ID:</strong> {{ task.field_id }}</p>
              <p><strong>创建时间:</strong> {{ task.create_time }}</p>
              <p><strong>更新时间:</strong> {{ task.update_time }}</p>
            </div>
            <div class="card-footer">
              <el-button size="small" @click="openEditDialog(task)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteField(task)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-pagination
          v-if="total > 0"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          @current-change="handlePageChange">
      </el-pagination>
    </el-main>

    <!-- 新增/编辑领域的对话框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="领域名称" prop="field_name" :rules="[{ required: true, message: '请输入领域名称', trigger: 'blur' }]">
          <el-input v-model="form.field_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="form.create_time" type="datetime" placeholder="选择创建时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker v-model="form.update_time" type="datetime" placeholder="选择更新时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveField">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton, ElCard, ElCol, ElContainer, ElDialog, ElForm, ElFormItem, ElInput, ElDatePicker, ElPagination, ElRow } from 'element-plus';

// 数据和分页设置
const fields = ref([
  { field_id: 1, field_name: '技术', create_time: '2021-10-01', update_time: '2021-10-10' },
  { field_id: 2, field_name: '产品', create_time: '2021-11-01', update_time: '2021-11-15' }
]);

const total = ref(2);
const pageSize = ref(10);
const currentPage = ref(1);

// 控制对话框
const dialogVisible = ref(false);
const dialogTitle = ref('新增领域');
const form = ref({
  field_id: null,
  field_name: '',
  create_time: '',
  update_time: ''
});

// 打开对话框
const openCreateDialog = () => {
  dialogTitle.value = '新增领域';
  form.value = { field_id: null, field_name: '', create_time: '', update_time: '' };
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (row: any) => {
  dialogTitle.value = '编辑领域';
  form.value = { ...row };
  dialogVisible.value = true;
};

// 删除领域
const deleteField = (row: any) => {
  const index = fields.value.findIndex(item => item.field_id === row.field_id);
  if (index !== -1) {
    fields.value.splice(index, 1);
    total.value -= 1; // 更新总数
  }
};

// 保存领域
const saveField = () => {
  if (form.value.field_id) {
    const index = fields.value.findIndex(item => item.field_id === form.value.field_id);
    if (index !== -1) {
      fields.value[index] = { ...form.value };
    }
  } else {
    form.value.field_id = fields.value.length + 1;
    fields.value.push(form.value);
    total.value += 1;
  }
  dialogVisible.value = false;
};

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 根据分页获取数据
};
</script>

<style scoped>
.task-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.task-card:hover {
  transform: scale(1.05);
}

.card-footer {
  margin-top: 10px;
  text-align: right;
}
</style>