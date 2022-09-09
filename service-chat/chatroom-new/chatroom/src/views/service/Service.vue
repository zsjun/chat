<script setup lang="ts">
import { ref, reactive, toRefs, provide } from "vue";
import BoxHead from "./BoxHead.vue";
import ConLeft from "./ConLeft.vue";
import type { senderType, revicerType } from "../types";

const changeUserName = ref(false);
const showLoginBtn = ref(true);
const changeReceptNumber = ref(false);
const temporaryUserName = ref("");
const isSelectSession = ref(false);

const props = defineProps<{
  sender: senderType;
  revicer: revicerType;
  currentHasPeople: boolean;
  currentSessionPeople: any;
  offLineSessionPeople: any[];
}>();
const { sender, revicer } = toRefs(props);
// const emits = defineEmits(["updateSender"]);
// const { showLoading } = props;
// console.log(props.showLoading);
// provide(updateSender, emits("updateSender"));
</script>

<template>
  <div class="qqbox">
    <!--头部-->
    <BoxHead
      :temporaryUserName="temporaryUserName"
      :changeReceptNumber="changeReceptNumber"
      :sender="sender"
      :revicer="revicer"
      :isSelectSession="isSelectSession"
      :changeUserName="changeUserName"
      :showLoginBtn="showLoginBtn"
    ></BoxHead>
    <ConLeft
      :sender="sender"
      :currentHasPeople="currentHasPeople"
      :currentSessionPeople="currentSessionPeople"
      :offLineSessionPeople="offLineSessionPeople"
    ></ConLeft>
  </div>
</template>

<style lang="scss" scoped>
@import url("../../assets/CSS/service.css");
.qqbox {
  position: relative;
  font-size: 14px;
}
</style>
