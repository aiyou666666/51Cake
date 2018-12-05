import axios from './axios'
import apis from './api'
const defaultApis={
	
	
	
}
const allApis = Object.assign({}, defaultApis, apis)

if (!process.browser) {
  global.Webapi = allApis
  global.axios = axios
} else {
  window.Webapi = allApis
  window.axios = axios
}
export default axios