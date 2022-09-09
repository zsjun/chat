<script setup lang="ts">
import { ref, reactive, toRefs, inject, onMounted } from "vue";
import headPng from "@/assets/Images/service/serviceImg.png";
import { revicerType, senderType } from "../types";
import { Toast } from "vant";

const props = defineProps<{
  changeUserName: boolean;
  showLoginBtn: boolean;
  sender: senderType;
  changeReceptNumber: boolean;
  temporaryUserName: string;
  revicer: revicerType;
  isSelectSession: boolean;
}>();

const {
  changeUserName,
  sender,
  revicer,
  changeReceptNumber,
  temporaryUserName,
  showLoginBtn,
  isSelectSession,
} = toRefs(props);

const $socket: any = inject("$socket");
const updateSender: any = inject("updateSender");
const toSendInfo: any = inject("toSendInfo");
onMounted(() => {
  // 加入会话成功
  $socket.on("joinSuccess", joinSuccess);
  $socket.on("offSuccess", offSuccess);
});
//修改在线状态
function changeOnLine() {
  if (!sender.value.onlineState) {
    showLoading();
    $socket.emit("joinChat", {
      SendId: sender.value.id,
      SendName: sender.value.name,
      ReviceId: -1,
      ReviceName: revicer.value.name,
      IsService: true,
      // NoCode: noCode,
    });
  } else {
    //离线
    showLoading();
    // isSelectSession = false;
    $socket.emit("offLine", {
      SendId: sender.value.id,
      // NoCode: noCode,
    });
  }
}

//客服离线成功
function offSuccess(data: any) {
  closeLoad();
  // currentSessionPeople = data.Users;
  if (
    !sender.value.isService &&
    sender.value.onlineState &&
    revicer.value.id === data.SendId
  ) {
    const infoTemplate = {
      SendId: 0,
      ReviceId: 0,
      Content: "当前客服已离线",
      Identity: 3,
      Type: 0,
      State: 1,
      NoCode: null,
      OutTradeNo: null,
      CreateDateUtc: null,
      Title: null,
      Description: null,
      Label: null,
      Thumbnail: null,
      NoSend: true,
    };
    toSendInfo(infoTemplate);
    updateSender({
      onlineState: false,
    });
  } else if (sender.value.isService) {
    updateSender({
      onlineState: !sender.value.onlineState,
    });
    // currentSessionPeople = [];
    // offLineSessionPeople = [];
  }
}
function joinSuccess(data: any) {
  closeLoad();

  if (data.user.SendId === sender.value.id && sender.value.isService) {
    // sender.value.onlineState = true;
    updateSender({ onlineState: true });
  }
}
function showLoading() {
  Toast.loading({
    duration: 0,
    message: "",
    forbidClick: true,
  });
}
function closeLoad() {
  Toast.clear();
}
</script>

<template>
  <div class="BoxHead">
    <div class="headImg">
      <img :src="headPng" />
    </div>
    <div v-if="!changeUserName" class="internetName">
      客服:{{ sender.name }}
    </div>
    <input v-else v-model="temporaryUserName" style="margin-top: 14px" />
    <div
      v-if="!changeUserName"
      class="internetName changeNameBtn"
      v-on:click="changeUserName = true"
    >
      修改
    </div>
    <div v-else class="internetName changeNameBtn">保存</div>
    <div
      v-if="!changeReceptNumber"
      class="internetName"
      style="margin-left: 10px"
    >
      接待人数:{{ sender.receptNum }}
    </div>
    <input
      v-else
      type="number"
      value=""
      style="margin-top: 14px; width: 50px; margin-left: 10px"
    />
    <div
      v-if="!changeReceptNumber"
      class="internetName changeNameBtn"
      @click="changeReceptNumber = true"
    >
      修改
    </div>
    <div v-else class="internetName changeNameBtn">保存</div>
    <div v-show="showLoginBtn" class="internetName" style="margin-left: 20px">
      在线状态
    </div>
    <div v-show="showLoginBtn" style="margin-top: 13px; margin-left: 5px">
      <van-switch
        :model-value="sender.onlineState"
        active-color="#25AEF3"
        inactive-color="#F1F3F4"
        size="24px"
        id="onLine"
        @click="changeOnLine"
      />
    </div>
    <div v-show="showLoginBtn" class="internetName" style="margin-left: 5px">
      {{ sender.onlineState ? "在线" : "离线" }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("../../assets/CSS/service.css");
.box {
  position: relative;
}
</style>
