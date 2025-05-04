import service from "@/requests/service.ts";
export interface Login{
    account: string;
    password: string;
}
export interface Create{
      id: undefined,
  account: "",
  password: "",
  name: "",
  email:"",
  fieldId: 0,
  relationship: "",
  roleId: 2,
  old: 0,
  score: 0,
}

export function login_API(data:Login){
    return service({
        url:'/login/login',
        method:'post',
        data
    })
}

export function create_API(data:Create,code:string){
    return service({
        url:'/login/create/'+code,
        method:'post',
        data
    })
}

export function sendCode_API(email:string){
    return service({
        url:'/login/code/'+email,
        method:'get',
    })
}