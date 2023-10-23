export default (io: any, socket: any) => {
  const rec = (mess: string) => {
    socket.broadcast.emit("broadcastUserInfoToOther", mess);
  };
  socket.on("sendUserInfo", rec);
};
