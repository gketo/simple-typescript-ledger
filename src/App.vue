<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

import type { Transaction } from '@/types/Transaction.ts'
import TransactionList from './components/TransactionList.vue'
import TransactionForm from './components/TransactionForm.vue'

const transactions = ref<Transaction[]>([
  // { id: 1, date: new Date(2026, 8, 15), description: 'Salaire', amount: 2000 },
  // { id: 2, date: new Date(2026, 8, 14), description: 'Courses', amount: -80 },
  // { id: 3, date: new Date(2026, 8, 12), description: 'Loyer', amount: -670 },
])

type TransactionResponse = Omit<Transaction, 'date'> & { date: string }

async function getTransactions() {
  try {
    const response = await fetch('http://localhost:3000/transactions')

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const data = await response.json()

    const resTransactions: TransactionResponse[] = data.transactions

    transactions.value = resTransactions.map((transactionSTR) => ({
      ...transactionSTR,
      date: new Date(transactionSTR.date),
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

function addTransaction(TFormData: { date: string; description: string; amount: number }) {
  const transaction = {
    date: new Date(TFormData.date),
    description: TFormData.description,
    amount: TFormData.amount,
  }
  postTransaction(transaction)
}

async function postTransaction(transaction: Omit<Transaction, 'id'>) {
  try {
    const response = await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const createdTransaction: Transaction = await response.json()
    console.log(createdTransaction)
  } catch (err) {
    console.error('Error creating transaction POST:', err)
  }
}
</script>

<template>
  <h1>Mon Ledger</h1>
  <div>Solde : {{ solde }} €</div>
  <h2>Transactions</h2>
  <TransactionList :transactions="transactions" />
  <TransactionForm @submit="addTransaction" />
</template>

<style scoped></style>
