<template>
  <v-container>
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="auto">
        <h2 class="text-h6 font-weight-medium">
          Rates as of {{ formattedDate }}
        </h2>
      </v-col>

      <v-col cols="auto" class="d-flex align-center" style="gap: 12px;">

        <!-- Base Currency Menu Button -->
        <v-menu v-model="currencyMenu" :close-on-content-click="true" transition="scale-transition" offset-y>
          <template #activator="{ props }">
            <v-btn v-bind="props" color="primary" variant="outlined" prepend-icon="mdi-currency-usd">
              {{ selectedCurrencyCode }}
            </v-btn>
          </template>

          <v-list style="max-height: 200px; overflow-y: auto;">
            <v-list-item v-for="currency in currencyStore.currencies" :key="currency.id"
              @click="selectCurrency(currency)">
              <v-list-item-title>{{ currency.code }}</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>

        <!-- New Currency Button -->
        <v-btn color="secondary" variant="outlined" @click="newCurrencyDialog = true">
          + New Currency
        </v-btn>

        <CurrencyAdd v-model="newCurrencyDialog" @added="refreshCurrencies" />

        <!-- New Rate Button -->
        <v-btn color="secondary" variant="outlined" @click="newRateDialog = true">
          + New Rate
        </v-btn>

        <RateAdd v-model="newRateDialog" @added="refreshRates" />

        <!-- Date Picker Menu Button -->
        <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
          <template #activator="{ props }">
            <v-btn v-bind="props" color="primary" variant="outlined" prepend-icon="mdi-calendar">
              {{ formattedDate }}
            </v-btn>
          </template>

          <v-date-picker v-model="selectedDate" @update:model-value="onDateSelected"
            :max="new Date().toISOString().substring(0, 10)" />
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(rate, index) in visibleRates" :key="index" cols="2" sm="4" md="3">

        <NuxtLink :to="`/rates/target/${rate.targetCurrencyId.id}`" style="text-decoration: none; color: inherit;">
          <v-card elevation="1" class="text-center" style="width: 200px; cursor: pointer;">
            <div class="py-2" style="background-color: #f5f5f5;">
              <div class="text-subtitle-2 font-weight-medium">{{ rate.targetCurrencyId.code }}</div>
            </div>
            <v-card-text class="text-h6 font-weight-bold">
              {{ rate.rate }}
            </v-card-text>
          </v-card>
        </NuxtLink>

      </v-col>
    </v-row>
    <v-row justify="center" class="mt-4">
      <v-col cols="auto">
        <v-btn v-if="rateStore.rates.length < rateStore.rateTotal" color="primary" variant="outlined" @click="loadMore">
          Load More
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { format } from 'date-fns';
import { useRateStore } from '~/stores/rateStore';
import { useCurrencyStore } from '~/stores/currencyStore';

const rateStore = useRateStore();
const currencyStore = useCurrencyStore();
const limit = ref(12);
const page = ref(1);
const dateMenu = ref(false);
const selectedDate = ref(new Date().toISOString().substring(0, 10));
const currencyMenu = ref(false);
const selectedBaseCurrencyId = ref(1);
const newCurrencyDialog = ref(false);
const newRateDialog = ref(false);

onMounted(async () => {
  await currencyStore.fetchCurrencies(limit.value, page.value);
  fetchRates();
});

const fetchRates = async (append = false) => {
  await rateStore.fetchRates({
    limit: limit.value,
    page: page.value,
    baseCurrencyId: selectedBaseCurrencyId.value,
    effectiveDate: formattedDate.value,
  }, append);
};

const refreshCurrencies = async () => {
  await currencyStore.fetchCurrencies(limit.value, 1);
};

const refreshRates = async () => {
  page.value = 1;
  await fetchRates();
};

const selectedCurrencyCode = computed(() => {
  const found = currencyStore.currencies.find(c => c.id === selectedBaseCurrencyId.value);
  return found?.code || 'Select';
});

const selectCurrency = async (currency) => {
  selectedBaseCurrencyId.value = currency.id;
  currencyMenu.value = false;
  page.value = 1;
  await fetchRates();
};

const onDateSelected = async () => {
  dateMenu.value = false;
  page.value = 1;
  await fetchRates();
};

const loadMore = async () => {
  page.value += 1;
  await fetchRates(true);
};

const visibleRates = computed(() => {
  return rateStore.rates;
});

const formattedDate = computed(() => {
  return format(new Date(selectedDate.value), 'yyyy-MM-dd');
});
</script>