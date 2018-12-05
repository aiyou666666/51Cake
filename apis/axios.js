import axios from 'axios'
/*拦截器*/
let options = {
  timeout: 9000,
  // 发送请求时带上cookie
  withCredentials: true,
  headers: {
    post: {
      // 'Content-Type': 'application/json'
    }
  }
}
const _axios = axios.create(options)
_axios.interceptors.request.use((req) => {
  // 给所有get请求加时间戳
  if (req.method === 'get') {
  }
  return req
})
_axios.interceptors.response.use((res) => {
	
if (res.success) {
        return res.data
} else {
    return res
}
 
}, (err) => {
  return Promise.reject(err)
})

export default _axios