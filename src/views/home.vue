<template>
  <button @click="preview(value)" v-for="(key, value) in preDict" :key="key">{{ value }}</button>
  <br>
  <iframe v-if="staticSrc" :src="`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(staticSrc)}`" />
</template>


<script setup>
import { ref } from "vue";
const staticSrc = ref('')
const preDict = {
  预览word: 'http://ashuai.work/api/word.docx',
  预览excel: 'http://ashuai.work/api/excel.xlsx',
  预览ppt: 'http://ashuai.work/api/ppt.pptx',
  预览pdf: 'http://ashuai.work/api/pdf.pdf',
  预览图片: 'http://ashuai.work/api/tree.png',
}
const preview = (params) => {
  if (params === '预览pdf' | params === '预览图片') {
      window.open(preDict[params], '_blank')
  } else {
      staticSrc.value = preDict[params]
  }
}
</script>

<style scoped>
button {
  margin: 0 12px;
  padding: 4px 8px;
  margin-bottom: 12px;
}

iframe {
  width: 900px;
  height: 600px;
}
</style>
