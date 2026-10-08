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

const isBeingModified = ref<Set<TransactionId>>(new Set())

// Set won't trigger unless reassigned
function startModifying(id: TransactionId) {
  isBeingModified.value = new Set(isBeingModified.value).add(id)
}

function stopModifying(id: TransactionId) {
  const temp = new Set(isBeingModified.value)
  temp.delete(id)
  isBeingModified.value = temp
}

function handleCreateTransaction(transaction: TransactionFormData) {
  emit('create', transaction)
}

function handleDeleteTransaction(id: TransactionId) {
  stopModifying(id)
  emit('delete', id)
}

function handleUpdateTransaction(id: TransactionId, eventData: TransactionFormData) {
  emit('update', id, eventData)
  stopModifying(id)
}

function onCreationError(eventData: string) {
  emit('error', `Error creating transaction: ${eventData}`)
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
          @submit="handleUpdateTransaction(transaction.id, $event)"
          @delete="handleDeleteTransaction"
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
            <button @click="startModifying(transaction.id)">[edit]</button>
          </td>
        </tr>
      </template>
      <TransactionForm
        form-id="transaction-form-create"
        :editMode="{ active: false }"
        :categories="categories"
        :subcategories="subcategories"
        :accounts="accounts"
        @submit="handleCreateTransaction"
        @delete="handleDeleteTransaction"
        @error="onCreationError"
      />
    </tbody>
  </table>
</template>
