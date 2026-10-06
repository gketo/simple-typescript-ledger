<script setup lang="ts">
import { ref, computed } from 'vue'

import { type Transaction } from '@shared/types/Transaction'
import type { Category, Subcategory } from '@shared/types//Category'
import type { Account } from '@shared/types//Account'

import { type TransactionFormData, formatDateInput } from '../types/TransactionFormData.ts'

type EditMode = { active: true; transaction: Transaction } | { active: false; transaction?: never }

const props = defineProps<{
  editMode: EditMode
  categories: Category[]
  subcategories: Subcategory[]
  accounts: Account[]
}>()

const emit = defineEmits<{
  submit: [data: TransactionFormData]
  error: [message: string]
}>()

function createFormTransaction(transaction?: Transaction): TransactionFormData {
  if (transaction) {
    return {
      date: formatDateInput(transaction.date),
      category: transaction.category,
      subcategory: transaction.subcategory,
      description: transaction.description,
      payee: transaction.payee,
      amountInCents: transaction.amountInCents,
      account: transaction.account,
      hasInvoice: transaction.hasInvoice,
    }
  } else {
    return {
      date: '',
      category: undefined,
      subcategory: undefined,
      description: '',
      amountInCents: 0,
      account: undefined,
      hasInvoice: false,
    }
  }
}

const formData = props.editMode.active
  ? ref(createFormTransaction(props.editMode.transaction))
  : ref(createFormTransaction())

const amount = ref<number>(0)

function submitForm(transaction: TransactionFormData) {
  if (
    transaction.date.length > 0 &&
    transaction.category !== undefined &&
    transaction.description.length > 0 &&
    transaction.account !== undefined &&
    amount.value !== 0
  ) {
    emit('submit', { ...transaction, amountInCents: Math.round(amount.value * 100) })
    formData.value = createFormTransaction()
  } else {
    console.warn('Invalid submit event transaction!')
    emit('error', 'Required transaction fields are missing')
  }
}

// filter subcategories
const subcategoriesFiltered = computed(() => {
  const selectedCategoryId = formData.value.category?.id

  return props.subcategories.filter((subcategory) => subcategory.categoryId === selectedCategoryId)
})
</script>

<template>
  <form @submit.prevent="submitForm(formData)">
    <label for="date">Date</label>
    <input type="date" id="date" name="date" v-model="formData.date" />

    <label for="categoryId">Catégorie</label>
    <select id="categoryId" name="categoryId" v-model="formData.category">
      <option v-for="category in props.categories" :value="category" :key="category.id">
        {{ category.name }}
      </option>
    </select>

    <label for="subcategoryId">Sous-catégorie</label>
    <select id="subcategoryId" name="subcategoryId" v-model="formData.subcategory">
      <option :key="undefined">Aucune</option>
      <option
        v-for="subcategory in subcategoriesFiltered"
        :value="subcategory"
        :key="subcategory.id"
      >
        {{ subcategory.name }}
      </option>
    </select>

    <label for="description">Description</label>
    <input
      type="text"
      id="description"
      name="description"
      v-model="formData.description"
      placeholder="Remplir ici"
    />

    <label for="amount">Montant</label>
    <input
      type="number"
      step="0.01"
      placeholder="0.00"
      id="amount"
      name="amount"
      v-model.number="amount"
    />

    <label for="account">Compte</label>
    <select id="account" name="account" v-model="formData.account">
      <option v-for="account in accounts" :value="account" :key="account.id">
        {{ account.name }}
      </option>
    </select>

    <label for="hasInvoice">Facture?</label>
    <input
      type="checkbox"
      id="hasInvoice"
      name="hasInvoice"
      value="hasInvoice"
      v-model="formData.hasInvoice"
    />

    <input v-if="editMode.active" type="submit" value="Valider" />
    <input v-else type="submit" value="Ajouter" />
  </form>
</template>

<style scoped></style>
