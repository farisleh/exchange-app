import { defineStore } from "pinia"
import type { Currency } from "~/types/currencyType"

export const useCurrencyStore = defineStore('currencies', () => {

    const currencies = ref<Currency[]>([])
    const currencyTotal = ref(0)
    const getCurrencies = computed(() => currencies.value)
    const getCurrencyTotal = computed(() => currencyTotal.value)
    const getByIdCurrency = (currencyId: number) => {
        return currencies.value.find(currency => currency.id === currencyId)
    }

    async function fetchCurrencies(params: { limit: number, page: number }) {
        const response: any = await $fetch.raw(`/api/v1/currencies`, {
            params: {
                limit: params.limit,
                page: params.page
            }
        })
        currencies.value = response._data
        currencyTotal.value = parseInt(response.headers.get('X-Total-Items') || '')
    }

    async function createCurrency(currency: Currency) {
        const response: any = await $fetch(`/api/v1/currencies`, {
            method: 'POST',
            body: currency
        })
        currencies.value.push(response)
        currencyTotal.value += 1
    }

    async function updateCurrency(currencyId: number, currency: Currency) {
        await $fetch(`/api/v1/currencies/${currencyId}`, {
            method: 'PUT',
            body: currency
        })
        const index = currencies.value.findIndex(currency => currency.id === currencyId)
        if (index !== -1) {
            currencies.value.splice(index, 1, currency)
        }
    }

    async function deleteCurrency(currencyId: number) {
        await $fetch(`/api/v1/currencies/${currencyId}`, {
            method: 'DELETE',
        })

        currencies.value = currencies.value.filter(currency => currency.id !== currencyId)

        currencyTotal.value -= 1
    }

    return {
        currencies,
        currencyTotal,
        getCurrencies,
        getCurrencyTotal,
        getByIdCurrency,
        fetchCurrencies,
        createCurrency,
        updateCurrency,
        deleteCurrency
    }
})