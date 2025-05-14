import type * as Table from "./type.ts"
import service from "@/requests/service.ts";
/** 查 */
export function getTableDataApi(params: Table.TableRequestData) {
    return service({
        url: "/task/page",
        method: "get",
        params
    })
}
export function getTableDataApiTeacher(params: Table.TableRequestData) {
    return service({
        url: "/task/page/teacher",
        method: "get",
        params
    })
}
export function getTableDataApiResult(params: Table.TableRequestData) {
    return service({
        url: "/task/page/result",
        method: "get",
        params
    })
}
/** 增 */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData,userId:string) {
    return service({
        url: "/task/add/"+userId,
        method: "post",
        data
    })
}
/** 删 */
export function deleteAllTableDataApi(data: Table.CreateOrUpdateTableRequestData[]) {
    return service({
        url: "/task/delete/all",
        method: "post",
        data
    })
}
/** 删 */
export function deleteTableDataApi(id: string) {
    return service({
        url: `/task/delete/${id}`,
        method: "get"
    })
}
export function getTasksWithExpertCount() {
    return service({
        url: '/task/tasks-with-expert-count',
        method: 'get'
    })
}

export function getTaskStatusCount() {
    return service({
        url: '/task/status-count',
        method: 'get'
    })
}