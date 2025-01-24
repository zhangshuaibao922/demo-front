<template>
  <VDatePicker v-model="date" mode="dateTime" is24hr />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date())
</script>
