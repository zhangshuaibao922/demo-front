<script setup lang="ts">
import {ref} from "vue";
const loading = ref<boolean>(false)
</script>

<template>
  <div class="app-container" style="  padding: 20px;background-color: #F5F5F5">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">

    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>