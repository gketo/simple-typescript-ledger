<script setup lang="ts">
import type { Transaction } from '@/types/Transaction'

const props = defineProps<{ transactions: Transaction[] }>()
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
      <tr v-for="trans in props.transactions" :key="trans.id">
        <td>{{ trans.date.getDate() }}/{{ trans.date.getMonth() + 1 }}</td>
        <td>{{ trans.description }}</td>
        <td>{{ trans.amount }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
