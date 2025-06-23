import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RateAdd from '@/components/rate/add.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

describe('RateAdd.vue', () => {
  it('opens and closes dialog', async () => {
    const wrapper = mount(RateAdd, {
      global: {
        plugins: [vuetify],
      },
      props: { modelValue: true },
    })

    expect(wrapper.props('modelValue')).toBe(true)
    wrapper.vm.$emit('update:modelValue', false)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})