import type * as Table from "./type.ts"
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
export function getExcelApi() {
  return service({
    url: "/oss/download-excel",
    method: "get",
  })
}

/** 修改密码 */
export function updatePasswordApi(data: { id: string | undefined, password: string, newPassword: string }) {
  return service({
    url: "/user/change-password",
    method: "post",
    data
  })
}