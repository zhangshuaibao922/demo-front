import service from "@/requests/service.ts";
export interface Login{
    account: string;
    password: string;
}

export function login_API(data:Login){
    return service({
        url:'/login/login',
        method:'post',
        data
    })
}