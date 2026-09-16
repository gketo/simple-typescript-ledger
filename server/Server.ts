import Fastify from 'fastify'

const PORT = 3001

const fastify = Fastify({
  logger: true,
})

fastify.get('/', function (request, reply) {
  reply.send({ message: 'welcome2' })
})

fastify.get('/transactions', function (request, reply) {
  const body = [{ id: -1, date: new Date(), description: 'test json', amount: 0 }]
  reply.send(body)
})

fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
