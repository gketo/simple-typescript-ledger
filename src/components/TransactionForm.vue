<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  createEmptyTransactionInput,
  isValidTransaction,
  type NewTransactionInput,
} from '@/types/Transaction'

import type { Category, Subcategory } from '@/types/Category'

const form = ref(createEmptyTransactionInput())

const props = defineProps<{ categories: Category[]; subcategories: Subcategory[] }>()

const emit = defineEmits<{
  submit: [data: NewTransactionInput]
  validationError: [message: string]
}>()

function submitForm(formData: NewTransactionInput) {
  if (isValidTransaction(formData)) {
    emit('submit', formData)

    form.value = createEmptyTransactionInput()
  } else {
    console.warn('Invalid submit event transaction!')
    emit('validationError', 'Required transaction fields are missing')
  }
}

// filter subcategories
const subcategoriesFiltered = computed(() => {
  const selectedCategoryId = form.value.categoryId

  return props.subcategories.filter((subcategory) => subcategory.categoryId === selectedCategoryId)
})
</script>

<template>
  <form @submit.prevent="submitForm(form)">
    <label for="date">Date</label>
    <input type="date" id="date" name="date" v-model="form.date" />

    <label for="categoryId">Catégorie</label>
    <select id="categoryId" name="categoryId" v-model="form.categoryId">
      <option v-for="category in props.categories" :value="category.id">
        {{ category.name }}
      </option>
    </select>

    <label for="subcategoryId">Sous-catégorie</label>
    <select id="subcategoryId" name="subcategoryId" v-model="form.subcategoryId">
      <option :value="undefined">Aucune</option>
      <option v-for="subcategory in subcategoriesFiltered" :value="subcategory.id">
        {{ subcategory.name }}
      </option>
    </select>

    <label for="description">Description</label>
    <input
      type="text"
      id="description"
      name="description"
      v-model="form.description"
      placeholder="Remplir ici"
    />

    <label for="amount">Montant</label>
    <input type="number" id="amount" name="amount" v-model.number="form.amount" />

    <label for="account">Compte</label>
    <select id="account" name="account" v-model="form.account"></select>

    <label for="hasInvoice">Facture?</label>
    <input
      type="checkbox"
      id="hasInvoice"
      name="hasInvoice"
      value="hasInvoice"
      v-model="form.hasInvoice"
    />

    <input type="submit" value="Ajouter" />
  </form>
</template>

<style scoped></style>
