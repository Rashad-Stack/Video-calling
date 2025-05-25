import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useContext from "@/hooks/useContext";
import { Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function CallNotification() {
  const { ongoingCall } = useContext();

  if (!ongoingCall?.isCalling) return;

  console.log("ongoingCall", ongoingCall);

  return (
    <Dialog defaultOpen={true}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Incoming Call</DialogTitle>
          <DialogDescription className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 flex-col bg-gray-200 rounded-lg py-4 cursor-pointer w-fit my-5">
              <Avatar className="w-48">
                <AvatarImage src={ongoingCall?.participants.caller.avatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {ongoingCall?.participants?.caller?.name}
            </div>

            <div className="flex gap-2 flex-col w-full">
              <Button className="bg-green-500 w-full cursor-pointer">
                <Phone size={48} className="text-white text-4xl " />
              </Button>
              <Button className="bg-red-500 w-full  cursor-pointer">
                <Phone size={48} className="text-white text-4xl rotate-180" />
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
