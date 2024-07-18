<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAppStateStore } from '../store/appState';

let router = useRouter();
let username = ref('')
let password = ref('')
const host = useAppStateStore().appConfig.apiHost;

const login = () => {
    axios.defaults.withCredentials = true;
    axios.post(host + '/user/login', {
        username: username.value,
        password: password.value
    }).then(response => {
        if (response.status === 200) {
            useAppStateStore().onLogin(response.data);
            router.push('/home');
        }
    }).catch(error => {
        // 登录失败，处理错误
        console.error(error);
        alert(error.message);
    });
}
</script>

<template>
<div class="login-container">
    <h2>登录</h2>
    <input type="text" placeholder="用户名" v-model="username">
    <input type="password" placeholder="密码" v-model="password">
    <button @click="login">登录</button>
</div>
</template>

<style scoped>
.login-container {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
    text-align: center;
    margin-bottom: 20px;
}

.login-container input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
}

.login-container button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-container button:hover {
    background-color: #45a049;
}
</style>