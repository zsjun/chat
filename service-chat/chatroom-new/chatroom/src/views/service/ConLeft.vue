<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";
import { senderType } from "../types.js";
import offlinePng from "../../assets/Images/service/offLineImg.png";
import noPeoplePng from "../../assets/Images/service/noPeple.png";

const props = defineProps<{
  sender: senderType;
  currentHasPeople: any;
  currentSessionPeople: any;
  offLineSessionPeople: any[];
}>();

const { offLineSessionPeople = [] } = toRefs(props);
const onlineShow = ref(false);
const offlineShow = !onlineShow.value;
function selectSession(item: object, id: number) {
  console.log(item, id);
}
function closeSeesion(item: object) {
  console.log(111, item);
}
function removeOffLine(item: object, event: Event) {
  console.log(1223);
}
</script>

<template>
  <div class="conLeft">
    <ul v-show="currentHasPeople && sender.onlineState">
      <div class="sessionType" v-on:click="onlineShow = !onlineShow">
        <span v-show="onlineShow">▼</span>
        <span v-show="!onlineShow">▲</span>
        在线会话
      </div>
      <li
        :key="index"
        v-show="onlineShow && item.ReviceId == sender.id"
        style="cursor: pointer"
        v-for="(item, index) in currentSessionPeople"
        @click="selectSession(item, 1)"
        :class="{ isSelect: item.IsSelect }"
        v-on:mouseenter="item.CloseSession = true"
        v-on:mouseleave="item.CloseSession = false"
      >
        <div class="liLeft">
          <img src="../assets/Images/service/customerImg.png" />
        </div>
        <div class="liRight">
          <span class="intername">{{ item.SendName }}</span>
          <span class="infor">{{ item.SessionContent }}</span>
          <div v-show="item.UnRead > 0" class="un_read">
            {{ item.UnRead > 99 ? "99+" : item.UnRead }}
          </div>
          <span
            class="closeSession"
            v-show="item.CloseSession"
            v-on:click.stop="closeSeesion(item)"
            >×关闭</span
          >
        </div>
      </li>
    </ul>
    <ul v-show="offLineSessionPeople.length > 0">
      <div class="sessionType" v-on:click="offlineShow = !offlineShow">
        <span v-show="offlineShow">▼</span>
        <span v-show="!offlineShow">▲</span>
        离线会话
      </div>
      <template
        v-for="(item, index) in offLineSessionPeople"
        :key="item.ReviceId"
      >
        <li
          v-show="offlineShow && item.ReviceId === sender.id"
          style="cursor: pointer"
          @click="selectSession(item, 0)"
          :class="{ isSelect: item.IsSelect }"
          v-on:mouseenter="item.CloseSession = true"
          v-on:mouseleave="item.CloseSession = false"
        >
          <div class="liLeft">
            <img :src="offlinePng" />
          </div>
          <div class="liRight">
            <span class="intername">{{ item.SendName }}</span>
            <span class="infor">{{ item.SessionContent }}</span>
            <div v-show="item.UnRead > 0" class="un_read">
              {{ item.UnRead > 99 ? "99+" : item.UnRead }}
            </div>
            <span
              class="closeSession"
              v-show="item.CloseSession"
              @click="removeOffLine(item, $event)"
              >×关闭</span
            >
          </div>
        </li>
      </template>
    </ul>
    <div v-show="!currentHasPeople" class="noPeople">
      <img :src="noPeoplePng" />
      <div style="text-align: center">正等待被撩...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("../../assets/CSS/chat.css");
.box {
  position: relative;
}
</style>
