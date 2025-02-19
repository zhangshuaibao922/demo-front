import service from "@/requests/service.ts";
import type {condtion} from "./type.ts";
/** 查 */
export function getTableDataApi(taskId:string) {
    return service({
        url: `/resource/all/${taskId}`,
        method: "get",
    })
}
export function getCondtionApi(taskId:string) {
    return service({
        url: `/condtion/all/${taskId}`,
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

export function addCondtion(data:condtion[],taskId:string){
    return service({
        url:'/condtion/saveBatch/'+taskId,
        method:'post',
        data
    })
}
