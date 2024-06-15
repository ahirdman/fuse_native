import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../_shared/database.types.ts";
import {
  PushNotificationMessage,
  sendPushNotification,
} from "../_shared/sendPushNotification.ts";

class PushTokenNotRegisteredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PushTokenNotRegisteredError";
  }
}

type FriendRequestRecord =
  Database["public"]["Tables"]["friend_requests"]["Row"];

interface WebHookPayload {
  type: "INSERT" | "UPDATE";
  table: "friend_requests";
  record: FriendRequestRecord;
  schema: "public";
  old_record: null | FriendRequestRecord;
}

async function handleFriendRequest(req: Request) {
  try {
    const payload: WebHookPayload = await req.json();
    const status = payload.record.status;

    if (status === "rejected") {
      return new Response(
        JSON.stringify({ message: "Request rejected, no op" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization")!,
          },
        },
      },
    );

    let message: PushNotificationMessage | undefined;

    if (status === "pending" && payload.type === "INSERT") {
      message = await createPendingNotification({ supabase, payload });
    }

    if (status === "accepted" && payload.type === "UPDATE") {
      message = await createAcceptedNotification({ supabase, payload });
    }

    if (!message) {
      throw new Error("No notification was created");
    }

    await sendPushNotification({ message });

    return new Response(
      JSON.stringify({ message: "Notification sent", context: message }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    if (error instanceof PushTokenNotRegisteredError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

interface CreateNotificationArgs {
  supabase: SupabaseClient;
  payload: WebHookPayload;
}

async function createPendingNotification(
  { supabase, payload }: CreateNotificationArgs,
): Promise<PushNotificationMessage> {
  const { data: receiverAccount, error: accountError } = await supabase
    .from("accounts")
    .select()
    .eq("id", payload.record.receiver_user_id)
    .single();

  if (accountError) throw accountError;

  if (!receiverAccount.pushToken) {
    throw new PushTokenNotRegisteredError(
      "Receiver has not registered a pushToken",
    );
  }

  const { data: senderProfile, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", payload.record.sender_user_id)
    .single();

  if (profileError) throw profileError;

  return {
    to: receiverAccount.pushToken,
    sound: "default",
    title: `${senderProfile.name} wants to be your friend!`,
    body: `Tap to see ${senderProfile.name}'s invitation`,
    data: { url: "fuse://social" },
  };
}

async function createAcceptedNotification(
  { supabase, payload }: CreateNotificationArgs,
): Promise<PushNotificationMessage> {
  const { data: senderAccount, error: accountError } = await supabase
    .from("accounts")
    .select()
    .eq("id", payload.record.sender_user_id)
    .single();

  if (accountError) throw accountError;

  if (!senderAccount.pushToken) {
    throw new PushTokenNotRegisteredError(
      "Request sender has not registered a pushToken",
    );
  }

  const { data: receiverProfile, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", payload.record.receiver_user_id)
    .single();

  if (profileError) throw profileError;

  return {
    to: senderAccount.pushToken,
    sound: "default",
    title: `${receiverProfile.name} accepted your friend request!`,
    body: `Tap to see ${receiverProfile.name}'s profile`,
    data: { url: "fuse://social" },
  };
}

Deno.serve(handleFriendRequest);
