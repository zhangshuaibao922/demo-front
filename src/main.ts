import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts';

import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
const app = createApp(App)


// Use plugin defaults (optional)
app.use(setupCalendar, {})
// Use the components
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.config.globalProperties.$echarts = echarts;
app.mount('#app')
