import Fastify from 'fastify'
import cors from '@fastify/cors'

import { DatabaseSync } from 'node:sqlite'

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const database = new DatabaseSync('./data/ledger.db')

const PORT = 3000

const fastify = Fastify()

await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
})

fastify.get('/', async (request, reply) => {
  reply.send({ message: '/ Welcome!' })
})

fastify.get('/transaction', async (request, reply) => {
  try {
    const sqlQuery = database.prepare('SELECT * FROM transactions ORDER BY id')

    await sleep(3000)

    reply.send({ transactions: sqlQuery.all() })
    // sqlQuery.close()
  } catch (error) {
    reply.code(500).send({
      info: 'An error occurred while retrieving transactions.',
    })
  }
})

fastify.post('/transaction', async (request, reply) => {
  const transactionJSON = request.body

  if (transactionJSON.date && transactionJSON.description && transactionJSON.amount !== 0) {
    const sqlInsert = database.prepare(
      'INSERT INTO transactions (date, description, amount) VALUES (?, ?, ?)',
    )

    const { changes, lastInsertRowid } = sqlInsert.run(
      transactionJSON.date,
      transactionJSON.description,
      transactionJSON.amount,
    )
    // sqlInsert.close()

    if (changes === 1) {
      reply.send({ ...transactionJSON, id: lastInsertRowid })
    } else {
      reply.code(500).send({ info: 'An error occurred while creating the transaction.' })
    }
  } else {
    reply.code(400).send({ info: 'Required transaction fields are missing' })
  }
})

fastify.delete('/transaction/:id', async (request, reply) => {
  const id = parseInt(request.params.id)

  const sqlDelete = database.prepare('DELETE FROM transactions WHERE id = (?)')
  const { changes } = sqlDelete.run(id)
  // sqlDelete.close()

  if (changes === 1) {
    reply.send({ deleted: true })
  } else {
    reply.code(404).send({ info: `Transaction with ID ${id} was not found.` })
  }
})

try {
  const address = await fastify.listen({ port: PORT })
  console.info(`server listening on ${address}`)
} catch (err) {
  console.error(err)
  process.exit(1)
}
