import type { FastifyInstance } from 'fastify'

import { dbGetCategories, dbGetSubcategories } from '../services/category-database.js'

export async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get('/categories', async (request, reply) => {
    try {
      const categories = dbGetCategories()

      reply.code(200).send({ categories: categories })
    } catch (error) {
      console.log(error)
      reply.code(500).send({
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while retrieving categories',
        },
      })
    }
  })

  fastify.get('/subcategories', async (request, reply) => {
    try {
      const subcategories = dbGetSubcategories()

      reply.code(200).send({ subcategories: subcategories })
    } catch (error) {
      console.log(error)
      reply.code(500).send({
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while retrieving subcategories',
        },
      })
    }
  })
}
