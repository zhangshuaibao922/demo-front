import {defineStore} from "pinia";
import type {User} from "@/requests/model/user.ts";


export const useInfoStore = defineStore({
    id: 'user',
    state: () => ({
        user: {} as User,
    }),
    actions: {
        setUserInfo(user: User) {
            this.user = user;
        }
    }
});
