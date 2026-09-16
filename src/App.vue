<script setup lang="ts">
import { computed, ref } from 'vue'

interface Transaction {
  id: number
  date: Date
  description: string
  amount: number
}

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

const TDateInput = ref('')
const TDescriptInput = ref('')
const TAmountInput = ref(0)

function addTransaction(date: string, description: string, amount: number) {
  if (date && description && amount !== 0) {
    const lastT = transactions.value.at(-1)
    transactions.value.push({
      id: lastT ? lastT.id + 1 : 1,
      date: new Date(date),
      description: description,
      amount: amount,
    })

    TDateInput.value = ''
    TDescriptInput.value = ''
    TAmountInput.value = 0
  }
}
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
      <tr v-for="trans in transactions" :key="trans.id">
        <td>{{ trans.date.getDate() }}/{{ trans.date.getMonth() + 1 }}</td>
        <td>{{ trans.description }}</td>
        <td>{{ trans.amount }}</td>
      </tr>
    </tbody>
  </table>
  <form @submit.prevent="addTransaction(TDateInput, TDescriptInput, TAmountInput)">
    <label for="TDateInput">Date de la transaction</label>
    <input type="date" id="TDateInput" v-model="TDateInput" />

    <label for="TDescriptInput">Description</label>
    <input type="text" id="TDescriptInput" v-model="TDescriptInput" />

    <label for="TAmountInput">Montant</label>
    <input type="number" id="TAmountInput" v-model.number="TAmountInput" />

    <input type="submit" value="Ajouter" />
  </form>
  <button>[ Ajouter une transaction ]</button>
</template>

<style scoped></style>
