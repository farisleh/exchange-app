import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CurrencyAdd from '@/components/currency/add.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

describe('CurrencyAdd.vue', () => {
  it('mounts properly', () => {
    const wrapper = mount(CurrencyAdd, {
      global: {
        plugins: [vuetify],
      },
      props: { modelValue: true },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('dialog is open when modelValue=true', () => {
    const wrapper = mount(CurrencyAdd, {
      global: { plugins: [vuetify] },
      props: { modelValue: true },
    })
    expect(wrapper.props('modelValue')).toBe(true)
  })

  it('dialog closes when update:modelValue emitted with false', async () => {
    const wrapper = mount(CurrencyAdd, {
      global: { plugins: [vuetify] },
      props: { modelValue: true },
    })

    wrapper.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
