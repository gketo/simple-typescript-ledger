<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

import type { Transaction, TransactionJSON, CreateTransactionInput } from '@/types/Transaction.ts'

import TransactionList from './components/TransactionList.vue'
import TransactionForm from './components/TransactionForm.vue'

import {
  createTransaction,
  fetchTransactions,
  removeTransaction,
} from './services/transactionServices.ts'

const alertMsg = ref<string>('')

const transactions = ref<Transaction[]>([])

const isLoading = ref(false)

onMounted(() => {
  loadTransactions()
})

const solde = computed(() => {
  return transactions.value.reduce((acc, trans) => {
    return acc + trans.amount
  }, 0)
})

async function addTransaction(tFormData: CreateTransactionInput) {
  try {
    const added: Transaction = await createTransaction(tFormData)
    transactions.value.push(added)
  } catch (err) {
    console.error('Error adding transaction:', err)
    if (err === 400) {
      alertMsg.value = 'Required transaction fields are missing.'
    } else {
      alertMsg.value = 'Unable to save transactions. Please try again later.'
    }
  }
}

type TransactionId = Transaction['id']

async function deleteTransaction(id: TransactionId) {
  try {
    const deleted = await removeTransaction(id)

    for (let i = 0; i < transactions.value.length; i++) {
      const transaction = transactions.value[i]
      if (transaction && transaction.id === deleted) {
        transactions.value.splice(i, 1)
        return
      }
    }
  } catch (err) {
    console.error('Error deleting transaction:', err)
    alertMsg.value = 'Unable to delete transactions. Please try again later.'
  }
}

async function loadTransactions() {
  try {
    isLoading.value = true
    transactions.value = await fetchTransactions()
  } catch (err) {
    // await sleep(1000)
    console.error('Error retrieving transactions:', err)
    alertMsg.value = 'Unable to retrieve transactions. Please try again later.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <h1>Mon Ledger</h1>
  <div>Solde : {{ solde }} €</div>
  <h2>Transactions</h2>
  <div v-show="isLoading">Chargement en cours...</div>
  <TransactionList
    v-show="!isLoading"
    :transactions="transactions"
    @deleteTransaction="deleteTransaction"
  />
  <TransactionForm
    v-show="!isLoading"
    @submit="addTransaction"
    @validationError="alertMsg = $event"
  />
  <div v-show="alertMsg.length"><button @click="alertMsg = ''">&times;</button>{{ alertMsg }}</div>
</template>

<style scoped></style>
