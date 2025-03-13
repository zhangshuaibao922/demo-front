import service from "@/requests/service.ts";
import type {TableData, TableRequestData} from "@/requests/taskresult/type.ts";

/** 查 */
export function getTableDataApi(params: TableRequestData) {
    return service({
        url: "/taskResult/page",
        method: "get",
        params
    })
}

/** 删 */
export function deleteAllTableDataApi(data: TableData[]) {
    return service({
        url: "/taskResult/delete/all",
        method: "post",
        data
    })
}

/** 查 */
export function queryByName(name: string) {
    return service({
      url: `/user/get/${name}`,
      method: "post"
    })
  }

  /** 查 */
export function deleteById(id: string) {
    return service({
      url: `/taskResult/delete/${id}`,
      method: "get"
    })
  }

/** add */
export function addTableDataApi(taskId: string, userId: string) {
    return service({
      url: `/taskResult/add/${taskId}/${userId}`,
      method: "post"
    })
  }