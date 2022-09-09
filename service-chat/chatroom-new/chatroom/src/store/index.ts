import { createStore } from "vuex";
import userList from "./userList.json";
import fastReply from "./fastReply.json";
import productList from "./product.json";
import messageList from "./messageList.json";
import robotReply from "./robotReply.json";

//仿数据库数据

const store = createStore({
  state() {
    return {
      userList: userList,
      fastReply: fastReply,
      productList: productList,
      messageList: messageList,
      robotReply: robotReply,
    };
  },
  mutations: {
    increment(state) {
      // state.count++;
    },
  },
  actions: {
    increment(context) {
      // context.commit("increment");
    },
  },
});
export default store;
