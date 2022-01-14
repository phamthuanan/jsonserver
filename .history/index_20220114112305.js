const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = new Date()
    req.body.updatedAt = new Date()
  }
  if (req.method === 'PUT' || req.method === 'PATCH' ) {
    req.body.updatedAt = new Date()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use('/api',router)
server.listen(5000, () => {
  console.log('JSON Server is running')
})