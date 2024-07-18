<template>
<div class="app-home">
    <h2>欢迎来到管理后台</h2>
    <div class="menu">
        <ul>
            <li><router-link to="/home/article/list">文章</router-link></li>
            <li><router-link to="/home/user">用户</router-link></li>
            <li><router-link to="/home/category">分类</router-link></li>
        </ul>
    </div>
    <div class="container">
        <router-view></router-view>
    </div>
</div>
</template>

<style scoped>
.app-home {
    width: 1024px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.app-home h2 {
    text-align: center;
    margin-bottom: 20px;
}

.menu ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.menu li {
    display: inline-block;
    margin-right: 10px;
}

.menu a {
    display: block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #fff;
    border-radius: 3px;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.menu a:hover {
    background-color: #45a049;
}

.container {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 100px;
}
</style>