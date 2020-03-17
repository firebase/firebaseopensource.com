import { shallowMount } from '@vue/test-utils'
import Index from '@/pages/index.vue'

describe('HomePage', () => {
  it('is a Vue component', () => {
    const wrapper = shallowMount(Index)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
