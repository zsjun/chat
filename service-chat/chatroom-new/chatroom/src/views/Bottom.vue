<template>
  <div class="inputBox">
    <!-- 客服不在线 -->
    <div
      v-show="!sender.onlineState"
      id="toPeopleService"
      class="robotServices"
      @click="callPeople"
    >
      <img :src="servicePng" />
      <div class="robotFont">转人工</div>
    </div>
    <div :class="!sender.onlineState ? 'inputDiv' : 'inputDiv2'">
      <input
        class="inputContent"
        type="text"
        :value="sendInfo"
        @input="updateSendInfoSelf"
        @keyup.enter="sendToRobot"
      />
    </div>
    <div v-show="!sender.onlineState">
      <div class="sendToRobot" @click="sendToRobot">发送</div>
    </div>
    <div v-show="sender.onlineState" style="display: flex">
      <div class="sendExpression">
        <img :src="smilePng" />
      </div>
      <div class="sendToPeople" @click="toSend(sendInfo, 2, 0)">发送</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, toRefs } from "vue";
import { Toast } from "vant";
import nowTime from "./utils";
import servicePng from "../assets/Images/service/客服.png";
import addPng from "../assets/Images/service/加号.png";
import smilePng from "../assets/Images/service/笑脸.png";

const $socket: any = inject("$socket");
const props = defineProps<{
  sendInfo: any;
  sender: any;
  revicer: any;
}>();
const { sender, revicer, sendInfo } = toRefs(props);
const emits = defineEmits([
  "toBottom",
  "showMsg",
  "signalrService",
  "toSendInfo",
  "sendFailed",
  "updataSendInfo",
]);

const updateSendInfoSelf = (e: Event) => {
  const targetValue = (e.target as HTMLInputElement).value;
  // sendInfo.value = targetValue;
  emits("updataSendInfo", targetValue);
};
const openMore = (type: string) => {
  switch (type) {
    case "input":
      // moreTool = false;
      // expressionShow = false;
      changeHeight();
      emits("toBottom", 100);
      break;
    case "tool":
      // expressionShow = false;
      // moreTool = !moreTool;
      changeHeight();
      emits("toBottom", 100);
      break;
    case "expression":
      // moreTool = false;
      // expressionShow = !expressionShow;
      changeHeight();
      emits("toBottom", 100);
      break;
  }
};
//呼叫客服
function callPeople() {
  loading();
  joinChat();
}
//加入会话
function joinChat() {
  $socket.emit("joinChat", {
    SendId: sender.value.id,
    ReviceId: revicer.value.id,
    SendName: sender.value.name,
    ReviceName: revicer.value.name,
    IsService: sender.value.isService,
    // NoCode: noCode,
    NoCode: 111,
  });
}
//加载动画
function loading() {
  Toast.loading({
    duration: 0,
    message: "",
    forbidClick: true,
  });
}
//自适应高度
const changeHeight = () => {
  var height = document.body.clientHeight;
  setTimeout(() => {
    var floatHeight = document.getElementById("floatDiv")!.offsetHeight;
    document.getElementById("ChatContent")!.style.height =
      height - floatHeight + "px";
    emits("toBottom", 100);
  }, 100);
};
//发送消息给会员或客服
function toSend(content: any, identity: any, type: any) {
  if (type === 0 && content.length <= 0) {
    emits("showMsg", "请输入发送内容");
    return;
  }
  if (type === 2 && sender.isService) {
    // expressionShow = !expressionShow;
  }
  emits("signalrService", content, identity, type);
}
//机器人聊天
function sendToRobot() {
  // 如果发送的内容不为空
  if (sendInfo.value != "") {
    let createDate = nowTime();
    let timeStmp = +new Date();
    let content = sendInfo.value;

    // sendInfo.value = "";
    const infoTemplate = {
      SendId: sender.value.id,
      ReviceId: 0,
      Content: content,
      // 客户
      Identity: 3,
      Type: 0,
      State: 0,
      timeStmp: timeStmp,
      OutTradeNo: null,
      CreateDateUtc: createDate,
      Title: null,
      Description: null,
      Label: null,
      Thumbnail: null,
      NoSend: true,
    };
    // 改变消息展示
    emits("toSendInfo", infoTemplate);
    // 清空输入框信息
    emits("updataSendInfo", "");
    // 发送到服务端
    $socket.emit("sendToRobot", infoTemplate);
    emits("toBottom", 100);
    // emits("sendFailed", infoTemplate);
  } else {
    return null;
  }
}
function submitName() {
  console.log(333);
}
</script>

<style scoped lang="scss">
@import url("../assets/CSS/chat.css");
.inputBox {
  font-size: 14px;
}
</style>
