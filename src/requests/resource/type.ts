export interface Resource {
    /** 主键ID */
    id: string;
    /** 任务ID */
    taskId: string;
    /** 上传人ID */
    userId: string;
    /** 文件类型 */
    resourceType: string;
    /** 文件URL链接 */
    resourceUrl: string;
    resourceName:string;
  }

export interface TaskResult{
  id?: string;          // 主键，使用可选字段
  taskId: string;     // 任务名称
  userId: string; // 条件id
  userName: string| null;  // 抽取时间，使用 ISO 格式的字符串
  fieldId: number| null;   // 开始评审时间，使用 ISO 格式的字符串
  score: number| null;     // 结束时间，使用 ISO 格式的字符串
  description: string; // 得分
}