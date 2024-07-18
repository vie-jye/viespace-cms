<template>
<div class="app-home-article">
  <h2>{{ props.type === 'create' ? '创建文章' : props.type === 'detail' ? '文章详情' : '编辑文章' }}</h2>
  <form @submit.prevent="onSubmit">
    <div class="form-group">
      <label for="title">标题</label>
      <input type="text" id="title" v-model.trim="article.title" />
    </div>
    <div class="form-group">
      <label>内容</label>
      <Editor v-if="props.type !== 'detail'" :value="value" :plugins="plugins" :upload-images="handleUploadImage"
        @change="handleChange" :locale="zh" style="text-align: left;" />
      <Viewer v-else :value="value" :plugins="plugins" :locale="zh" class="bytemd-viewer" />
    </div>
    <div class="form-group">
      <label for="description">描述</label>
      <textarea type="text" id="description" v-model="article.description"
        style="width: 800px; height: 150px; font-size: 16px;"></textarea>
    </div>
    <div class="form-group">
      <label for="articleType">文章类型</label>
      <select id="articleType" v-model="article.articleType">
        <option value="Original">原创</option>
        <option value="Reprinted">转载</option>
      </select>
    </div>
    <div class="form-group">
      <label for="category">分类</label>
      <select id="category" v-model.number="article.categoryId">
        <option value="1">编程技术</option>
        <option value="2">开发日志</option>
        <option value="3">随笔</option>
        <option value="4">游记</option>
        <option value="5">诗歌</option>
        <option value="6">摄影</option>
      </select>
    </div>
    <div class="form-group">
      <label for="tags">标签</label>
      <input type="text" id="tags" v-model="article.tags" />
    </div>
    <div class="form-group">
      <label for="image">封面</label>
      <input type="file" id="image" @change="handleUploadCover" />
      <img :src="article.image" style="max-width: 100px; height: auto;">
    </div>
    <div class="form-group">
      <label for="createTime">创建时间</label>
      <input type="date" id="createTime" v-model="article.createTime" />
    </div>
    <div class="form-group">
      <label for="sortOrder">排序</label>
      <input type="number" id="sortOrder" v-model="article.sortOrder" />
    </div>
    <div class="form-group">
      <label for="status">状态</label>
      <select id="status" v-model.number="article.status">
        <option value="0">上线</option>
        <option value="1">下线</option>
      </select>
    </div>
    <div class="div-btn" v-show="props.type !== 'detail'">
      <button type="submit">发布</button>
      <button type="button" @click="onCancel">取消</button>
    </div>
  </form>
</div>
</template>

<script setup lang="ts">
import { reactive, toRefs, defineProps, onMounted, markRaw } from 'vue';
import moment from 'moment'
import { put } from '@vercel/blob';
import 'highlight.js/styles/a11y-light.css'
import 'bytemd/dist/index.css' // 导入bytemd样式
// @ts-ignore
import { Editor, Viewer } from '@bytemd/vue-next' // 导入bytemd编辑器
import gfm from '@bytemd/plugin-gfm' // 语法高亮
import gemoji from '@bytemd/plugin-gemoji' // 表情
import highlight from '@bytemd/plugin-highlight' // 代码高亮
import frontmatter from '@bytemd/plugin-frontmatter' // 解析前题
import mediumZoom from '@bytemd/plugin-medium-zoom' // 缩放图片
import breaks from '@bytemd/plugin-breaks' // 换行
import 'juejin-markdown-themes/dist/juejin.min.css' // 主题
import zhHans from 'bytemd/locales/zh_Hans.json' // 中文语言包
// import AV from 'leancloud-storage' // 引入LeanCloud的SDK
import axios from 'axios';
import { useAppStateStore } from '../../store/appState';
import router from '../../router';

// bytemd配置
const pluginList = [
  gfm(),
  gemoji(),
  highlight(),
  frontmatter(),
  mediumZoom(),
  breaks(),
]
const state = reactive({
  value: '',
  plugins: markRaw(pluginList),
  zh: zhHans
})
const { value, plugins, zh } = toRefs(state)

