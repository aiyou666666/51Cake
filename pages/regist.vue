<template>
  <div class="regist container">
  	<p class="from-item">
  		 <label>用户名:</label>
  		 <input type="text" placeholder="用户名" autocomplete="off" v-model="user.username">
  	</p>
    <p class="from-item">
    	<label>昵称:</label>
      <input type="text" placeholder="昵称" autocomplete="off" v-model="user.nickname">
    </p>
    <p class="from-item">
    	<label>密码:</label>
      <input type="password" placeholder="密码" autocomplete="off" v-model="user.password" @keyup.enter="login">
    </p>
    <p class="from-item">
       <button class="regist-btn" @click="regist">注册</button>
    </p> 
    <top-tip ref="tip"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user:{}
    }
  },
  head() {
    return {
      title: '注册 '
    }
  },
  methods: {
    regist() {
      if(!this.user.username || !this.user.password) {
        return false
      }
      this.$store.dispatch('REGIST', this.user).then(data => {
        if(data.success) {
          this.$router.push('/admin/publish')
        } else {
          this.$refs.tip.openTip('用户名或密码不正确')
        }
      })
    }
  }
}
</script>
 <style lang="scss">
 @import '~/assets/css/var.scss';
	.regist{
		.from-item{
			margin-top:10px;
			text-align: center;
			label{
				width:100px;
				text-align: right;
				margin-right:10px;
				display: inline-block;	
			}
			input{
				border:1px solid #dedede;
			}
			.regist-btn{
				width:200px;
				height:32px;
				line-height:32px;
				padding:0;
				text-align: center;
				margin-left: 100px;
        margin-top: 25px;
			}
		}	
	}
</style>

