<template>
  <section class="lightBox">
    <div class="lightBox__header">
      <h1>{{ title }}</h1>
      <button @click="tryClose"><i class="fa-solid fa-x"></i></button>
    </div>
    <div class="lightBox__content">
      <slot></slot>
    </div>
  </section>
  <div class="maskMode"></div>
</template>

<script>
export default {
  props: ['title'],
  emits: ['close', 'confirm'],
  setup(_, context) {
    
    function tryClose () {
      context.emit('close')
    }

    function tryConfirm () {
      context.emit('confirm')
    }

    return {
      tryClose
    }
  }
}
</script>