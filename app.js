const https = require('https')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { config } = require('./config')
const { connectMysql, connectDatabase } = require('./db')

const router = new Router()
const app = new Koa()
const port = 3000
const mysql = require('mysql2')

// app.use(async (ctx, next) => {
//   await next()
//   const rt = ctx.response.get('X-Response-Time')
//   console.log(`${ctx.method} ${ctx.url} - ${rt}`)
// })

// app.use(async (ctx, next) => {
//   const start = Date.now()
//   await next()
//   const ms = Date.now() - start
//   ctx.set('X-Response-Time', `${ms}ms`)
// })

// app.use(async (ctx) => {
//   ctx.body = 'Hello World'
// })

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

// https.createServer(app.callback()).listen(3000)

// connectMysql('users')

async function addUsers() {
  const connection = mysql.createConnection(config)
  await connection.connect
}

router.get('/user', async (ctx) => {
  const { name, email } = ctx.request.query

  if (!name || !email) {
    ctx.status = 400
    ctx.body = { error: 'Name and Email are required' }
    return
  }

  try {
    const connection = mysql.createConnection(config)
    await connection.connect
    const promisePool = connectDatabase('users')
    const [result] = await promisePool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      ['xiaoming', 'xiaoming@example.com']
    )
    ctx.status = 201
    ctx.body = { id: result.insertId, name, email }
  } catch (error) {
    console.error('Error inserting data:', error)
    ctx.status = 500
    ctx.body = { error: 'Failed to insert data' }
  }
})

router.get('/users', async (ctx, next) => {
  const promisePool = connectDatabase('mysql')
  const [rows] = await promisePool.query('show databases;')
  // ctx.body = 'Hello World'
  ctx.body = rows
  console.log('rows', rows)
})

app.use(router.routes()).use(router.allowedMethods()).use(bodyParser())
app.listen(port, () => console.log('Server is running on port 3000'))
