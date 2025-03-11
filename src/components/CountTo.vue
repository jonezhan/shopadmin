<script setup>
import gsap from "gsap";
import { watch, reactive } from "vue";
const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});

const d = reactive({
  num: 0,
});

function AnimateToValue() {
  gsap.to(d, { duration: 0.5, num: props.value });
}
AnimateToValue();
watch(
  () => props.value,
  (newValue) => {
    AnimateToValue();
  }
);
</script>

<template>
  {{ Number.isInteger(d.num) ? d.num.toFixed(0) : d.num.toFixed(2) }}
</template>
