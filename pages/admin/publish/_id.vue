<template>
  <div class="admin-publish">
    <input type="text" placeholder="文章标题" v-model="article.title" class="publish-title">
    <div class="publish-content">
      <top-editor v-model="article.content" :upload="upload" :options="options" @save="save" />
    </div>
    <div class="publish-handle">
      <input type="text" placeholder="回车可创建新标签" v-model="tag" @keyup.enter="addTag">
      <ul class="handle-tag">
        <li v-for="(item, index) in article.tags" :key="index"> {{ item.name }} <span @click="delTag(item, index)">&times;</span></li>
      </ul>
      <div class="handle-button">
        <button class="button-private" @click="publish(false)">存草稿</button>
        <button class="button-publish" @click="publish(true)">发布</button>
      </div>
    </div>
    <div class="publish-tags">
      <p class="tags-intro">插入标签：</p>
      <div class="tags-all">
        <a v-for="(tag,index) in tags" :key="index" @click="chooseTag(tag)">{{ tag.name }}</a>
      </div>
    </div>
    <top-tip ref="tip" />
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      upload: {
        url: this.$store.getters.baseUrl + '/upload',
        headers: {
          token: this.$store.state.token
        }
      },
      options: {},
      article: {
        title: '',
        content: '',
        tags: []
      },
      tags: [],
      tag: ''
    }
  },

  head() {
    return {
      title: '发布文章 '
    }
  },
  mounted() {
    if (process.browser) {
      this.options = {
        linkify: true,
        highlight(str, lang = 'javascript') {
          if (require('highlight.js').getLanguage(lang)) {
            try {
              return require('highlight.js').highlight(lang, str).value
            } catch (__) {}
          }
          return ''
        }
      }
    }
    
    this.$store.dispatch('TAGS').then((data) => {
      this.tags = data.data
    })
    if (this.$route.params.id) {
      let id = this.$route.params.id
      this.$store.dispatch('ARTICLE_DETAIL', id).then((data) => {
        this.article = data.data
      })
    }
  },
  methods: {
    chooseTag(tag) {
      if (this.article.tags.findIndex(item => item.name === tag.name) > -1) {
        this.$refs.tip.openTip('标签已存在！')
        return
      }
      this.article.tags.push(tag)
    },
    delTag(tag, index) {
      this.article.tags.splice(index, 1)
    },
    addTag() {
      if (this.tags.findIndex(item => item.name === this.tag) > -1) {
        // add tag
        this.tags.forEach((item) => {
          if (item.name === this.tag) {
            this.article.tags.push(item)
            this.tag = ''
          }
        })
      } else {
        // create tag
        this.$store.dispatch('CREATE_TAG', { name: this.tag }).then((data) => {
          if (data.success) {
            this.article.tags.push(data.data)
            this.$refs.tip.openTip('标签创建完成')
            this.tag = ''
          }
        })
      }
    },
    publish(isPublish) {
      let tagsID = []
      let article = {}
      if (!this.article.title || !this.article.content) {
        this.$refs.tip.openTip('标题和内容不能为空！')
        return false
      }
      this.article.tags.forEach((item) => {
        tagsID.push(item.id)
      })
      // update article
      if (this.article.id) {
        article = {
          id: this.article.id,
          title: this.article.title,
          content: this.article.content,
          tags: tagsID,
          publish: isPublish,
        }
        this.$store.dispatch('UPDATE_ARTICLE', article).then((data) => {
          if (data.success) {
            this.$refs.tip.openTip('文章更新完成')
          }
        })
      } else {
        article = {
          title: this.article.title,
          content: this.article.content,
          tags: tagsID,
          publish: isPublish,
          creatId:this.$store.state.user._id
        }
        this.$store.dispatch('CREATE_ARTICLE', article).then((data) => {
          if (data.success) {
            this.$refs.tip.openTip('文章创建完成')
            this.article.title = ''
            this.article.content = ''
            this.article.tags = []
          }
        })
      }
    },
    save(val) {
      if (val === true) {
        // ctrl + s save article
        this.publish(false)
      }
    }
  }
}

</script>
