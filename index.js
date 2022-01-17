const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const queryString = require('query-string');

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
router.render = (req, res) => {
  const headers = res.getHeaders();

  // In case of header x-total-count is available
  // It means client request a list of resourses with pagination
  // Then we should include pagination in response
  // Right now, json-server just simply return a list of data without pagination data
  const totalCountHeader = headers['x-total-count'];
  if (req.method === 'GET' && totalCountHeader) {
    // Retrieve request pagination
    const queryParams = queryString.parse(req._parsedUrl.query);

    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCountHeader),
      },
    };

    return res.jsonp(result);
  }

  res.jsonp(res.locals.data);
};
const PORT = process.env.PORT || 5000
// Use default router
server.use('/api',router)
server.listen(PORT, () => {
  console.log('JSON Server is running')
})