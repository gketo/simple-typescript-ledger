<script setup lang="ts">
import { computed, ref } from 'vue'

interface Transaction {
  date: Date
  description: string
  amount: number
}

const transactions = ref<Transaction[]>([
  { date: new Date(2026, 8, 15), description: 'Salaire', amount: 2000 },
  { date: new Date(2026, 8, 14), description: 'Courses', amount: -80 },
  { date: new Date(2026, 8, 12), description: 'Loyer', amount: -670 },
])

const solde = computed(() => {
  return transactions.value.reduce((acc, trans) => {
    return acc + trans.amount
  }, 0)
})
</script>

<template>
  <h1>Mon Ledger</h1>
  <div>Solde : {{ solde }} €</div>
  <h2>Transactions</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Montant</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="trans in transactions">
        <td>{{ trans.date.getDate() }}/{{ trans.date.getMonth() + 1 }}</td>
        <td>{{ trans.description }}</td>
        <td>{{ trans.amount }}</td>
      </tr>
    </tbody>
  </table>
  <button>[ Ajouter une transaction ]</button>
</template>

<style scoped></style>
