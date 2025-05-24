import { useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateWithTime, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface MessageListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  otherUser: any;
}

export default function MessageList({ messages, isLoading, otherUser }: MessageListProps) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <div
                className={`mx-2 p-3 rounded-lg ${
                  i % 2 === 0
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-gray-100 rounded-tl-none"
                }`}
              >
                <Skeleton className={`h-4 w-40 ${i % 2 === 0 ? "bg-primary-dark" : "bg-gray-200"}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p className="mb-2">No messages yet.</p>
          <p>Start the conversation by sending a message below.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex mb-4 ${
            message.senderId === user?.id ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex items-start max-w-[80%] ${
              message.senderId === user?.id ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={message.senderId === user?.id ? user?.profileImage : otherUser?.profileImage}
                alt={message.senderId === user?.id ? user?.username : otherUser?.username}
              />
              <AvatarFallback>
                {message.senderId === user?.id
                  ? getInitials(user?.firstName || "", user?.lastName || "")
                  : getInitials(otherUser?.firstName || "", otherUser?.lastName || "")}
              </AvatarFallback>
            </Avatar>
            <div className="mx-2">
              <div
                className={`p-3 rounded-lg ${
                  message.senderId === user?.id
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-gray-100 rounded-tl-none"
                }`}
              >
                <p>{message.content}</p>
              </div>
              <p
                className={`text-xs text-gray-500 mt-1 ${
                  message.senderId === user?.id ? "text-right" : ""
                }`}
              >
                {formatDateWithTime(message.sentAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
