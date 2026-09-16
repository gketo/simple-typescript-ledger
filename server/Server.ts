import http from 'http'

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    switch (req.url) {
      case '/':
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'welcome' }))
        break
      case '/transactions':
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        const body = [{ id: -1, date: new Date(), description: 'test json', amount: 0 }]
        res.end(JSON.stringify(body))
        break
      default:
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Error 404: not found' }))
        break
    }
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
