export interface CreateOrUpdateTableRequestData {
    id?: string;          // 主键，使用可选字段
    taskName: string;     // 任务名称
    conditionId: string; // 条件id
    siphonTime: Date| null;  // 抽取时间，使用 ISO 格式的字符串
    startTime: Date| null;   // 开始评审时间，使用 ISO 格式的字符串
    endTime: Date| null;     // 结束时间，使用 ISO 格式的字符串
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
}

export interface TableData {
    id: string;          // 主键，使用可选字段
    taskName: string;     // 任务名称
    conditionId: string; // 条件id
    siphonTime: Date;  // 抽取时间，使用 ISO 格式的字符串
    startTime: Date;   // 开始评审时间，使用 ISO 格式的字符串
    endTime: Date;     // 结束时间，使用 ISO 格式的字符串
    resultScore: number; // 得分
    status: number;      // 状态
}