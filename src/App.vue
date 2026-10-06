<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

import TransactionList from './components/TransactionList.vue'
import TransactionForm from './components/TransactionForm.vue'

import type { Transaction, NewTransactionInput, TransactionId } from '../shared/types/Transaction'
import type { Category, Subcategory } from '../shared/types/Category.ts'
import type { Account } from '../shared/types/Account.ts'

import { createTransaction, fetchTransactions, removeTransaction } from './services/transactions.ts'
import { fetchCategories, fetchSubcategories } from './services/categories.ts'
import { fetchAccounts } from './services/accounts.ts'

const alertMsg = ref<string>('')

const transactions = ref<Transaction[]>([])
const categories = ref<Category[]>([])
const subcategories = ref<Subcategory[]>([])
const accounts = ref<Account[]>([])

const isLoading = ref(false)

onMounted(() => {
  loadTransactions()
  loadCategories()
  loadSubcategories()
  loadAccounts()
})

const balance = computed(() => {
  return transactions.value.reduce((acc, trans) => {
    const sum = acc + trans.amount
    return Number(sum.toFixed(2))
  }, 0)
})

async function addTransaction(tFormData: NewTransactionInput) {
  try {
    const added: Transaction = await createTransaction(tFormData)

    transactions.value.push(added)

    transactions.value.sort((a, b) => a.date.getTime() - b.date.getTime())
  } catch (err) {
    console.error('Error adding transaction:', err)
    if (err === 400) {
      alertMsg.value = 'Required transaction fields are missing.'
    } else {
      alertMsg.value = 'Unable to save transactions. Please try again later.'
    }
  }
}

async function deleteTransaction(id: TransactionId) {
  try {
    const deleted = await removeTransaction(id)

    for (let i = 0; i < transactions.value.length; i++) {
      const transaction = transactions.value[i]
      if (transaction && transaction.id === deleted) {
        transactions.value.splice(i, 1)
        return
      }
    }
  } catch (err) {
    console.error('Error deleting transaction:', err)
    alertMsg.value = 'Unable to delete transactions. Please try again later.'
  }
}

async function loadTransactions() {
  try {
    isLoading.value = true
    transactions.value = await fetchTransactions()
  } catch (err) {
    // await sleep(1000)
    console.error('Error retrieving transactions:', err)
    alertMsg.value = 'Unable to retrieve transactions. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

async function loadCategories() {
  try {
    isLoading.value = true
    categories.value = await fetchCategories()
  } catch (err) {
    // await sleep(1000)
    console.error('Error retrieving categories:', err)
    alertMsg.value = 'Unable to retrieve categories. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

async function loadSubcategories() {
  try {
    isLoading.value = true
    subcategories.value = await fetchSubcategories()
  } catch (err) {
    // await sleep(1000)
    console.error('Error retrieving subcategories:', err)
    alertMsg.value = 'Unable to retrieve subcategories. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

async function loadAccounts() {
  try {
    isLoading.value = true
    accounts.value = await fetchAccounts()
  } catch (err) {
    // await sleep(1000)
    console.error('Error retrieving accounts:', err)
    alertMsg.value = 'Unable to retrieve accounts. Please try again later.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <h1>Mon Ledger</h1>
  <div>Solde : {{ balance }} €</div>
  <h2>Transactions</h2>
  <div v-show="isLoading">Chargement en cours...</div>
  <TransactionList v-show="!isLoading" :transactions="transactions" @delete="deleteTransaction" />
  <TransactionForm
    v-show="!isLoading"
    :categories="categories"
    :subcategories="subcategories"
    :accounts="accounts"
    @submit="addTransaction"
    @validationError="alertMsg = $event"
  />
  <div v-show="alertMsg.length"><button @click="alertMsg = ''">&times;</button>{{ alertMsg }}</div>
</template>

<style scoped></style>
