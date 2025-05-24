import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { apiRequest } from "@/lib/queryClient";
import { getInitials, calculateTimeAgo } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet';

export default function Messages() {
  const { id } = useParams();
  const otherUserId = id ? parseInt(id) : null;
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(otherUserId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (otherUserId) {
      setSelectedUserId(otherUserId);
    }
  }, [otherUserId]);

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/conversations"],
    enabled: !!user,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: [`/api/messages/${selectedUserId}`],
    enabled: !!user && !!selectedUserId,
  });

  const { data: otherUserData, isLoading: otherUserLoading } = useQuery({
    queryKey: [`/api/users/${selectedUserId}`],
    enabled: !!selectedUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedUserId) throw new Error("No recipient selected");
      return apiRequest("POST", "/api/messages", {
        receiverId: selectedUserId,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${selectedUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (content: string) => {
    sendMessageMutation.mutate(content);
  };

  const handleSelectConversation = (userId: number) => {
    setSelectedUserId(userId);
    navigate(`/messages/${userId}`, { replace: true });
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Messages | BlaBlaShip</title>
        <meta name="description" content="Chat with travelers and package senders on BlaBlaShip." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                {conversationsLoading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations && conversations.length > 0 ? (
                  <div className="divide-y">
                    {conversations.map((conversation: any) => (
                      <div
                        key={conversation.userId}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedUserId === conversation.userId ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleSelectConversation(conversation.userId)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={conversation.user?.profileImage}
                              alt={conversation.user?.username}
                            />
                            <AvatarFallback>
                              {conversation.user
                                ? getInitials(
                                    conversation.user.firstName,
                                    conversation.user.lastName
                                  )
                                : "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {conversation.user
                                ? `${conversation.user.firstName} ${conversation.user.lastName}`
                                : "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.latestMessage.content}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {calculateTimeAgo(conversation.latestMessage.sentAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>No conversations yet.</p>
                    <p className="mt-1 text-sm">
                      Start by contacting a traveler or package sender.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-2/3">
            {selectedUserId ? (
              <Card className="h-full flex flex-col" style={{ minHeight: "600px" }}>
                <CardHeader className="p-4 flex-shrink-0">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 md:hidden"
                      onClick={() => navigate("/messages")}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {otherUserLoading ? (
                      <div className="flex items-center space-x-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                      </div>
                    ) : otherUserData ? (
                      <div className="flex items-center">
                        <Avatar className="mr-2">
                          <AvatarImage
                            src={otherUserData.profileImage}
                            alt={otherUserData.username}
                          />
                          <AvatarFallback>
                            {getInitials(otherUserData.firstName, otherUserData.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">
                          {otherUserData.firstName} {otherUserData.lastName}
                        </CardTitle>
                      </div>
                    ) : (
                      <CardTitle>Conversation</CardTitle>
                    )}
                  </div>
                </CardHeader>
                <Separator />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <MessageList
                    messages={messages}
                    isLoading={messagesLoading}
                    otherUser={otherUserData}
                  />
                  <MessageInput
                    onSendMessage={handleSendMessage}
                    isLoading={sendMessageMutation.isPending}
                  />
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center" style={{ minHeight: "600px" }}>
                <CardContent className="text-center text-gray-500">
                  <p className="mb-2">Select a conversation</p>
                  <p className="text-sm">or start a new one from a user's profile</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
