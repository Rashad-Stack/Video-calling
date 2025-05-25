import { useEffect, useRef } from "react";

interface IVideoContainer {
  isLocalStream?: boolean;
  stream?: MediaStream;
  isOnCall: boolean;
}
export default function VideoContainer({
  isLocalStream,
  stream,
  isOnCall,
}: IVideoContainer) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  return (
    <video
      ref={videoRef}
      className="rounded border w-[800px]"
      autoPlay
      playsInline
      muted={isLocalStream}
    />
  );
}
