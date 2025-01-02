export interface CreateOrUpdateTableRequestData {
  id?: string
  account: string
  password: string
  name: string
  fieldId: number
  roleId: number
  old: number
  score: number
}

export interface TableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  name?: string
  /** 查询参数：手机号 */
  fieldName?: string
  score?: string
}

export interface TableData {
  id: string
  account: string
  password: string
  name: string
  fieldId: number
  roleId: number
  old: number
  score: number
}
export interface Field{
  fieldId: number
  fieldName:string
}
export interface Role{
  roleId: number
  roleName:string
}