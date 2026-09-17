<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

import type { Transaction } from '@/types/Transaction.ts'
import TransactionList from './components/TransactionList.vue'
import TransactionForm, { type TransactionFormData } from './components/TransactionForm.vue'

const transactions = ref<Transaction[]>([])

type TransactionJSON = Omit<Transaction, 'date'> & { date: string }

async function getTransactions() {
  try {
    const response = await fetch('http://localhost:3000/transaction')

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const data = await response.json()

    const transactionResponse: TransactionJSON[] = data.transactions

    transactions.value = transactionResponse.map((transactionJSON) => ({
      ...transactionJSON,
      date: new Date(transactionJSON.date),
    }))
  } catch (err) {
    console.error('Error creating transactions GET:', err)
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
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const newTransaction = await response.json()
    transactions.value.push({
      ...newTransaction,
      date: new Date(newTransaction.date),
    })
  } catch (err) {
    console.error('Error creating transaction POST:', err)
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
      throw new Error(`HTTP error! status: ${response.status}`)
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
    console.error('Error creating transaction POST:', err)
  }
}
</script>

<template>
  <h1>Mon Ledger</h1>
  <div>Solde : {{ solde }} €</div>
  <h2>Transactions</h2>
  <TransactionList :transactions="transactions" @deleteTransaction="deleteTransaction" />
  <TransactionForm @submit="addTransaction" />
</template>

<style scoped></style>
