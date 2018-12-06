           import Koa from 'koa'
import axios from 'axios'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import cors from '@koa/cors'
import globalConfig from './config'
import route from './routes'

const app = new Koa()
const router = new Router()

/*router.get('/rss.xml', (ctx, next) => {
})
*/
app.use(cors())
app.use(bodyParser())
app.use(KoaStatic('.'))
router.use('', route.routes())
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, host)
console.log('Server listening on ' + host + port) // eslint-disable-line no-console
