<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Transaction } from '@/types/Transaction.ts'
import TransactionList from './components/TransactionList.vue'
import TransactionForm from './components/TransactionForm.vue'

const transactions = ref<Transaction[]>([
  { id: 1, date: new Date(2026, 8, 15), description: 'Salaire', amount: 2000 },
  { id: 2, date: new Date(2026, 8, 14), description: 'Courses', amount: -80 },
  { id: 3, date: new Date(2026, 8, 12), description: 'Loyer', amount: -670 },
])

const solde = computed(() => {
  return transactions.value.reduce((acc, trans) => {
    return acc + trans.amount
  }, 0)
})

function addTransaction(TFormData: { date: string; description: string; amount: number }) {
  const lastT = transactions.value.at(-1)
  transactions.value.push({
    id: lastT ? lastT.id + 1 : 1,
    date: new Date(TFormData.date),
    description: TFormData.description,
    amount: TFormData.amount,
  })
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
