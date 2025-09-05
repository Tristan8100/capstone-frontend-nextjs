'use client'

import { useParams } from "next/navigation";
import { database } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api2 } from "@/lib/api";
import Image from "next/image";

export default function ChatPage() {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatDisabled, setChatDisabled] = useState(false);
  const scrollAreaRef = useRef(null);
  const bottomRef = useRef(null);
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState("");

  useEffect(() => {
    if (!params.id) return;

    const checkConversation = async () => {
      try {
        const res = await api2.get<any>(`/api/conversations/${params.id}`);
        if (res.data) {
          if (res.data.admin.id === user.id) {
            console.log('THE ADMIN');
            setOtherUser(res.data.user.profile_path);
          } else { 
            console.log('THE OTHER');
            setOtherUser(res.data.admin.profile_path); 
          }
        }
        console.log(res.data);
        if (res.status === 200) {
          // Conversation exists
          const messagesRef = collection(database, `conversations/${params.id}/messages`);
          const q = query(messagesRef, orderBy("timestamp", "asc"));
  
          const unsubscribe = onSnapshot(q, 
            (snapshot) => {
              const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setMessages(msgs);
              setLoading(false);
            },
            (err) => {
              setError("Failed to load messages");
              setLoading(false);
              console.error("Firestore error:", err);
            }
          );
  
          return unsubscribe;
        } else {
          setError("Conversation not found");
          setChatDisabled(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("API error:", err);
        setError("Conversation not found");
        setChatDisabled(true);
        setLoading(false);
      }
    };

    const unsubscribePromise = checkConversation();

    // Cleanup function for Firebase subscription
    return () => {
      unsubscribePromise.then(unsub => unsub && unsub());
    }
  }, [params.id]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Send new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || chatDisabled) return;

    try {
      await addDoc(collection(database, `conversations/${params.id}/messages`), {
        text: newMessage,
        senderId: user.id,
        senderName: user.name,
        profilePath: user.profile_path,
        timestamp: serverTimestamp()
      });
      setNewMessage("");
      lastMessage(); // Update last message in conversation
    } catch (err) {
      setError("Failed to send message");
      console.error("Send message error:", err);
    }
  };

  const lastMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await api2.put(`/api/conversations-last-message/${params.id}`, {
        last_message: newMessage,
      });

      if (res.status === 200) {
        console.log("Last message updated successfully");
      } else {
        console.error("Update last message error:", res.data);
      }
    } catch (err) {
      console.error("Update last message API error:", err);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-full">Loading messages...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-destructive">Error: {error}</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4 overflow-y-auto"
      >
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 ${msg.senderId === user.id ? "justify-end" : ""}`}
            >
              {msg.senderId !== user.id && (
                <Avatar className="w-12 h-12 rounded-full">
                  <AvatarImage
                    src={otherUser || msg.profilePath}
                    alt={msg.senderName}
                    width={48}
                    height={48}
                  />
                  <AvatarFallback>
                    {msg.senderName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={msg.senderId === user.id ? "text-left" : ""}>
                <div className={`rounded-lg p-3 text-sm ${msg.senderId === user.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.text}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {msg.senderId !== user.id && <span className="mr-2">{msg.senderName}</span>}
                  {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </div>
              </div>

              {msg.senderId === user.id && (
                <Avatar>
                  <AvatarImage src={user.profile_path} alt="You" />
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
        <div ref={bottomRef} className="h-0" />
      </ScrollArea>

      <form onSubmit={sendMessage} className="w-full p-4 border-t bg-background flex gap-2">
        <Input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..." 
          className="flex-1"
          disabled={chatDisabled}
        />
        <Button type="submit" disabled={chatDisabled}>Send</Button>
      </form>
    </div>
  );
}
