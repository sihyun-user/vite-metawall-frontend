<template>
  <section class="lightBox">
    <slot></slot>
  </section>
  <div class="maskMode"></div>
</template>

<script>
export default {
  props: ['title'],
  methods: {
    tryClose () {
      const vm = this
      vm.$emit('close')
    },
    tryConfirm () {
      const vm = this
      vm.$emit('confirm')
    }
  }
}
</script>