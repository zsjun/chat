function nowTime() {
  const myDate = new Date();
  //获取当前年
  const year = myDate.getFullYear();
  //获取当前月
  const month = myDate.getMonth() + 1;
  //获取当前日
  const date = myDate.getDate();
  const h = myDate.getHours(); //获取当前小时数(0-23)
  const m = myDate.getMinutes(); //获取当前分钟数(0-59)
  const s = myDate.getSeconds();
  const t = myDate.getMilliseconds();
  const now =
    year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s + ":" + t;
  return now;
}
export default nowTime;
