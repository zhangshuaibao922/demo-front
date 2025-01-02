import type * as Table from "./type"
import service from "@/requests/service.ts";

/** 增 */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return service({
    url: "/user/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: string) {
  return service({
    url: `/user/delete/${id}`,
    method: "get"
  })
}
/** 删 */
export function deleteAllTableDataApi(data: Table.CreateOrUpdateTableRequestData[]) {
  return service({
    url: "/user/delete/all",
    method: "post",
    data
  })
}

/** 改 */
export function updateTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return service({
    url: "/user/update",
    method: "post",
    data
  })
}

/** 查 */
export function getTableDataApi(params: Table.TableRequestData) {
  return service({
    url: "/user/page",
    method: "get",
    params
  })
}
export function getFieldDataApi() {
  return service({
    url: "/filed/all",
    method: "get",
  })
}

export function getRoleDataApi() {
  return service({
    url: "/role/all",
    method: "get",
  })
}