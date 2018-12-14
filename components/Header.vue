<template>
	<div class="header-wraper">
		<header class="blog-header">
			<h1 class="header-title"><a href="/" v-if="!!$store.state.user">{{ $store.state.user.nickname }}</a></h1>
			<nav class="header-nav" ref="headerNav">
				<div class="nav-avatar" v-if="!!$store.state.user">
					<img :src="$store.state.user.avatar" alt="">
					<h4>{{ $store.state.user.motto }}</h4>
				</div>
				<div class="nav-search">
					<i class="vueblog icon-search"></i>
					<input type="text" v-model="keyword" @keyup.enter="search" maxlength="30">
				</div>
				<!-- 商家 -->
				<ul class="nav-list" v-if="/^(admin)/.test($route.name)">
					<li v-for="(nav, index) in adminNavs" :key="index" :class="{'nav-active': nav.routerName === $route.name}">
						<nuxt-link :to="nav.path">{{ nav.name }}</nuxt-link>
					</li>
					<li>
						<a @click="logout">退出</a>
					</li>
				</ul>
				<!-- front navs -->
				<ul class="nav-list" v-else>
					<li v-for="(nav, index) in navs" :key="index" :class="{'nav-active': nav.routerName === $route.name}">
						<nuxt-link :to="nav.path">{{ nav.name }}</nuxt-link>
					</li>
				</ul>
			</nav>
			<div class="header-menu" @click="showMenu">
				<i class="vueblog icon-menu"></i>
			</div>
		</header>
	</div>
</template>

<script>
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

				adminNavs: [{
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
		components: {},
		methods: {
			search() {
				let keyword = encodeURIComponent(this.keyword)
				if(!keyword) {
					return false
				}
				this.$router.push({
					name: 'search-id',
					params: {
						id: keyword
					}
				})
			},
			logout() {
				this.$store.dispatch('LOGOUT').then(data => {
					if(data.success) {
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
	.header-wraper {
		position: fixed;
		top: 0;
		display: flex;
		width: 100%;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #eee;
		z-index: 9;
		background-color: #fff;
	}
	
	.blog-header {
		display: flex;
		width: 960px;
		margin: 0 auto;
		justify-content: space-between;
		padding: 0 15px;
		.header-title {
			font-size: 20px;
			font-weight: 600;
			a:link,
			a:visited,
			a:hover,
			a:active {
				color: $font-color;
			}
		}
		.nav-search {
			display: inline-block;
			position: relative;
			.icon-search {
				position: absolute;
				left: 10px;
				font-size: 20px;
				color: #ddd;
			}
			input[type="text"] {
				height: 35px;
				width: 200px;
				line-height: 35px;
				text-indent: 2em;
				border-radius: 35px;
				&:focus {
					outline: none;
					border-color: $link-color;
				}
			}
		}
		.header-nav {
			.nav-avatar {
				display: none;
			}
			ul {
				display: inline-block;
				list-style: none;
			}
			li {
				display: inline-block;
				a {
					color: $font-color;
					padding: 0 15px;
					&:hover {
						color: $link-color;
					}
				}
				&.nav-active a {
					color: $link-color;
				}
			}
		}
		.header-menu {
			display: none;
			height: 50px;
			line-height: 50px;
			.icon-menu {
				font-size: 20px;
				font-weight: lighter;
			}
		}
	}
</style>