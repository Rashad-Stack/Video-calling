import CallNotification from "@/components/CallNotification";
import OnlineUserList from "@/components/OnlineUserList";
import VideoCall from "@/components/VideoCall";

export default function Home() {
  return (
    <section>
      <div className="container mx-lg:max-w-6xl mx-auto py-4">
        <OnlineUserList />
        <CallNotification />
        <VideoCall />
      </div>
    </section>
  );
}
