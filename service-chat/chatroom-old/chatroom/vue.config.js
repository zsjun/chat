module.exports = {
  outputDir: __dirname + "/../../../websocketServer/chatroom",
  publicPath: process.env.NODE_ENV === "production" ? "/chatroom/" : "/",
};
