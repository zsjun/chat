<script setup lang="ts">
import { ref, reactive } from "vue";
</script>

<template>
  <div v-show="isSelectSession" class="conRight">
    <!--会话头部-->
    <div class="Righthead">
      <div class="headName">{{ revicer.name }}</div>
    </div>
    <!--聊天内容-->
    <div v-if="isSelectSession" class="RightCont" id="RightCont">
      <div v-if="lastSession">
        <div class="moreSession pcMoreSession" v-on:click="loadMore">
          加载更多
        </div>
      </div>
      <div v-else>
        <div class="moreSession pcMoreSession">已加载全部</div>
      </div>
      <template
        v-for="(item, index) in conversition.filter(
          (x) =>
            (x.SendId == sender.id && x.ReviceId == revicer.id) ||
            (x.ReviceId == sender.id && x.SendId == revicer.id)
        )"
      >
        <div :key="index" v-if="item.Identity == 1">
          <div class="myselfDiv">
            <div v-if="item.State == 0">
              <van-loading
                v-if="item.Type == 1"
                type="spinner"
                class="myselfImageLoad"
                size="24px"
              ></van-loading>
              <van-loading
                v-else
                type="spinner"
                class="myselfLoad"
                size="24px"
              ></van-loading>
            </div>
            <div v-else-if="item.State == -1">
              <span v-if="item.Type == 1" class="sendImageError">!</span>
              <span v-else class="sendError">!</span>
            </div>
            <div v-if="item.Type == 0" class="news">
              <img class="jiao" src="../assets/Images/service/radio.jpg" />
              {{ item.Content }}
            </div>
            <div v-else-if="item.Type == 2" class="news">
              <img class="jiao" src="../assets/Images/service/radio.jpg" />
              <img v-bind:src="item.Content" />
            </div>
            <img
              v-else-if="item.Type == 1"
              style="margin-right: -15px"
              class="yourSendImage"
              v-bind:src="item.Content"
              @load="loadOverImg"
              preview="1"
            />
            <div v-else-if="item.Type == 3" class="news">
              <img class="jiao" src="../assets/Images/service/radio.jpg" />
              <div class="goods-wrap" v-on:click="openCard(item.Content)">
                <div class="goods-thum">
                  <img :src="item.Thumbnail" />
                </div>
                <div class="goods-detail">
                  <p class="goods-title" :title="item.Title">
                    {{ item.Title }}
                  </p>
                  <p class="goods-abstract" :title="item.Description">
                    {{ item.Description }}
                  </p>
                  <p class="goods-label" :title="item.Label">
                    <span class="rmb-icon"></span>{{ item.Label }}
                  </p>
                </div>
              </div>
            </div>
            <div class="nesHead">
              <img v-bind:src="customerServiceImage" />
            </div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div
          :key="index"
          v-else-if="item.SendId == revicer.id && item.Identity == 2"
        >
          <div v-if="item.State == 1" class="customerServiceDiv">
            <div class="answerHead">
              <img v-bind:src="myselfImage" />
            </div>
            <div v-if="item.Type == 0" class="answers">
              <img
                class="jiao"
                src="../assets/Images/service/other_radio.jpg"
              />
              {{ item.Content }}
            </div>
            <div v-else-if="item.Type == 2" class="answers">
              <img
                class="jiao"
                src="../assets/Images/service/other_radio.jpg"
              />
              <img v-bind:src="item.Content" />
            </div>
            <img
              v-else-if="item.Type == 1"
              class="yourSendImage"
              style="margin-left: 0"
              v-bind:src="item.Content"
              @load="loadOverImg"
              preview="1"
            />
            <div v-else-if="item.Type == 3" class="cardAnswers">
              <img
                class="jiao"
                src="../assets/Images/service/other_radio.jpg"
              />
              <div class="goods-wrap" v-on:click="openCard(item.Content)">
                <div class="goods-thum">
                  <img :src="item.Thumbnail" />
                </div>
                <div class="goods-detail">
                  <p class="goods-title" :title="item.Title">
                    {{ item.Title }}
                  </p>
                  <p class="goods-abstract" :title="item.Description">
                    {{ item.Description }}
                  </p>
                  <p class="goods-label" :title="item.Label">
                    <span class="rmb-icon"></span>{{ item.Label }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div :key="index" v-else-if="item.Identity == 3">
          <div class="otherDiv">
            <span>{{ item.Content }}</span>
          </div>
        </div>
        <div :key="index" v-else-if="item.Identity == 4">
          <div class="consultGuide">
            <div class="consultGuideDiv">{{ item.content.title }}</div>
            <template v-for="(questionItem, index) in item.Content.questions">
              <a
                :key="index"
                class="aQuestion"
                v-bind:href="questionItem.href"
                >{{ questionItem.question }}</a
              >
            </template>
          </div>
        </div>
      </template>
    </div>
    <!--聊天框底部-->
    <div class="RightFoot">
      <div v-show="!allowSession" class="notAllowSeesion"></div>
      <div class="sendContent">
        <!--表情包-->
        <div v-show="expressionShow" class="emjon">
          <ul>
            <template v-for="(item, index) in expressions">
              <li :key="index">
                <img
                  class="serviceSendExpression"
                  v-bind:src="item.image"
                  v-bind:title="item.title"
                  v-on:click="toSend(item.image, 1, 2)"
                />
              </li>
            </template>
          </ul>
        </div>
        <!--工具栏-->
        <div class="footTop">
          <ul>
            <li v-on:click="changeExpression">
              <img src="../assets/Images/service/pc_expression.jpg" />
            </li>
            <li
              v-on:click="expressionShow = false"
              class="ExP"
              style="position: relative"
            >
              <img src="../assets/Images/service/pc_upload.jpg" />
              <input
                ref="referenceUpload"
                class="FileImage serviceFileImage"
                name="customerService"
                type="file"
                value=""
                v-on:change="sendImage"
              />
            </li>
          </ul>
        </div>
        <!--发送内容-->
        <div style="height: calc(100% - 70px)">
          <textarea
            v-on:focus="expressionShow = false"
            id="dope"
            v-model="sendInfo"
            class="textBox"
            :placeholder="allowSession ? '请输入会话内容' : '当前会员已下线'"
            v-on:keyup.enter="enterSend"
          ></textarea>
          <button
            class="sendBtn"
            id="serviceSendBtn"
            v-on:click="toSend(sendInfo, 1, 0)"
          >
            发送(s)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
}
</style>
