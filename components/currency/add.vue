<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>
        <span class="text-h6">Add New Currency</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="currency.code"
          label="Currency Code"
          maxlength="3"
          counter="3"
          required
        />
        <v-text-field
          v-model="currency.name"
          label="Currency Name"
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
import { computed, reactive, watch } from 'vue';
import { useCurrencyStore } from '~/stores/currencyStore';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'added']);

const currencyStore = useCurrencyStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const currency = reactive({
  code: '',
  name: '',
});

watch(() => props.modelValue, (newVal) => {
  if (newVal === false) {
    currency.code = '';
    currency.name = '';
  }
});

const closeDialog = () => {
  emit('update:modelValue', false);
};

const submit = async () => {
  if (!currency.code || !currency.name) {
    alert('Please fill all fields');
    return;
  }

  try {
    await currencyStore.createCurrency({
      code: currency.code.toUpperCase(),
      name: currency.name,
    });

    emit('added');
    closeDialog();
  } catch (error) {
    alert('Failed to add currency: ' + error.message);
  }
};
</script>