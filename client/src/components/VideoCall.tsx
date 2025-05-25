import useContext from "@/hooks/useContext";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import { Button } from "./ui/button";

export default function VideoCall() {
  const { localStream } = useContext();
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [isVidOn, setIsVidOn] = useState<boolean>(false);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()[0];
      videoTracks.enabled = !videoTracks.enabled;
      setIsVidOn(videoTracks.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()[0];
      audioTracks.enabled = !audioTracks.enabled;
      setIsMicOn(audioTracks.enabled);
    }
  }, [localStream]);

  useEffect(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()[0];
      const videoTracks = localStream.getVideoTracks()[0];
      setIsMicOn(audioTracks.enabled);
      setIsVidOn(videoTracks.enabled);
    }
  }, [localStream]);

  return (
    <div className="my-5 flex flex-col items-center">
      <div>
        {localStream && (
          <VideoContainer
            isLocalStream={true}
            stream={localStream}
            isOnCall={false}
          />
        )}
      </div>

      {localStream && (
        <div className="space-x-5 mt-5 max-w-xs mx-auto flex justify-center">
          <Button onClick={toggleMic}>
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </Button>
          <Button onClick={toggleCamera}>
            {isVidOn ? <Video size={20} /> : <VideoOff size={20} />}
          </Button>
          <Button className="bg-red-500">
            <Phone size={20} className="rotate-138" />
          </Button>
        </div>
      )}
    </div>
  );
}
