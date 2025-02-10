import {defineStore} from "pinia";
import type {TableData} from "@/requests/task/type.ts";


export const taskInfoStore = defineStore({
    id: 'taskInfo',
    state: () => ({
        taskInfo: {} as TableData,
    }),
    actions: {
        setTaskInfo(taskInfo: TableData) {
            this.taskInfo = taskInfo;
        }
    }
});
