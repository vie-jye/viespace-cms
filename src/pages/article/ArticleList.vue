<template>
<div class="app-home-article">
    <h2>文章列表</h2>
    <button @click="createArticle">创建文章</button>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">标题</th>
                <th scope="col">创建时间</th>
                <th scope="col">更新时间</th>
                <th scope="col">作者</th>
                <th scope="col">类型</th>
                <th scope="col">分类</th>
                <th scope="col">浏览量</th>
                <th scope="col">操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in paginatedArticleList?.list" :key="item.id">
                <th scope="row">{{ item.id }}</th>
                <td>{{ item.title }}</td>
                <td>{{ formatTime(item.createTime) }}</td>
                <td>{{ formatTime(item.updateTime) }}</td>
                <td>-</td>
                <td>{{ item.articleType }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.views }}</td>
                <td>
                    <button @click="viewArticle(item.id)">查看</button>
                    <button @click="updateArticle(item.id)">修改</button>
                    <button @click="changeStatus(item.id)">{{ item.status === 0 ? '下线' : '上线' }}</button>
                    <button @click="deleteArticle(item.id)">删除</button>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="pagination">
        <button @click="prevPage">&lt;</button>
        <span>{{ paginatedArticleList?.pageNum }} / {{ paginatedArticleList?.pages }}</span>
        <button @click="nextPage">&gt;</button>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAppStateStore } from '../../store/appState';
import router from '../../router';
import moment from 'moment';

const host = useAppStateStore().appConfig.apiHost;

type Article = {
    id: number,
    createTime: number,
    updateTime: number,
    createUser: string,
    title: string,
    articleType: string,
    category: string,
    views: number,
    status: number
}
type PageArticle = {
    total: number, // 记录数
    size: number, // 每页大小
    pageNum: number, // 当前页码
    pages: number, // 总页数
    list: Article[], // 记录列表
    hasNextPage: boolean // 是否有下一页
}
const paginatedArticleList = ref<PageArticle>();

const formatTime = (timestamp: number) => {
    return timestamp > 0 ? moment.unix(timestamp).format('YYYY-MM-DD') : '-';
};

// 切换到上一页
const prevPage = () => {
    let pageNum = paginatedArticleList.value?.pageNum;
    if (pageNum && pageNum > 1) {
        fetchArticleList(pageNum - 1);
    }
};

// 切换到下一页
const nextPage = () => {
    if (paginatedArticleList.value?.hasNextPage) {
        let pageNum = paginatedArticleList.value?.pageNum;
        fetchArticleList(pageNum + 1);
    }
};

// 创建文章的函数
const createArticle = () => {
    console.log('创建文章');
    router.push({ name: 'article-create' });
};
// 查看文章的函数
const viewArticle = (id: number) => {
    console.log(`查看文章Id：${id}`);
    router.push({ name: 'article-detail', params: { id: id } });
};
// 修改文章的函数
const updateArticle = (id: number) => {
    console.log(`修改文章Id：${id}`);
    router.push({ name: 'article-edit', params: { id: id } });
};
// 删除文章的函数
const deleteArticle = (id: number) => {
    console.log(`删除文章Id：${id}`);
    axios.defaults.withCredentials = true
    axios.delete(host + '/article/delete' + '/' + id).then(response => {
        console.log(response.data)
        fetchArticleList(paginatedArticleList.value?.pageNum);
    }).catch(error => {
        console.log(error);
    });
};
// 上线/下线文章的函数
const changeStatus = (id: number) => {
    console.log(`文章Id：${id} 已上线/下线`);
    axios.defaults.withCredentials = true
    axios.put(host + '/article/updateStatus' + '/' + id).then(response => {
        console.log(response.data)
        fetchArticleList(paginatedArticleList.value?.pageNum);
    }).catch(error => {
        console.log(error);
    });
};

const fetchArticleList = (pageNum?: number) => {
    // 在这里编写你的请求逻辑，获取文章列表数据
    console.log('获取文章列表');
    axios.defaults.withCredentials = true
    axios.get(host + '/article/list', {
        params: {
            startYear: null,
            endYear: null,
            categoryId: null,
            page: pageNum || 1,
            pageSize: 10
        }
    }).then(response => {
        console.log(response.data)
        paginatedArticleList.value = response.data;
    }).catch(error => {
        console.log(error);
    });
};
onMounted(() => {
    fetchArticleList();
});
</script>

<style scoped>
.app-home-article {
    width: 90%;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.app-home-article h2 {
    text-align: center;
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    margin-bottom: 10px;
    background-color: #4CAF50;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
    font-weight: bold;
}

button {
    background-color: #45a049;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #dee2e6;
    padding: 8px;
    text-align: left;
}

.table thead th {
    background-color: #f8f9fa;
    border-color: #dee2e6;
}

.table tr:hover {
    background-color: #f2f2f2;
}

.table th:last-child,
.table td:last-child {
    width: 120px;
    text-align: center;
}

.table button {
    padding: 5px 10px;
    margin-right: 5px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.table button:hover {
    background-color: #45a049;
}

/* 分页 */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    padding: 10px 20px;
    margin: 0 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    margin: 0 10px;
    font-weight: bold;
}
</style>