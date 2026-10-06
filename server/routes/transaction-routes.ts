import type { FastifyInstance } from 'fastify'

import { isValidTransaction, type NewTransactionInput } from '../../shared/types/Transaction.ts'

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
  fastify.post<{ Body: NewTransactionInput }>(
    '/transactions',
    {
      schema: {
        body: {
          type: 'object',
          required: ['date', 'categoryId', 'description', 'amount', 'accountId', 'hasInvoice'],
          properties: {
            date: { type: 'string' },
            categoryId: { type: 'integer' },
            description: { type: 'string' },
            amount: { type: 'number' },
            accountId: { type: 'integer' },
            hasInvoice: { type: 'boolean' },
          },
        },
      },
    },
    async (request, reply) => {
      const input: NewTransactionInput = request.body // as NewTransactionInput

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

  type TransactionParams = {
    id: string
  }

  fastify.delete<{ Params: TransactionParams }>(
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
        if (err instanceof Error) {
          reply.code(404).send({
            error: {
              code: 'ID_NOT_FOUND',
              message: "Transaction not found. Couldn't delete",
              details: err.message,
              field: '',
            },
          })
        } else {
          reply.code(500).send({
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Unexpected error',
            },
          })
        }
      }
    },
  )
}
