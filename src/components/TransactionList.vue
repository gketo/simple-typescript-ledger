<script setup lang="ts">
import { ref } from 'vue'

import TransactionForm from './TransactionForm.vue'

import type { Transaction, TransactionId } from '@shared/types//Transaction'
import type { Category, Subcategory } from '@shared/types/Category.ts'
import type { Account } from '@shared/types/Account.ts'

import type { TransactionFormData } from '../types/TransactionFormData.ts'

const props = defineProps<{
  transactions: Transaction[]
  categories: Category[]
  subcategories: Subcategory[]
  accounts: Account[]
}>()

const emit = defineEmits<{
  create: [data: TransactionFormData]
  delete: [id: TransactionId]
  update: [id: TransactionId, data: TransactionFormData]
  error: [message: string]
}>()

function createTransaction(transaction: TransactionFormData) {
  emit('create', transaction)
}

function onCreationError(eventData: string) {
  emit('error', `Error creating transaction: ${eventData}`)
}

function deleteTransaction(id: TransactionId) {
  emit('delete', id)
}

const isBeingModified = ref<Set<number>>(new Set())

function updateTransaction(id: TransactionId, eventData: TransactionFormData) {
  emit('update', id, eventData)
  isBeingModified.value.delete(id)
}

function onUpdatingError(id: TransactionId, eventData: string) {
  emit('error', `Error updating transaction with id ${id}: ${eventData}`)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Catégorie</th>
        <th>Sous-catégorie</th>
        <th>Description</th>
        <th>Prestataire</th>
        <th>Montant</th>
        <th>Compte</th>
        <th>Facture?</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="transaction in props.transactions" :key="transaction.id">
        <TransactionForm
          v-if="isBeingModified.has(transaction.id)"
          :form-id="`transaction-form-${transaction.id}`"
          :editMode="{ active: true, transaction: transaction }"
          :categories="categories"
          :subcategories="subcategories"
          :accounts="accounts"
          @submit="updateTransaction(transaction.id, $event)"
          @error="onUpdatingError(transaction.id, $event)"
        />
        <tr v-else>
          <td>{{ transaction.date.getDate() }}/{{ transaction.date.getMonth() + 1 }}</td>
          <td>{{ transaction.category.name }}</td>
          <td>{{ transaction.subcategory?.name }}</td>
          <td>{{ transaction.description }}</td>
          <td>{{ transaction.payee }}</td>
          <td>{{ (transaction.amountInCents / 100).toFixed(2) }}</td>
          <td>{{ transaction.account.name }}</td>
          <td>{{ transaction.hasInvoice }}</td>
          <td>
            <button @click="isBeingModified.add(transaction.id)">[edit]</button>
          </td>
          <td>
            <button
              v-show="isBeingModified.has(transaction.id)"
              @click="deleteTransaction(transaction.id)"
            >
              [delete]
            </button>
          </td>
        </tr>
      </template>
      <TransactionForm
        form-id="transaction-form-create"
        :editMode="{ active: false }"
        :categories="categories"
        :subcategories="subcategories"
        :accounts="accounts"
        @submit="createTransaction"
        @error="onCreationError"
      />
    </tbody>
  </table>
</template>
