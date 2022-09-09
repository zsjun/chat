<script setup lang="ts">
import { ref, reactive } from "vue";
</script>

<template>
  <div v-if="isSelectSession" class="infoBox">
    <!--工具栏-->
    <div class="serviceTool">
      <div
        v-for="(item, index) in serviceTool"
        :key="index"
        :class="['service_tool', item.id == current_state ? 'active_tool' : '']"
        v-on:click="changeState(item)"
      >
        {{ item.text }}
      </div>
    </div>
    <!--用户信息-->
    <div v-show="current_state == 1" class="infoContent">
      <div>
        <label>访问来源：</label>
        <span>{{ revicer.source }}</span>
      </div>
      <div>
        <label>会员姓名：</label>
        <span>{{ revicer.name }}</span>
      </div>
      <div>
        <label>会员昵称：</label>
        <span>{{ revicer.nickName }}</span>
      </div>
      <div>
        <label>会员手机号：</label>
        <span>{{ revicer.mobile }}</span>
      </div>
      <div>
        <label>会员卡号：</label>
        <span>{{ revicer.cardNo }}</span>
      </div>
    </div>
    <!--快捷回复-->
    <div v-show="current_state == 2" class="infoContent" style="display: block">
      <template v-for="(item, index) in fastReplay">
        <ul :key="index" class="domtree">
          <li>
            <p class="tree-title" v-on:click="selectEasy(item.Id)">
              {{ item.Title }}
            </p>
            <ul v-show="currentEasy == item.Id" style="position: relative">
              <li v-for="(son, index2) in item.SonItem" :key="index2">
                <p
                  class="sonTitle"
                  :title="son.Title"
                  v-bind:data-id="son.Id"
                  v-on:click="selectReplay(son.Title)"
                >
                  {{ son.Title }}
                </p>
                <div class="see_all" name="see_all" v-bind:data-id="son.Id">
                  {{ son.Title }}
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </template>
    </div>
    <!--对接页面-->
    <div v-show="current_state == 3" class="infoContent">
      <iframe
        v-if="abutmentUrl"
        style="width: 100%; height: 100%; border: 0px"
        :src="abutmentUrl"
      ></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
}
</style>
