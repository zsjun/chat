<script setup lang="ts">
import { onMounted, ref } from "vue";
import Child from "./Child.vue";
const searchText = ref(1);
function changeVal(val: number) {
  searchText.value = val;
}
const el = ref();

onMounted(() => {
  console.log(el.value.a);
});
// const vMyFocus = {
//   onMounted: (el: HTMLInputElement) => {
//     el.focus();
//     // 在元素上做些操作
//   },
// };
</script>
<template>
  <Child :modelValue="searchText" @update:modelValue="changeVal" ref="el">
  </Child>
  <!-- <input v-my-focus value="111" /> -->
</template>

<!-- <style lang="scss" scoped>
.father {
  margin-top: 40px;
  margin-bottom: 40px;
}
.btn {
  font-size: 20px;
  color: red;
}
</style> -->
