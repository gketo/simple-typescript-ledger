import type { FastifyInstance } from 'fastify'

import type { TransactionId, TransactionJSON } from '@shared/types/Transaction.js'

import {
  dbGetTransactions,
  dbCreateTransaction,
  dbDeleteTransaction,
  dbUpdateTransaction,
} from '../services/transaction-database.js'

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
  fastify.post<{ Body: TransactionJSON }>(
    '/transactions',
    {
      schema: {
        body: {
          type: 'object',
          required: ['date', 'category', 'description', 'amount', 'account', 'hasInvoice'],
          properties: {
            date: { type: 'string' },
            category: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
            description: { type: 'string' },
            amount: { type: 'number' },
            account: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
            hasInvoice: { type: 'boolean' },
          },
        },
      },
    },
    async (request, reply) => {
      const transaction: TransactionJSON = request.body

      if (
        transaction.date.length > 0 &&
        transaction.category !== undefined &&
        transaction.description.length > 0 &&
        transaction.amount !== 0 &&
        transaction.account !== undefined
      ) {
        try {
          const id = dbCreateTransaction(transaction)

          reply.code(201).send({ ...transaction, id: id })
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
      try {
        const id: TransactionId = parseInt(request.params.id)
        dbDeleteTransaction(id)
        reply.code(200)
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

  // todo impodency key with periodic cleaninc in separate table
  fastify.put<{ Params: TransactionParams; Body: TransactionJSON }>(
    '/transactions/:id',
    {
      schema: {
        body: {
          type: 'object',
          required: ['id', 'date', 'category', 'description', 'amount', 'account', 'hasInvoice'],
          properties: {
            date: { type: 'string' },
            category: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
            description: { type: 'string' },
            amount: { type: 'number' },
            account: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
            hasInvoice: { type: 'boolean' },
          },
        },
      },
    },
    async (request, reply) => {
      const transaction: TransactionJSON = request.body

      const id: TransactionId = parseInt(request.params.id)

      if (id !== transaction.id) {
        reply.code(400).send({
          error: {
            code: 'CORRUPTED',
            message: `Expected transaction ${id}, got ${transaction.id}`,
          },
        })
      } else if (
        transaction.date.length > 0 &&
        transaction.category !== undefined &&
        transaction.description.length > 0 &&
        transaction.amount !== 0 &&
        transaction.account !== undefined
      ) {
        try {
          const modified = dbUpdateTransaction(transaction)
          reply.code(200).send(modified)
        } catch (err) {
          reply.code(500).send({
            error: {
              code: 'SERVER_ERROR',
              message: 'An error occurred while updating the transaction.',
            },
          })
        }
      } else {
        console.log(transaction)
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
}
