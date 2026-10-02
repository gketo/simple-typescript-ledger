<script setup lang="ts">
import type { Transaction, TransactionId } from '@/types/Transaction'

const props = defineProps<{ transactions: Transaction[] }>()

const emit = defineEmits<{ delete: [id: TransactionId] }>()

function deleteTransaction(id: TransactionId) {
  emit('delete', id)
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
      <tr v-for="transaction in props.transactions" :key="transaction.id">
        <td><button @click="deleteTransaction(transaction.id)">[delete]</button></td>
        <td>{{ transaction.date.getDate() }}/{{ transaction.date.getMonth() + 1 }}</td>
        <td>{{ transaction.amount }}</td>
        <td>{{ transaction.category }}</td>
        <td>{{ transaction.subcategory }}</td>
        <td>{{ transaction.description }}</td>
        <td>{{ transaction.payee }}</td>
        <td>{{ transaction.amount }}</td>
        <td>{{ transaction.account }}</td>
        <td>{{ transaction.hasInvoice }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
