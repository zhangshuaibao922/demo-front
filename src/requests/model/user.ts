export interface User {
    id?: string;            // 主键，后端生成，前端可选
    account: string;        // 账号
    password: string;       // 密码
    name: string;          // 姓名
    fieldId: number;       // 领域
    roleId: number;        // 权限
    old: number;           // 年限
    score: number;         // 评分
}