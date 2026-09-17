<script setup lang="ts">
import type { Transaction } from '@/types/Transaction'

const props = defineProps<{ transactions: Transaction[] }>()

type TransactionId = Transaction['id']

const emit = defineEmits<{ deleteTransaction: [id: TransactionId] }>()

function deleteTransaction(id: TransactionId) {
  emit('deleteTransaction', id)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Montant</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in props.transactions" :key="transaction.id">
        <td><button @click="deleteTransaction(transaction.id)">[delete]</button></td>
        <td>{{ transaction.date.getDate() }}/{{ transaction.date.getMonth() + 1 }}</td>
        <td>{{ transaction.description }}</td>
        <td>{{ transaction.amount }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
