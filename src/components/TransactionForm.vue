<script setup lang="ts">
import { ref } from 'vue'

const TDateInput = ref('')
const TDescriptInput = ref('')
const TAmountInput = ref(0)

type TFormData = {
  date: string
  description: string
  amount: number
}

const emit = defineEmits<{ submit: [data: TFormData] }>()

function submitForm(date: string, description: string, amount: number) {
  if (date && description && amount !== 0) {
    emit('submit', {
      date,
      description,
      amount,
    })
  } else {
    console.warn('Invalid submit event transaction!')
  }

  TDateInput.value = ''
  TDescriptInput.value = ''
  TAmountInput.value = 0
}
</script>

<template>
  <form @submit.prevent="submitForm(TDateInput, TDescriptInput, TAmountInput)">
    <label for="TDateInput">Date de la transaction</label>
    <input type="date" id="TDateInput" v-model="TDateInput" />

    <label for="TDescriptInput">Description</label>
    <input type="text" id="TDescriptInput" v-model="TDescriptInput" />

    <label for="TAmountInput">Montant</label>
    <input type="number" id="TAmountInput" v-model.number="TAmountInput" />

    <input type="submit" value="Ajouter" />
  </form>
</template>

<style scoped></style>
