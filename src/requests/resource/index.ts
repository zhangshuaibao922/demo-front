import service from "@/requests/service.ts";
import type { TaskResult } from "@/requests/resource/type.ts"
export function getResourceList(taskId:string) {
  return service({
    url: "/resource/all/"+taskId,
    method: "get",
  });
}
export function submitScoreApi(data:TaskResult){
  return service({
    url: "/taskResult/update",
    method: "post",
    data
  });
}

export function queryOne(taskId:string,id:string){
  return service({
    url: "/taskResult/one/"+taskId+"/"+id,
    method: "get",
  });
}