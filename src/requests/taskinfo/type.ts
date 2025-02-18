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