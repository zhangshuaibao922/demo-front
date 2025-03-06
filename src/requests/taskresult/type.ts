export interface CreateOrUpdateTableRequestData {
    id?: string;          // 主键，使用可选字段
    taskId: string;     // 任务名称
    userId: string; // 条件id
    userName: string| null;  // 抽取时间，使用 ISO 格式的字符串
    fieldId: number| null;   // 开始评审时间，使用 ISO 格式的字符串
    score: number| null;     // 结束时间，使用 ISO 格式的字符串
    description: string; // 得分
}

export interface TableRequestData {
    /** 当前页码 */
    page: number
    /** 查询条数 */
    size: number
    /** 查询参数：用户名 */
    taskId: string
    name?: string
    fieldName?: string
}

export interface TableData {
    id: string;          // 主键，使用可选字段
    taskId: string;     // 任务名称
    userId: string; // 条件id
    userName: string;  // 抽取时间，使用 ISO 格式的字符串
    email: string;  // 抽取时间，使用 ISO 格式的字符串
    fieldName: string;  // 抽取时间，使用 ISO 格式的字符串
    score: number;     // 结束时间，使用 ISO 格式的字符串
    description: string; // 得分
}