// LeanCloud初始化
// AV.init({
//   appId: "",
//   appKey: "",
//   serverURL: "https://3sdxes8b.lc-cn-n1-shared.com",
// });
// 后端地址
const host = useAppStateStore().appConfig.apiHost
// 接收传递参数
const props = defineProps<{ type: string, id?: number }>();
// 文章结构
type Article = {
  id: number | null,
  title: string
  articleType: string,
  categoryId: number,
  tags: string,
  createTime: number,
  image: string,
  status: number,
  sortOrder: number,
  content: string,
  description: string
}
const article = reactive<Article>({
  id: props.id || null,
  title: '',
  articleType: '',
  categoryId: 0,
  tags: '',
  image: '',
  createTime: 0,
  status: 0,
  sortOrder: 0,
  content: '',
  description: ''
})

// 监听bytemd编辑器内容变化
const handleChange = (value: string) => {
  state.value = value
  article.content = value
  article.description = article.description.length > 200 ? article.content.replace(/!\[[^\]]*\]\([^)]*\)/g, '').slice(0, 1000) : article.description
}

// bytemd编辑器上传图片
const handleUploadImage = (files: File[]) => {

  if (files.length) {
    const file = files[0]
    return put(file.name, file, { access: 'public', token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN }).then(
      (res) => {
        console.log('文件上传成功:', res);
        return [{
          title: file.name,
          url: res.url
        }]
      },
      (error) => {
        // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
        console.error('文件上传失败:', error);
        return []
      }
    );
  } else {
    return []
  }
}
// 上传封面
const handleUploadCover = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    put(file.name, file, { access: 'public', token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN })
      .then((res) => {
        console.log('文件上传成功:', res);
        article.image = res.url
      }).catch((error) => {
        console.error('文件上传失败:', error);
      })
  }

  // 这里可以处理文件，例如上传到服务器等
  //   console.log('选择的文件:', file);
  //   const uploadFile = new AV.File(file.name, file);
  //   uploadFile.save().then(
  //     (uploadFile) => {
  //       console.log(`文件保存完成, URL：${uploadFile.url()}`);
  //       article.image = uploadFile.url()
  //     },
  //     (error) => {
  //       // 保存失败，可能是文件无法被读取，或者上传过程中出现问题
  //       console.error('文件保存失败:', error);
  //     }
  //   );
  // } else {
  //   console.log('未选择文件');
  // }
}
// 提交
const onSubmit = () => {
  article.createTime = moment(article.createTime).unix()

  const api = props.type === 'create' ? '/add' : '/update/' + props.id
  const method = props.type === 'create' ? 'post' : 'put'

  axios.defaults.withCredentials = true
  axios[method](`${host}/article${api}`, article, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.data)
    router.push({ name: 'article-list' });
  }).catch(error => {
    console.log(error);
  });
};
// 取消
const onCancel = () => {
  console.log('取消操作');
  router.push({ name: 'article-list' });
};

// 初始化
onMounted(() => {
  console.log('props', props)
  if (props.id) {
    axios.defaults.withCredentials = true
    axios.get(host + '/article/detail' + '/' + props.id).then(response => {
      console.log(response.data)
      response.data.createTime = moment.unix(response.data.createTime).format('YYYY-MM-DD')
      value.value = response.data.content
      Object.assign(article, response.data);
    }).catch(error => {
      console.log(error);
    });
  }
})
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

form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

label {
  white-space: nowrap;
  font-weight: bold;
  margin-right: 20px;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

.div-btn {
  display: flex;
  justify-content: space-between;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="button"] {
  background-color: #f1f1f1;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[type="button"]:hover {
  background-color: #e1e1e1;
}

.bytemd-viewer {
  text-align: left;
  border: 1px solid #ccc;
  width: 800px;
  height: 300px;
  overflow: scroll;
}
</style>
