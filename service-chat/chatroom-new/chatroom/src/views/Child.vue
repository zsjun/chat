<template>
  <input v-model="modelValue" />
</template>

<script setup lang="ts">
import { ref, defineExpose, toRefs } from "vue";
const props = defineProps<{
  modelValue: number;
}>();
const { modelValue } = toRefs(props);

const a = 1;
const b = ref(2);

defineExpose({
  a,
  b,
});

// const emits = defineEmits(["changeVal"]);
</script>

<style lang="scss" scoped>
.child {
  position: relative;
}
</style>
