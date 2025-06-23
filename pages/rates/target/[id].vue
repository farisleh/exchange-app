<template>
  <v-container>
    <h2 class="text-h5 mb-4">Rates for {{ targetCurrencyCode }}</h2>

    <v-form @submit.prevent="submitAll">
      <v-row v-for="(rate, index) in editableRates" :key="rate.id" class="mb-4" align="center">
        <v-col cols="3">
          <v-select
            v-model="rate.baseCurrencyId"
            :items="baseCurrencyOptions"
            item-title="code"
            item-value="id"
            label="Base Currency"
            required
          />
        </v-col>

        <v-col cols="3">
          <v-text-field v-model="rate.rate" label="Exchange Rate" type="number" step="0.000001" required />
        </v-col>

        <v-col cols="3">
          <v-text-field v-model="rate.effectiveDate" label="Effective Date" type="date" required />
        </v-col>

        <v-col cols="1" class="d-flex align-center justify-center">
        <v-icon
            color="error"
            class="cursor-pointer"
            @click="deleteRate(index)"
            title="Delete rate"
        >
            mdi-delete
        </v-icon>
        </v-col>
      </v-row>

      <!-- Add New Rate Section -->
      <v-row class="mb-4" align="center">
        <v-col cols="3">
          <v-select
            v-model="newRate.baseCurrencyId"
            :items="baseCurrencyOptions"
            item-title="code"
            item-value="id"
            label="Base Currency"
            required
          />
        </v-col>

        <v-col cols="3">
          <v-text-field v-model="newRate.rate" label="Exchange Rate" type="number" step="0.000001" required />
        </v-col>

        <v-col cols="3">
          <v-text-field v-model="newRate.effectiveDate" label="Effective Date" type="date" required />
        </v-col>

        <v-col cols="3" class="d-flex align-center">
        <v-icon
            color="primary"
            class="cursor-pointer"
            title="Add new rate"
            @click="addNewRate"
            style="font-size: 28px;"
        >
            mdi-plus-circle
        </v-icon>
        </v-col>
      </v-row>

      <v-btn type="submit" color="primary" class="mt-4">Save Changes</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { useRateStore } from '~/stores/rateStore'
import { useCurrencyStore } from '~/stores/currencyStore'

const route = useRoute()
const rateStore = useRateStore()
const currencyStore = useCurrencyStore()

const editableRates = ref([])
const targetCurrencyCode = ref('')
const limit = ref(12)
const page = ref(1)

const newRate = ref({
  baseCurrencyId: null,
  rate: null,
  effectiveDate: new Date().toISOString().slice(0, 10),
})

const baseCurrencyOptions = ref([])

onMounted(async () => {
  const allRates = await rateStore.fetchRates({
    limit: limit.value,
    page: page.value,
    targetCurrencyId: route.params.id,
  })
  editableRates.value = allRates.map(r => ({
    id: r.id,
    baseCurrencyId: r.baseCurrencyId,
    rate: r.rate,
    effectiveDate: r.effectiveDate,
  }))

  targetCurrencyCode.value = allRates[0]?.targetCurrencyId?.code || ''

  await currencyStore.fetchCurrencies(100, 1)
  baseCurrencyOptions.value = currencyStore.currencies
})

const deleteRate = async (index) => {
  const rate = editableRates.value[index]

  if (!rate.id) {
    editableRates.value.splice(index, 1)
    return
  }

  try {
    await rateStore.deleteRate(rate.id)
    editableRates.value.splice(index, 1)
  } catch (e) {
    alert('Failed to delete rate: ' + e.message)
  }
}

const addNewRate = async () => {
  if (!newRate.value.baseCurrencyId || !newRate.value.rate || !newRate.value.effectiveDate) {
    alert('Please fill all fields to add a new rate')
    return
  }

  editableRates.value.push({
    id: null,
    baseCurrencyId: baseCurrencyOptions.value.find(c => c.id === newRate.value.baseCurrencyId),
    rate: Number(newRate.value.rate),
    effectiveDate: newRate.value.effectiveDate,
  })

  newRate.value.baseCurrencyId = null
  newRate.value.rate = null
  newRate.value.effectiveDate = new Date().toISOString().slice(0, 10)
}

const submitAll = async () => {
  try {

    const newRates = editableRates.value.filter(r => !r.id)
    const existingRates = editableRates.value.filter(r => r.id)

    for (const r of newRates) {
      await rateStore.createRate({
        baseCurrencyId: r.baseCurrencyId.id,
        targetCurrencyId: Number(route.params.id),
        rate: Number(r.rate),
        effectiveDate: r.effectiveDate,
      })
    }

    const payload = existingRates.map(rate => ({
      id: rate.id,
      baseCurrencyId: typeof rate.baseCurrencyId === 'object' ? rate.baseCurrencyId.id : rate.baseCurrencyId,
      rate: Number(rate.rate),
      effectiveDate: rate.effectiveDate,
    }))

    await rateStore.updateRatesBulk(payload)

    alert('All changes saved')
  } catch (e) {
    alert('Save failed: ' + e.message)
  }
}
</script>