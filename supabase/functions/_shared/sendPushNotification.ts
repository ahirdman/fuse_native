export interface PushNotificationMessage {
  to: string;
  sound: string;
  title: string;
  body: string;
  data: Record<string, string | number>;
}

interface SendPushNotificationArgs {
  message: PushNotificationMessage;
}

export async function sendPushNotification(
  { message }: SendPushNotificationArgs,
) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
