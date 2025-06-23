import { defineStore } from "pinia"
import type { Rate } from "~/types/rateType"

export const useRateStore = defineStore('rates', () => {

    const rates = ref<Rate[]>([])
    const rateTotal = ref(0)
    const getRates = computed(() => rates.value)
    const getRateTotal = computed(() => rateTotal.value)
    const getByIdRate = (rateId: number) => {
        return rates.value.find(rate => rate.id === rateId)
    }

    async function fetchRates(params: { limit: number, page: number, baseCurrencyId?: number, targetCurrencyId?: number, effectiveDate?: string }, append = false) {
        const response: any = await $fetch.raw(`/api/v1/rates`, {
            params: {
                limit: params.limit,
                page: params.page,
                baseCurrencyId: params.baseCurrencyId,
                targetCurrencyId: params.targetCurrencyId,
                effectiveDate: params.effectiveDate,
            }
        });

        const newRates = response._data;

        if (append) {
            rates.value = [...rates.value, ...newRates];
        } else {
            rates.value = newRates;
        }

        rateTotal.value = parseInt(response.headers.get('X-Total-Items') || '0');

        return newRates;
    }

    async function createRate(rate: Rate) {
        const response: any = await $fetch(`/api/v1/rates`, {
            method: 'POST',
            body: rate
        })
        rates.value.push(response)
        rateTotal.value += 1
    }

    async function updateRate(rateId: number, rate: Rate) {
        await $fetch(`/api/v1/rates/${rateId}`, {
            method: 'PUT',
            body: rate
        })
        const index = rates.value.findIndex(rate => rate.id === rateId)
        if (index !== -1) {
            rates.value.splice(index, 1, rate)
        }
    }

    async function updateRatesBulk(updatedRates: Rate[]) {
        const response = await $fetch<any>(`/api/v1/rates`, {
            method: 'PUT',
            body: updatedRates,
        });

        response.forEach((updatedRate: any) => {
            const index = rates.value.findIndex(r => r.id === updatedRate.id);
            if (index !== -1) {
                rates.value.splice(index, 1, updatedRate);
            } else {
                rates.value.push(updatedRate);
                rateTotal.value += 1;
            }
        });
    }

    async function deleteRate(rateId: number) {
        await $fetch(`/api/v1/rates/${rateId}`, {
            method: 'DELETE',
        })

        rates.value = rates.value.filter(rate => rate.id !== rateId)

        rateTotal.value -= 1
    }

    return {
        rates,
        rateTotal,
        getRates,
        getRateTotal,
        getByIdRate,
        fetchRates,
        createRate,
        updateRate,
        updateRatesBulk,
        deleteRate
    }
})