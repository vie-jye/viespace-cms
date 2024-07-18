import {defineStore} from "pinia";

export const useAppStateStore = defineStore('appState', ()=> {
// state
const appConfig = {
    apiHost: 'https://3t5qjosy-779y1bl6-642g078x85ne.c2.mcprev.cn'
}

// actions
function onLogin(userInfo: any): void {
    if (userInfo.session) {
        // 存储到localStorage
        localStorage.setItem('session', userInfo.session);
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('userid', userInfo.id);
    }
}
// getters

return { appConfig, onLogin }
});