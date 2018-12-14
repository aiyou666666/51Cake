<template>
  <div class="blog">
    <my-header></my-header>
    <section class="blog-body">
      <nuxt/>
    </section>
   <my-footer></my-footer>
  </div>
</template>
<script>
import MyHeader from '~/components/Header.vue'
import MyFooter from '~/components/Footer.vue'
	
export default {
  data() {
    return {
      keyword: '',
      navStyle: {},
      navs: [{
          path: '/',
          routerName: 'index',
          name: '首页'
        },
        {
          path: '/tags',
          routerName: 'tags-id',
          name: '标签'
        },
        {
          path: '/archives',
          routerName: 'archives',
          name: '归档'
        }
      ],

      adminNavs: [
        {
          path: '/admin/private',
          routerName: 'admin-private',
          name: '草稿'
        },
        {
          path: '/admin/comment',
          routerName: 'admin-comment',
          name: '评论'
        },
        {
          path: '/admin/tags',
          routerName: 'admin-tags',
          name: '标签'
        },
        {
          path: '/admin/update',
          routerName: 'admin-update',
          name: '设置'
        }
      ]
    }
  },
  components:{
  	MyHeader,
  	MyFooter
  },
  methods: {
    search() {
      let keyword = encodeURIComponent(this.keyword)
      if (!keyword) { return false }
      this.$router.push({
        name: 'search-id',
        params: {
          id: keyword
        }
      })
    },
    logout() {
      this.$store.dispatch('LOGOUT').then(data => {
        if (data.success) {
          this.$store.state.token = ''
          this.$router.push('/')
        }
      })
    },
    backTop() {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },
    showMenu() {
      if(this.$refs.headerNav.style.transform) {
        this.$refs.headerNav.style.transform = ''
      } else {
        this.$refs.headerNav.style.transform = 'translateX(0)'
      }
    }
  }
}

</script>
<style lang="scss">
@import '~/assets/css/var.scss';
.blog-body{
	padding-top: 60px;
}
</style>
