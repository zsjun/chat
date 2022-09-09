<script setup lang="ts">
// 引入socket.io-client
import { onMounted, reactive, ref, inject, provide, watch } from "vue";
import { useRoute } from "vue-router";
import $store from "@/store/index";
import { Toast } from "vant";
import ChatBox from "./ChatBox.vue";
import Bottom from "./Bottom.vue";
import nowTime from "./utils";
import Servie from "./service/Service.vue";
import { initSender, senderType, initRevicer, revicerType } from "./types";

const $socket: any = inject("$socket");

// 发送者对象
const sender: senderType = reactive(initSender);
// 接收者对象
const revicer: revicerType = reactive(initRevicer);
// 快速回复信息
const fastReplay: any[] = reactive([]);
// const temporaryReceptNumber = ref(0);
const $route = useRoute();
const sendState = ref(true);
const conversition: any[] = reactive([]);
const sendInfo = ref("");
const currentHasPeople = ref(false);
const currentSessionPeople = reactive([]);
const offLineSessionPeople = reactive([]);

provide("updateSender", updateSender);
provide("toSendInfo", toSendInfo);
const socket = ref();
// msgTimer 信息发送定时器
let msgTimer: number = -1;

onMounted(() => {
  init();
  // 接收机器人回复的信息
  $socket.on("reviceFromRobot", reciveFromRobo);
  // 修改信息状态
  $socket.on("changOrShowMsg", changOrShowMsg);
});
function updateSender(obj: Record<string, string | boolean | number>) {
  Object.assign(sender, obj);
}
watch(currentSessionPeople, (newVal: any[]) => getCurrentSessionPeople(newVal));
function getCurrentSessionPeople(newVal: any[]) {
  currentHasPeople.value = false;
  if (newVal.length > 0 && sender.isService) {
    currentHasPeople.value =
      newVal.filter((x) => x.ReviceId === sender.id).length > 0 ? true : false;
  }
}
function updataSendInfo(val: string) {
  sendInfo.value = val;
}

