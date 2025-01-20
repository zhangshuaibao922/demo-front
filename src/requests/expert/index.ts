import type * as Table from "./type.ts"
import service from "@/requests/service.ts";
import type {TableData} from "./type.ts";

/** 增 */
export function createTableDataApi(data: Table.TableData) {
    return service({
        url: "/expert/add",
        method: "post",
        data
    })
}

/** 删 */
export function deleteTableDataApi(id: string) {
    return service({
        url: `/expert/delete/${id}`,
        method: "get"
    })
}
export function deleteAllExpertDataApi(data: TableData[]) {
    return service({
        url: "/expert/delete/all",
        method: "post",
        data
    })

}

/** 改 */
export function updateTableDataApi(data: Table.TableData) {
    return service({
        url: "/expert/update",
        method: "post",
        data
    })
}

export interface TableRequestData {
    /** 当前页码 */
    page: number
    /** 查询条数 */
    size: number
    /** 查询参数：用户名 */
    name?: string
}
/** 查 */
export function getTableDataApi(params: TableRequestData) {
    return service({
        url: "/expert/all",
        method: "get",
        params
    })
}

/** 查 */
export function getUserDataApi(username: string) {
    return service({
        url: "/expert/all/"+username,
        method: "get",
    })
}