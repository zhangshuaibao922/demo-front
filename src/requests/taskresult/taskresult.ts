import service from "@/requests/service.ts";
import type {TableRequestData} from "@/requests/taskresult/type.ts";

/** 查 */
export function getTableDataApi(params: TableRequestData) {
    return service({
        url: "/taskResult/page",
        method: "get",
        params
    })
}