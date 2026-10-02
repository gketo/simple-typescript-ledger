import type { FastifyInstance } from 'fastify'

import { isValidTransaction, type NewTransactionInput } from '../../src/types/Transaction.ts'

import {
  dbGetTransactions,
  dbCreateTransaction,
  dbDeleteTransaction,
} from '../services/transaction-database.ts'

export async function transactionRoutes(fastify: FastifyInstance) {
  fastify.get('/transactions', async (request, reply) => {
    try {
      const transactions = dbGetTransactions()

      reply.code(200).send({ transactions: transactions })
    } catch (error) {
      console.log(error)
      reply.code(500).send({
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while retrieving transactions',
        },
      })
    }
  })

  // todo impodency key with periodic cleaninc in separate table
  fastify.post(
    '/transactions',
    {
      schema: {
        body: {
          type: 'object',
          required: ['date', 'categoryId', 'description', 'amount', 'account', 'hasInvoice'],
          properties: {
            date: { type: 'string' },
            categoryId: { type: 'number' },
            description: { type: 'string' },
            amount: { type: 'number' },
            account: { type: 'number' },
            hasInvoice: { type: 'boolean' },
          },
        },
      },
    },
    async (request, reply) => {
      const input: NewTransactionInput = request.body

      if (isValidTransaction(input)) {
        try {
          const id = dbCreateTransaction(input)

          reply.code(201).send({ ...input, id: id })
        } catch (err) {
          reply.code(500).send({
            error: {
              code: 'SERVER_ERROR',
              message: 'An error occurred while creating the transaction.',
            },
          })
        }
      } else {
        reply.code(400).send({
          error: {
            code: 'EMPTY_FIELD',
            message: 'Required transaction fields are missing',
            details: [
              {
                field: 'asterix',
                message: 'Asterix (*) fields are required',
              },
            ],
          },
        })
      }
    },
  )

  fastify.delete(
    '/transactions/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
      },
    },
    async (request, reply) => {
      const id = parseInt(request.params.id)

      try {
        dbDeleteTransaction(id)

        reply.code(200).send({ id })
      } catch (err) {
        reply.code(404).send({
          error: {
            code: 'ID_NOT_FOUND',
            message: "Transaction not found. Couldn't delete",
            details: `Transaction with id ${err.id} does not exist`,
            field: '',
          },
        })
      }
    },
  )
}
