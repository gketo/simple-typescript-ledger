<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

import type { Transaction } from '@/types/Transaction.ts'
import TransactionList from './components/TransactionList.vue'
import TransactionForm, { type TransactionFormData } from './components/TransactionForm.vue'

const transactions = ref<Transaction[]>([])

type TransactionJSON = Omit<Transaction, 'date'> & { date: string }

const isLoading = ref(false)

const alertMsg = ref<string>('')

async function getTransactions() {
  try {
    isLoading.value = true

    const response = await fetch('http://localhost:3000/transaction')

    if (!response.ok) {
      if (response.status === 500) {
        alertMsg.value = 'An error occurred while retrieving the transaction.'
      }
      return
    }

    const data = await response.json()

    const transactionsJSON: TransactionJSON[] = data.transactions

    transactions.value = transactionsJSON.map((transactionJSON) => ({
      ...transactionJSON,
      date: new Date(transactionJSON.date),
    }))
  } catch (err) {
    console.error('Error retrieving transactions GET:', err)
    alertMsg.value = 'Unable to connect to the server.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getTransactions()
})

const solde = computed(() => {
  return transactions.value.reduce((acc, trans) => {
    return acc + trans.amount
  }, 0)
})

function addTransaction(tFormData: TransactionFormData) {
  postAddTransaction(tFormData)
}

async function postAddTransaction(tFormData: TransactionFormData) {
  try {
    const response = await fetch('http://localhost:3000/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tFormData),
    })

    if (!response.ok) {
      if (response.status === 400) {
        alertMsg.value = 'Required transaction fields are missing.'
      } else if (response.status === 500) {
        alertMsg.value = 'An error occurred while creating the transaction.'
      } else {
        alertMsg.value = 'An unexpected error occurred.'
      }

      return
    }

    const newTransactionJSON: TransactionJSON = await response.json()

    transactions.value.push({
      ...newTransactionJSON,
      date: new Date(newTransactionJSON.date),
    })
  } catch (err) {
    console.error('Error creating transaction POST:', err)
    alertMsg.value = 'Unable to connect to the server.'
  }
}

type TransactionId = Transaction['id']

function deleteTransaction(id: TransactionId) {
  postDeleteTransaction(id)
}

async function postDeleteTransaction(id: TransactionId) {
  try {
    const response = await fetch(`http://localhost:3000/transaction/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      alertMsg.value = 'An unexpected error occurred.'
      return
    }

    // success
    for (let i = 0; i < transactions.value.length; i++) {
      const transaction = transactions.value[i]
      if (transaction && transaction.id === id) {
        transactions.value.splice(i, 1)
        return
      }
    }
  } catch (err) {
    console.error('Error creating delete transaction POST:', err)
    alertMsg.value = 'An unexpected error occurred.'
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
