import Pusher from "pusher-js";
export const pusherClient = new Pusher(process.env.MOBEEN_PUSHER_KEY!, {
  cluster: process.env.MOBEEN_PUSHER_CLUSTER!,
});
