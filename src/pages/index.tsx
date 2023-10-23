import { useEffect, useState } from "react";
import { io } from "socket.io-client/debug";
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
  }, []);
  const socketInitializer = async () => {
    await fetch("api/socket");
    socket = io();
    socket.on("broadcastUserInfoToOther", (mess: string) => {
      let newUser: any = joinedUserInfo;
      console.log(mess);
      newUser.push(mess);
      handleUser(newUser);
      // setIsUserJoined(true);
    });
  };

  const { handleSubmit, register, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    socket.emit("sendUserInfo", data?.name);
    // joinedUserInfo.push(data?.name);
    if (data?.name) setIsUserJoined(true);
    reset();
  };

  const handleUser = (val: any) => {
    setJoinedUserInfo(val);
  };
  return (
    <div className="w-100 h-100 bg-[#E1E1E1] justify-center flex justify-items-center items-center  flex-col rounded">
      <Videoplayer />
      {isUserJoined ? (
        <>
          <h3>Joined Users</h3>
          <ol>
            {/* {console.log(joinedUserInfo)} */}
            {joinedUserInfo && joinedUserInfo.map((user) => <li>{user}</li>)}
          </ol>
        </>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-5 justify-center items-center"
        >
          {" "}
          <div className="flex flex-col mb-5 justify-start ">
            <label
              htmlFor="name"
              className="text-2xl mb-2  p-2 font-['Sansita']"
            >
              Please Enter Your Name To Join Meeting
            </label>
            <input
              type="text"
              {...register("name")}
              id="name"
              className="w-[602px] h-[60px] rounded-xl text-3xl shadow-[0px 5px 5px 0px rgba(0, 0, 0, 0.75)]"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#13A7FA] h-[82px] w-[247px] text-[40px] font-['Roboto']"
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}
