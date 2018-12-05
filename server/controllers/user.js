import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import axios from 'axios'
import url from 'url'
import config from '../config'

const User = mongoose.model('User')

const domain = config.app.domain ? config.app.domain : `http://${config.app.host}:${config.app.port}`

export const login = async(ctx, next) => {
	let {
		username,
		password
	} = ctx.request.body
	password = md5(password)
	try {
		let user = await User.findOne({
			username: username,
			password: password
		}).exec()
		let secret = config.jwt.secret
		let expiresIn = config.jwt.expiresIn
		let token = jwt.sign({
			username: user.username,
			userID: user._id
		}, secret)
		ctx.cookies.set('token', token)
		ctx.body = {
			success: true,
			data: {
				token: token
			}
		}
	} catch(e) {
		ctx.body = {
			success: false,
			err: e
		}
	}
}
export const regist = async(ctx, next) => {
	let body = ctx.request.body
	body.password = md5(body.password)
	try {
		body = await new User(body)
		await body.save()
		ctx.body = {
			code: 0,
			success: true,
			data: body
		}

	} catch(e) {
		ctx.body = {
			code: -1,
			success: false,
			err: e
		}
	}

}

export const logout = (ctx, next) => {
	ctx.cookies.set('token', null)
	ctx.body = {
		success: true,
		data: {}
	}
}

export const getUserInfo = async(ctx, next) => {
	let {
		username
	} = ctx.params
	console.log("獲取用戶")
	console.log(ctx.query.token)
	let avatarUrl = domain + '/public/' + config.user.avatar
	if(!username) {
		// 获取管理员信息
		try {
			let data = await User.findOne({
				role: 'superAdmin'
			}).exec()
			data.avatar = avatarUrl
			ctx.body = {
				success: true,
				data: data
			}
		} catch(e) {
			ctx.body = {
				success: false,
				err: e
			}
		}
	} else {
		// 获取普通用户信息
		try {
			let data = await User.findOne({
				username: username
			}).exec()
			ctx.body = {
				success: true,
				data: data
			}
		} catch(e) {
			ctx.body = {
				success: false,
				err: e
			}
		}
	}
}
export const getUserByToken = async(ctx, next) => {
	try {
		const token = ctx.query.token
		const decoded = jwt.verify(token, config.jwt.secret)
		const username = decoded.username
		const userID = decoded.userID
		let user = await User.findOne({
			_id: userID,
			username: username
		}).exec()
		
		if(user._id && user.username) {
			return(ctx.body = {
				code:0,
				success: true,
				data: user
			})
		} else {
			return(ctx.body = {
				success: false,
				err: '用户不存在'
			})
		}
	} catch(e) {
		return(ctx.body = {
			success: false,
			err: "500"
		})
	}

}

export const patchUserInfo = async(ctx, next) => {
	let body = ctx.request.body
	if(body.oldPassword && body.newPassword) {
		// 更新管理员密码
		let oldPassword = md5(body.oldPassword)
		let newPassword = md5(body.newPassword)
		try {
			let user = await User.findOne({
				role: 'superAdmin'
			}).exec()
			if(user.password !== oldPassword) {
				return(ctx.body = {
					success: false,
					err: 'Wrong password'
				})
			}
			body = await User.findOneAndUpdate({
				role: 'superAdmin'
			}, {
				password: newPassword,
				updatedAt: Date.now()
			}).exec()
			ctx.body = {
				success: true,
				data: body
			}
		} catch(e) {
			ctx.body = {
				success: false,
				err: e
			}
		}
	} else {
		// 更新管理员信息
		body.updatedAt = Date.now()
		try {
			body = await User.findOneAndUpdate({
				role: 'superAdmin'
			}, body).exec()
			ctx.body = {
				success: true,
				data: body
			}
		} catch(e) {
			ctx.body = {
				success: false,
				err: e
			}
		}
	}
}

// state表示github授权后的回调信息
let state = ''
export const githubLogin = (ctx, next) => {
	state = ctx.params.state || ''
	let u = `https://github.com/login/oauth/authorize?client_id=${config.githubConfig.githubClient}&scope=${config.githubConfig.scope}&redirect_uri=${domain}/api/oauth/github/callback&state=${state}`
	ctx.res.statusCode = 302
	ctx.res.setHeader('location', u)
	ctx.res.end()
}

// 授权成功后的回调函数
export const githubCallback = async(ctx, next) => {
	let query = url.parse(ctx.req.url, true).query
	let code = query.code
	let u = `https://github.com/login/oauth/access_token?client_id=${config.githubConfig.githubClient}&client_secret=${config.githubConfig.githubSecret}&code=${code}&state=${state}`
	let githubToken = ''

	// 把获取到的token设置到cookie里
	await axios.get(u).then((ret) => {
		const {
			data
		} = ret
		var arr = data.split('&'),
			obj = {}
		arr.forEach(function(item) {
			var key = item.split('=')[0]
			var value = item.split('=')[1]
			obj[key] = value
		})
		if(obj.access_token) {
			githubToken = obj.access_token
			ctx.cookies.set('githubToken', obj.access_token)
		} else {
			ctx.cookies.set('githubToken', '')
		}
	})
	if(githubToken) {
		let userInfo = {}
		// 把用户信息保存到数据库
		await axios.get(`https://api.github.com/user?access_token=${githubToken}`).then(ret => {
			const {
				data
			} = ret
			userInfo.role = 'user'
			userInfo.username = data.login
			userInfo.email = data.email
			userInfo.nickname = data.name
			userInfo.motto = data.bio
			userInfo.avatar = data.avatar_url
		})

		var user = await User.findOne({
			username: userInfo.username
		}).exec()
		if(!user) {
			user = new User(userInfo)
			await user.save()
		}
	}
	// 完成授权后页面重定向
	return ctx.response.redirect(`${domain}/detail/${state}`)
}