<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h6">Add New Rate</span>
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="rate.baseCurrencyId"
          :items="currencyStore.currencies"
          item-title="code"
          item-value="id"
          label="Base Currency"
          required
        />

        <v-select
          v-model="rate.targetCurrencyId"
          :items="currencyStore.currencies"
          item-title="code"
          item-value="id"
          label="Target Currency"
          required
        />

        <v-text-field
          v-model="rate.rate"
          label="Exchange Rate"
          type="number"
          step="0.000001"
          required
        />

        <v-text-field
          v-model="rate.effectiveDate"
          label="Effective Date"
          type="date"
          required
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="submit">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useCurrencyStore } from '~/stores/currencyStore';
import { useRateStore } from '~/stores/rateStore';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'added']);

const currencyStore = useCurrencyStore();
const rateStore = useRateStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const rate = reactive({
  baseCurrencyId: null,
  targetCurrencyId: null,
  rate: '',
  effectiveDate: new Date().toISOString().substring(0, 10),
});

watch(() => props.modelValue, (val) => {
  if (!val) {
    rate.baseCurrencyId = null;
    rate.targetCurrencyId = null;
    rate.rate = '';
    rate.effectiveDate = new Date().toISOString().substring(0, 10);
  }
});

const closeDialog = () => {
  emit('update:modelValue', false);
};

const submit = async () => {
  if (!rate.baseCurrencyId || !rate.targetCurrencyId || !rate.rate || !rate.effectiveDate) {
    alert('Please fill all fields');
    return;
  }

  try {
    await rateStore.createRate({
      baseCurrencyId: rate.baseCurrencyId,
      targetCurrencyId: rate.targetCurrencyId,
      rate: Number(rate.rate),
      effectiveDate: rate.effectiveDate,
    });

    emit('added');
    closeDialog();
  } catch (e) {
    alert('Failed to add rate: ' + e.message);
  }
};
</script>