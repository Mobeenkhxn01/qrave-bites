import Pusher from "pusher";
export const pusherServer = new Pusher({
  appId: process.env.MOBEEN_PUSHER_APP_ID!,
  key: process.env.MOBEEN_PUSHER_KEY!,
  secret: process.env.MOBEEN_PUSHER_SECRET!,
  cluster: process.env.MOBEEN_PUSHER_CLUSTER!,
  useTLS: true,
});
