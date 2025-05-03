export interface CreateOrUpdateTableRequestData {
    id?: string;          // 主键，使用可选字段
    taskName: string;     // 任务名称
    conditionId: string; // 条件id
    siphonTime: string| null;  // 抽取时间，使用 ISO 格式的字符串
    startTime: string| null;   // 开始评审时间，使用 ISO 格式的字符串
    endTime: string| null;     // 结束时间，使用 ISO 格式的字符串
    resultScore: number; // 得分
    status: number;      // 状态
}
export interface TableRequestData {
    /** 当前页码 */
    page: number
    /** 查询条数 */
    size: number
    /** 查询参数：用户名 */
    taskName?: string
    status?: number
    id?:string
}

export interface TableData {
    id: string;          // 主键，使用可选字段
    taskName: string;     // 任务名称
    conditionId: string; // 条件id
    siphonTime: string;  // 抽取时间，使用 ISO 格式的字符串
    startTime: string;   // 开始评审时间，使用 ISO 格式的字符串
    endTime: string;     // 结束时间，使用 ISO 格式的字符串
    resultScore: number; // 得分
    status: number;      // 状态
}