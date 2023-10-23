import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm, SubmitHandler } from "react-hook-form";
import Videoplayer from "./components/VideoPlayer";
type Inputs = {
  name: string;
};
export default function Home() {
  const [isUserJoined, setIsUserJoined] = useState<boolean>(false);
  const [joinedUserInfo, setJoinedUserInfo] = useState<Array<string>>([]);
  let socket: any;
  useEffect(() => {
    socketInitializer();
  }, [joinedUserInfo]);
  const socketInitializer = async () => {
    await fetch("api/socket");
    socket = io();
    socket.on("broadcastUserInfoToOther", (mess: string) => {
      console.log(mess);
      const arr = [...joinedUserInfo];
      arr.push(mess);
      setJoinedUserInfo(arr);
    });
  };

  const { handleSubmit, register, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    socket.emit("sendUserInfo", data?.name);
    if (data?.name) setIsUserJoined(true);
    reset();
  };

  
  return (
    <div>
      <Videoplayer />
      {isUserJoined ? (
        <>
          <h3>Joined Users</h3>
          <ol>
          
            {joinedUserInfo &&
              joinedUserInfo.map((user) => <li key={user}>{user}</li>)}
          </ol>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">
            Please Enter Your Name To Join Metting : -
          </label>
          <input type="text" {...register("name")} id="name" />
          <button type="submit">Join</button>
        </form>
      )}
    </div>
  );
}
