import { useEffect, useState } from "react";
const Videoplayer = () => {
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [screenSharingStream, setScreenSharingStream] = useState<any>();
  const gotDevices = (settingName: string) => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos: any) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          let video: any = document.querySelector("#screen");
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
          setIsVideo(true);
        })
        .catch(function (err: any) {
          console.log("No mic for you!", err);
        });
    });
  };
  async function startCapture() {
    try {
      navigator.mediaDevices
        .getDisplayMedia({
          video: { frameRate: 15 },
        })
        .then((stream: any) => {
          setScreenSharingStream(stream);
          let video: any = document.querySelector("#screenSharing");
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
          setIsSharing(true);
        });
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }
  async function stopCapture() {
    screenSharingStream.getTracks().forEach((i: any) => i.stop());
    let video: any = document.querySelector("#screenSharing");
    video.srcObject = null;
    setIsSharing(false);
  }

  useEffect(()=>{
    gotDevices("video")
  },[])
  return (
    <div>
      <h1>Bittu Online Classes</h1>
      <video id="screen" style={{ width: isVideo ? "500px" : "0" }}></video>
      <video
        id="screenSharing"
        style={{ width: isSharing ? "500px" : "0" }}
      ></video>
      <div>
        {/* <button onClick={() => gotDevices("video")}>Get Device</button> */}
        {/* {isVideo && (
          <button onClick={() => (isSharing ? stopCapture() : startCapture())}>
            {isSharing ? "Stop" : "Start"} Screen Sharing
          </button>
        )} */}
      </div>
    </div>
  );
};
export default Videoplayer;
