import {defineStore} from "pinia";
import type {UserInfo} from "@/requests/model/userInfo";

export const useInfoStore = defineStore({
    id: 'useInfo',
    state: () => ({
        userInfo: {} as UserInfo,
    }),
    actions: {
        setUserInfo(userInfo: UserInfo) {
            this.userInfo = userInfo;
        }
    }
});
