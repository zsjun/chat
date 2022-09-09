<template>
  <div v-if="lastSession">
    <div class="moreSession" @click="loadMore">加载更多</div>
  </div>
  <div v-else>
    <div class="moreSession">已加载全部</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Toast } from "vant";
const lastSession = ref(false);
//加载更多
const loadMore = () => {
  /*
   * ##发起请求获取更多聊天记录
   */
  showMsg("发起请求获取更多聊天记录");
};
//弹屏提示
const showMsg = (msg: string) => {
  Toast(msg);
};
</script>

<style scoped lang="scss">
.moreSession {
  width: 1.5rem;
  height: 0.6rem;
  font-size: 14px;
  background: #d1d1d1;
  border-radius: 20px;
  color: #fff;
  line-height: 0.6rem;
  text-align: center;
  margin: 0 auto;
  margin-top: 0.1rem;
}
</style>
