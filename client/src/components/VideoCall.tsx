import useContext from "@/hooks/useContext";
import VideoContainer from "./VideoContainer";

export default function VideoCall() {
  const { localStream } = useContext();
  return (
    <div>
      {localStream && (
        <VideoContainer
          isLocalStream={true}
          stream={localStream}
          isOnCall={false}
        />
      )}
    </div>
  );
}
