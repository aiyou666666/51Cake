<template>
	<div class="registWrap container">
		<el-form :model="userModel" ref="registFrom" label-width="80px" :rules="rules">
			<el-form-item label="类型" >
				<el-select v-model="userModel.role" placeholder="请选择" style="width:100%">
					<el-option v-for="item in userType" :key="item.typeId" :label="item.name" :value="item.typeId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="邮箱" prop="email" >
				<el-input  type="email"   v-model="userModel.email"  placeholder="请输入邮箱"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="username" >
				<el-input  v-model="userModel.username" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input type="password"  v-model="userModel.password"  placeholder="请输入密码"></el-input>
			</el-form-item>	
			<el-form-item>
				<el-button type="primary"  @click="registSubmit">立即创建</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
		<top-tip ref="tip" />
		
	</div>
</template>
<script>
	export default {
		data() {
			return {
				userModel: {
					role:0,
					email:'',
					username:'',
					password:''
				},
				userType: [{
						typeId: 0,
						name: '用户'
					},
					{
						typeId: 1,
						name: '商家'
					}
				],
				rules: {
					email: {
						required: true,
						type: 'email',
						message: '请填写有效的电子邮箱'
					},
					username: {
						required: true,
						pattern: /\S{1,}/,
						message: '请输入姓名'
					},
					password: {
						required: true,
						pattern: /^\S{1,20}$/, 
						message: '请填写密码',
						max: 20
					}
				}
			}
		},
		head() {
			return {
				title: '注册 '
			}
		},
		methods: {
			registSubmit() {
				this.$refs['registFrom'].validate((valid) => {
                     if(valid){
                     	 this.$store.dispatch('REGIST', this.userModel).then(data => {
							if(data.success) {
								this.$router.push('/admin/publish')
							} else {
								this.$refs.tip.openTip('创建用户失败')
							}
				        })
                     }
				})
				
			}
		}
	}
</script>
<style lang="scss">
	@import '~/assets/css/var.scss';
	.registWrap {
		.from-item {
			margin-top: 10px;
			text-align: center;
			label {
				width: 100px;
				text-align: right;
				margin-right: 10px;
				display: inline-block;
			}
			input {
				border: 1px solid #dedede;
			}
			.regist-btn {
				width: 200px;
				height: 32px;
				line-height: 32px;
				padding: 0;
				text-align: center;
				margin-left: 100px;
				margin-top: 25px;
			}
		}
		.el-form-item__content{
			text-align: center;
		}
		
	}
</style>