import type {ConditionType} from "@/views/taskinfo.vue";

export interface resourceDto {
    id:string,
    taskId:string,
    userId:string,
    userName:string,
    resourceType:string,
    resourceUrl:string
}
export interface resource {
    id:string,
    taskId:string,
    userId?:string,
    resourceType:string,
    resourceUrl:string
}
export interface condtion {
    id?:string,
    conditionId: string,
    conditionName: ConditionType|null,
    conditionIf: string,
    conditionValue: string
}
