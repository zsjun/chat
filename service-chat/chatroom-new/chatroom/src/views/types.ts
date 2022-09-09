export const initSender = {
  id: 0,
  // 是否客服，1是客服，0是用户
  isService: 0,
  // 发送者姓名
  name: "",
  // 在线状态
  onlineState: false,
  // 用户 socketId
  socketId: "",
  // 来源
  source: "",
  // 手机号
  mobile: "",
  // 昵称
  nickName: "",
  // 卡号
  cardNo: "",
  // 接待用户数量
  receptNum: 0,
};
export type senderType = typeof initSender;

export const initRevicer = {
  id: 0,
  isService: 0,
  name: "",
  socketId: "",
  source: "",
  mobile: "",
  nickName: "",
  cardNo: "",
  receptNum: 0,
};
export type revicerType = typeof initRevicer;