// 当内容变多的的时候，滚动到到底部
function toBottom(time: number) {
  const timerId = setTimeout(() => {
    if (sender.isService) {
      let RightCont = document.getElementById("RightCont") as HTMLDivElement;
      if (RightCont != null) {
        let scrollHeight2 = RightCont.scrollHeight;
        RightCont.scrollTop = scrollHeight2 + 200;
      }
    } else {
      let chatContent = document.getElementById(
        "ChatContent"
      ) as HTMLDivElement;
      let scrollHeight = chatContent.scrollHeight;
      chatContent.scrollTop = scrollHeight + 200;
    }
    clearTimeout(timerId);
  }, time);
}
// 开启信息状态定时器
function sendFailed(msg: any) {
  msgTimer = setTimeout(() => {
    conversition.forEach((x: any) => {
      if (x.NoCode !== null && x.NoCode === msg.NoCode) {
        x.State = -1;
      }
    });
    sendState.value = true;
  }, 20000);
}
//加载动画
function showLoading() {
  Toast.loading({
    duration: 0,
    message: "",
    forbidClick: true,
  });
}
// 2.发送信息
function sendMsg(data: any) {
  $socket.emit("sendMsg", data);
  sendFailed(data);
}
// 发送消息模板
function toSendInfo(data: any) {
  /*
   * identity:【0：机器人】【1：客服】 【2：顾客】
   * type:【0:文本】 【1:图片】 【2:表情】 【3:商品卡片/订单卡片】
   * */
  conversition.push({
    // 发送者 Id
    SendId: data.SendId,
    // 接收方id
    ReviceId: data.ReviceId,
    // 发送内容
    Content: data.Content,
    // 身份识别 【0：机器人】【1：客服】 【2：顾客】
    Identity: data.Identity,
    // 信息类型 ：0 文本，1 图片，2 表情，3 商品卡片/订单卡片，4 机器人回复
    Type: data.Type,
    // 信息发送状态
    State: data.State,
    // 发送者时间戳
    timeStmp: data.timeStmp,
    // 发送者 socketId
    socketId: data.socketId,
    // 	发送信息时间
    CreateDateUtc: data.CreateDate,
    // 推送卡片-标题
    Title: data.Title,
    // 推送卡片-描述
    Description: data.Description,
    // 推送卡片-标签
    Label: data.Label,
    // 推送卡片-图片
    Thumbnail: data.Thumbnail,
    // 卡片标题
    noSend: true,
  });

  toBottom(100);
}
//弹屏提示
function showMsg(msg: string) {
  Toast(msg);
}
//1.信息组装
function signalrService(
  content: any,
  identity: any,
  type: any,
  isSend2Other = true,
  isRobot = false
) {
  if (sendState.value) {
    let createDate = nowTime();
    // 时间戳
    let timeStmp = +new Date();
    // 信息模板
    const infoTemplate = {
      SendId: sender.id,
      ReviceId: isRobot ? 0 : revicer.id,
      Content: content,
      Identity: identity,
      Type: type,
      // 在线或者不在线，1不在线，0在线
      State: isRobot || !sender.onlineState ? 1 : 0,
      timeStmp: timeStmp,
      socketId: revicer.socketId,
      CreateDateUtc: createDate,
      Title: null,
      Description: null,
      Label: null,
      Thumbnail: null,
      NoSend: true,
    };
    toSendInfo(infoTemplate);
    if (isSend2Other) {
      sendMsg(infoTemplate);
    }
    sendState.value = isRobot || !sender.onlineState ? true : false;
    // 如果type 不是表情
    if (type !== 2) {
      sendInfo.value = "";
    }
    toBottom(100);
  } else {
    showMsg("发送太快啦，请稍后再试");
  }
}
//初始化
function init() {
  // 从router里边获取id
  if ($route.query.sendId) {
    sender.id = parseInt($route.query.sendId as string, 10);
  } else {
    alert("请添加sendId参数");
    return false;
  }
  // 获取用户的信息
  let userInfo = $store.state.userList.filter((x) => x.id === sender.id)[0];
  Object.assign(fastReplay, $store.state.fastReply);
  if (userInfo) {
    sender.name = userInfo.name;
    sender.isService = userInfo.isService;
    sender.receptNum = userInfo.receptNum;
    // 修改昵称时的临时记录昵称
    // temporaryUserName.value = userInfo.name;
    // 修改接待用户数量时的临时记录接待用户数量
    // temporaryReceptNumber.value = userInfo.receptNum;
  } else {
    alert("请保证sendId参数在userList.json文件中存在");
    return false;
  }
  // 发送欢迎语
  let welCome = $store.state.robotReply.filter(
    (x) => x.Answer.indexOf("欢迎语") !== -1
  );
  if (welCome.length > 0) {
    // 初始化的时候，发送显示语，1是机器人，0是文字，false没有发送给别人
    signalrService(welCome[0].Reply, 1, 0, false);
  }
}
function reciveFromRobo(data: { flag: boolean; content: any }) {
  if (data.flag) {
    signalrService(data.content, 1, 4, false);
  } else {
    signalrService(data.content, 1, 0, false);
  }
}
function changOrShowMsg(data: any) {
  sendState.value = true;
  clearTimeout(msgTimer);
  conversition.forEach((x) => {
    if (x.NoCode != null && x.NoCode == data.NoCode) {
      x.State = 1;
    }
  });
}
</script>
<template>
  <div v-cloak class="chat-new">
    <!--顾客窗口开始-->
    <div v-if="!sender.isService">
      <!--聊天内容窗口-->
      <ChatBox
        :conversition="conversition"
        :sender="sender"
        :revicer="revicer"
        @toBottom="toBottom"
        @showMsg="showMsg"
        @signalrService="signalrService"
      ></ChatBox>
      <!--底部浮动内容-->
      <div id="floatDiv" class="floatDiv">
        <Bottom
          :sendInfo="sendInfo"
          :sender="sender"
          :revicer="revicer"
          @updataSendInfo="updataSendInfo"
          @toBottom="toBottom"
          @toSendInfo="toSendInfo"
          @showMsg="showMsg"
          @signalrService="signalrService"
        ></Bottom>
      </div>
    </div>
    <Servie
      :sender="sender"
      :revicer="revicer"
      :currentSessionPeople="currentSessionPeople"
      :currentHasPeople="currentHasPeople"
      :offLineSessionPeople="offLineSessionPeople"
      @updateSender="updateSender"
    ></Servie>
  </div>
</template>
<style scoped lang="scss">
.chat-new {
  background-color: #f5f5f5;
}
.floatDiv {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: auto;
}

// @import url("../assets/CSS/chat.css");
// @import url("../assets/CSS/service.css");
</style>
