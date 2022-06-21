<template>
  <slot>
    {{ formatTime }}
  </slot>
</template>

<script>
import { computed } from 'vue'
import moment from 'moment'
export default {
  props: {
    time: {
      type: String
    }
  },
  setup(props) {
    const formatTime = computed(() => moment(props.time).format('YYYY/MM/DD HH:mm'))

    return {
      formatTime
    }
  }
}
</script>