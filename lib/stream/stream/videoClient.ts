import { StreamVideoClient } from "@stream-io/video-client";

export function createVideoClient(userId: string, token: string) {
  return new StreamVideoClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    user: { id: userId },
    token,
  });
}