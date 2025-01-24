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
/** 增 */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
    return service({
        url: "/task/add",
        method: "post",
        data
    })
}