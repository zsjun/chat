<template>
  <div class="chatBox">
    <div id="ChatContent" class="chatContent">
      <!-- <more></more> -->
      <template v-for="item in conversition">
        <!-- Identity 1 机器人，2 在线客服 3 客户 -->
        <!--  type:【0:文本】 【1:图片】 【2:表情】 【3:商品卡片/订单卡片】  -->
        <div v-if="item.SendId === sender.id && item.Identity === 3">
          <div class="myselfDiv">
            <div v-if="item.Type === 0" class="myselfContent">
              {{ item.Content }}
            </div>
            <img
              v-else-if="item.Type === 1"
              class="mineSendImage"
              @load="loadOverImg"
              preview="1"
              :src="item.SeleContent"
            />
            <div v-else-if="item.Type === 2" class="myselfContent">
              <img :src="item.SeleContent" />
            </div>
            <div class="myselfImage">
              <img :src="myselfImage" />
            </div>
          </div>
          <div style="clear: both"></div>
        </div>
        <!-- 机器人发过来的信息，并且是文字 -->
        <div v-else-if="item.Identity === 1 && item.Type === 0">
          <div class="customerServiceDiv">
            <div class="customerServiceImage">
              <img :src="customerServiceImage" />
            </div>
            <div class="otherContent" v-html="item.Content"></div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div v-else-if="item.Identity === 3">
          <div class="otherDiv">
            <span>{{ item.Content }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRefs, inject } from "vue";
// import { io } from "socket.io-client";
// import { Toast } from "vant";
import More from "./More.vue";
import myselfImage from "../assets/Images/service/customerImg.png";
import customerServiceImage from "../assets/Images/service/serviceImg.png";
const lastSession = ref(false);

// 声明触发事件 childClick
const emits = defineEmits(["toBottom", "showMsg", "signalrService"]);
const props = defineProps<{
  conversition: any;
  sender: any;
  revicer: any;
}>(); // 获取props
const { conversition, sender, revicer } = toRefs(props);
const $socket: any = inject("$socket");
// const { socket } = props;
// const sonToFather = () => {
//   emit("childClick", props.foo);
// };

//查看大图
const loadOverImg = () => {
  // this.$previewRefresh();
  // toBottom(100);
};
//打开卡片链接
const toUrl = (url: string | undefined) => {
  window.open(url);
};
//会员发送卡片给客服
const sendCard = (item: { noSend: boolean }) => {
  if (item.noSend) {
    item.noSend = !item.noSend;
    $socket.emit("sendMsg", item);
  } else {
    emits("showMsg", "已发送");
  }
};
onMounted(() => {
  // socket = io("http://localhost:3100" || "/");
});
onBeforeUnmount(() => {
  console.log("unmount");
});
//点击机器人链接
const linkReply = (answer: string, reply: string) => {
  emits("signalrService", answer, 2, 0, false, true);
  emits("signalrService", reply, 1, 0, false, true);
  emits("toBottom", 100);
};
</script>

<style scoped lang="scss">
.chatBox {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: #fff;
  box-sizing: border-box;
  font-size: 14px;
  padding-bottom: 80px;
}

.chatContent {
  height: 10.2rem;
  overflow: auto;
  padding-top: 20px;
}
.myselfDiv {
  float: right;
  margin: 0.35rem 0;
  display: flex;
  position: relative;
}
.customerServiceDiv {
  float: left;
  margin: 0.25rem 0rem;
  display: flex;
  position: relative;
}
.otherContent {
  padding: 0.1rem 0.35rem;
  max-width: 4rem;
  margin-top: 20px;
  margin-left: 10px;
  word-wrap: break-word;
  word-break: break-all;
  position: relative;
  text-align: left;
  background: #eee;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
  border-radius: 16px 16px 16px 0px;
  // &:before {
  //   width: 0;
  //   position: absolute;
  //   top: 4px;
  //   right: -7px;
  //   border-style: solid;
  //   border-color: transparent #fde7e9;
  //   border-width: 4px 0px 8px 8px;
  //   content: "";
  // }
}
.goods-wrap {
  width: 96%;
  height: 89%;
  background: #fff;
  padding: 5px;
  min-width: 180px;
  overflow: hidden;
}

.goods-thum {
  width: 22%;
  max-height: 80px;
  height: 80px !important;
  float: left;
}

.goods-detail {
  float: left;
  width: 70%;
  margin-left: 10px;
}

.goods-wrap img {
  max-width: 100%;
  vertical-align: bottom;
  height: auto !important;
}

.goods-title {
  float: left;
  width: 100%;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  white-space: nowrap;
  color: #3d4966;
}

.goods-abstract {
  float: left;
  width: 100%;
  /* height: 20px; */
  margin-top: 5px;
  color: #3d4966;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  white-space: nowrap;
}
</style>
