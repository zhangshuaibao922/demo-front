import type * as Table from "./type.ts"
import service from "@/requests/service.ts";
/** 查 */
export function getTableDataApi(taskId:string) {
    return service({
        url: `/resource/all/${taskId}`,
        method: "get",
    })
}

export function add(taskId:string,userId?:string,data?:any){
    return service({
        url:'/resource/add/'+taskId+"/"+userId,
        method:'post',
        headers: {
            'Content-Type': 'multipart/form-data' // 设置正确的 Content-Type
        },
        data,
    })
}
export function deleteTableDataApi(id: string) {
    return service({
        url: `/resource/delete/${id}`,
        method: "get"
    })
}
