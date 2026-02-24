'use client';
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { initSocket } from "@/lib/Sockets/socket";
import { Fetchpatients } from "@/lib/Api/Patient/patient_api";
import axios from "axios";
import { Search, Plus, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft, Check, CheckCheck, Image as ImageIcon } from "lucide-react";
import { UploadFile } from "@/lib/Api/Message/Message_Api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Patient {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  gender: string | null;
  country: string;
  city: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "patient" | string;
  isDeleted: boolean;
  socketId: string | null;
  isOnline: boolean;
  messages?: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
}

export interface ChatMessage {
  senderId: number;
  senderName: string;
  text: string;
  time: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchPatients = async () => {
    try {
      const response = (await Fetchpatients("patient")) as Patient[];
      
      if (!user?.id) return;

      // Fetch last message for each patient
      const patientsWithHistory = await Promise.all(
        response.map(async (p: Patient) => {
          try {
            const historyRes = await axios.get(
              "https://sehatyarr-c23468ec8014.herokuapp.com/messages/communication/logs",
              { params: { senderId: user.id, receiverId: p.id } }
            );
            
            const messages = historyRes.data;
            const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
            
            return {
              ...p,
              messages: [], 
              unread: 0,
              lastMessage: lastMsg ? (lastMsg.messageBody || "") : p.lastMessage,
              lastMessageTime: lastMsg ? lastMsg.createdAt : (p.updatedAt || new Date().toISOString())
            };
          } catch (err) {
            console.error(`Failed to fetch history for patient ${p.id}`, err);
            return {
              ...p,
              messages: [],
              unread: 0,
              lastMessageTime: p.updatedAt || new Date().toISOString()
            };
          }
        })
      );

      // Sort by last message time
      const sortedPatients = patientsWithHistory.sort((a, b) => {
        const timeA = new Date(a.lastMessageTime || 0).getTime();
        const timeB = new Date(b.lastMessageTime || 0).getTime();
        return timeB - timeA;
      });

      setPatients(sortedPatients);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedPatientId, patients]);

  const mapApiMessageToChatMessage = (msg: any): ChatMessage => {
    const isCurrentUserSender = msg.sendBy.id === user?.id;
    const text = msg.messageBody || "";

    return {
      senderId: msg.sendBy.id,
      senderName: isCurrentUserSender ? "You" : msg.sendBy.fullName,
      text: text,
      time: msg.createdAt,
    };
  };

  const fetchChatHistory = async (receiverId: number) => {
    if (!user?.id) return;

    try {
      const sentRes = await axios.get(
        "https://sehatyarr-c23468ec8014.herokuapp.com/messages/communication/logs",
        { params: { senderId: user.id, receiverId } }
      );

      console.log("sentRes :",sentRes.data);

      const sentMessages: ChatMessage[] = sentRes.data.map(mapApiMessageToChatMessage);
      const history: ChatMessage[] = [...sentMessages].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );

      setPatients(prev =>
        prev.map(p =>
          p.id === receiverId
            ? {
                ...p,
                messages: history,
                unread: 0,
                lastMessage: history[history.length - 1]?.text || p.lastMessage,
                lastMessageTime: history[history.length - 1]?.time || p.lastMessageTime,
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const socket = initSocket(user.id.toString());
    socketRef.current = socket;

    const handleMessage = (msg: any) => {
      console.log("📩 Incoming message:", msg);

      setPatients((prev) => {
        const updatedPatients = prev.map((p) => {
          if (p.id === msg.senderId || p.id === msg.receiverId) {
            const isActive = p.id === selectedPatientId;
            const text = msg.message || "";

            const newMessage: ChatMessage = {
              senderId: msg.senderId,
              senderName: msg.senderId === parseInt(user?.id?.toString() || "0") ? "You" : p.fullName,
              text,
              time: new Date().toISOString(),
            };
            
            return {
              ...p,
              messages: [...(p.messages || []), newMessage],
              lastMessage: newMessage.text,
              lastMessageTime: newMessage.time,
              unread: isActive ? 0 : (p.unread || 0) + 1,
            };
          }
          return p;
        });
        
        // Sort by lastMessageTime descending
        return updatedPatients.sort((a, b) => {
          const timeA = new Date(a.lastMessageTime || 0).getTime();
          const timeB = new Date(b.lastMessageTime || 0).getTime();
          return timeB - timeA;
        });
      });
    };

    socketRef.current.on("message", handleMessage);

    return () => {
      socketRef.current.off("message", handleMessage);
    };
  }, [user?.id, selectedPatientId]); 

  const sendMessage = async () => {
    if ((!input.trim()) || !user || !selectedPatientId) return;

    const receiver = patients.find(p => p.id === selectedPatientId);
    if (!receiver) return;

    const senderId = parseInt(user.id.toString(), 10);
    
    const payload = {
      message: input,
      senderId,
      receiverId: receiver.id,
      type: 'text',
      isFile: false,
    };

    socketRef.current.emit("message", payload);

    setPatients(prev => {
      const updated = prev.map(p =>
        p.id === selectedPatientId
          ? {
              ...p,
              messages: [
                ...(p.messages || []),
                {
                  senderId,
                  senderName: "You",
                  text: input,
                  time: new Date().toISOString(),
                } as ChatMessage,
              ],
              lastMessage: input,
              lastMessageTime: new Date().toISOString(),
            }
          : p
      );
      return updated.sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime());
    });

    setInput("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedPatientId) return;

    // Upload file to server endpoint and get URL
    const formData = new FormData();
    formData.append('file', file);
    try {
      const uploadRes = await UploadFile(formData)
      console.log(uploadRes)
      const fileUrl = uploadRes.messageBody;

      const senderId = parseInt(user.id.toString(), 10);
      const receiver = patients.find(p => p.id === selectedPatientId);
      if (!receiver) return;

      const payload = {
        message: fileUrl,
        senderId,
        receiverId: receiver.id,
        isFile: true,
      };

      socketRef.current.emit('message', payload);

      // Update UI with file message
      setPatients(prev => {
        const updated = prev.map(p =>
          p.id === selectedPatientId
            ? {
                ...p,
                messages: [
                  ...(p.messages || []),
                  {
                      senderId,
                      senderName: "You",
                      text: fileUrl, // Use URL as text for consistent parsing
                      time: new Date().toISOString(),
                    } as ChatMessage,
                ],
                lastMessage: fileUrl,
                lastMessageTime: new Date().toISOString(),
              }
            : p
        );
        return updated.sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime());
      });
    } catch (err) {
      console.error('File upload failed', err);
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
    if (isMobile) setSidebarOpen(false);
    fetchChatHistory(id);
  };

  const activePatient = patients.find(p => p.id === selectedPatientId);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-card backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-border font-sans relative">
      {/* Background gradient elements - Optional, adapted for theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[35%] h-[35%] rounded-full bg-secondary/10 blur-[80px]" />
      </div>
      
      {/* Sidebar */}
      <div
        className={`md:w-[380px] w-full bg-muted/30 backdrop-blur-md border-r border-border flex flex-col transition-all duration-300 relative z-10
        ${sidebarOpen ? "block" : "hidden md:flex"}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Messages</h2>
                <button className="p-2 bg-background/60 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all text-primary hover:bg-background/80 border border-border">
                    <Plus size={20} />
                </button>
            </div>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-background/60 backdrop-blur-sm border border-border shadow-sm focus:ring-2 focus:ring-primary/30 focus:bg-background/80 transition-all text-sm text-foreground placeholder:text-muted-foreground"
                />
            </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          {patients.filter(p => p.fullName?.toLowerCase().includes(searchQuery.toLowerCase())).map((patient) => (
            <div
              key={patient.id}
              onClick={() => handleSelectPatient(patient.id)}
              className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                selectedPatientId === patient.id
                  ? "bg-accent/70 backdrop-blur-md shadow-sm border border-border/50 scale-[1.02]"
                  : "hover:bg-muted/50 hover:backdrop-blur-sm hover:shadow-sm border border-transparent"
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-border/50 shadow-sm shrink-0">
                    <AvatarImage src={(patient as any).profilePic || (patient as any).patientProfile?.profilePic || (patient as any).profilepicture || (patient as any).profilePicture || ""} alt={patient.fullName} className="object-cover" />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold uppercase">
                        {patient.fullName ? patient.fullName.substring(0, 2) : "U"}
                    </AvatarFallback>
                </Avatar>
                {patient.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-sm truncate ${selectedPatientId === patient.id ? 'text-foreground' : 'text-foreground/90'}`}>
                        {patient.fullName}
                    </h3>
                    {patient.lastMessageTime && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2 bg-background/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            {formatTime(patient.lastMessageTime)}
                        </span>
                    )}
                </div>
                <p className={`text-xs truncate ${patient.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {(() => {
                        const text = patient.lastMessage || "";
                        const callMatch = text.match(/https:\/\/sehatyar\.vercel\.app\/call\?roomId=([^&]+)&type=([^&]+)/);
                        if (callMatch) {
                            const type = callMatch[2];
                            return (
                                <span className="flex items-center gap-1">
                                    {type === 'video' ? <Video size={14} /> : <Phone size={14} />}
                                    {type === 'video' ? "Video Call" : "Audio Call"}
                                </span>
                            );
                        }

                        const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
                        if (urlMatch) {
                             const url = urlMatch[0];
                             const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
                             return (
                                 <span className="flex items-center gap-1">
                                     {isImage ? <ImageIcon size={14} /> : <Paperclip size={14} />}
                                     {isImage ? "Photo" : "Attachment"}
                                 </span>
                             );
                        }
                        return text || "No messages yet";
                    })()}
                </p>
              </div>

              {patient.unread ? (
                <div className="min-w-[20px] h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1.5 shadow-sm shadow-primary/50 border border-background/30 backdrop-blur-sm animate-pulse">
                    {patient.unread}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activePatient ? (
        <div className={`flex-1 flex flex-col bg-background/30 backdrop-blur-md relative z-10 ${!sidebarOpen ? 'block' : 'hidden md:flex'}`}>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/50 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button 
                        className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted hover:backdrop-blur-sm rounded-full transition-all shadow-sm"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                        <Avatar className="w-10 h-10 ring-2 ring-border/50 shadow-sm shrink-0">
                            <AvatarImage src={(activePatient as any).profilePic || (activePatient as any).patientProfile?.profilePic || (activePatient as any).profilepicture || (activePatient as any).profilePicture || ""} alt={activePatient.fullName} className="object-cover" />
                            <AvatarFallback className="bg-primary/20 text-primary font-semibold uppercase">
                                {activePatient.fullName ? activePatient.fullName.substring(0, 2) : "U"}
                            </AvatarFallback>
                        </Avatar>
                        {activePatient.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">{activePatient.fullName}</h3>
                        <span className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-sm ${
                            activePatient.isOnline 
                                ? 'text-green-600 bg-green-100/60 dark:bg-green-900/30 dark:text-green-400' 
                                : 'text-muted-foreground bg-muted/60'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                                activePatient.isOnline ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
                            }`} />
                            {activePatient.isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
                
              
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
                {activePatient.messages?.map((msg, i) => {
                    const isSender = msg.senderId === parseInt(user?.id?.toString() || "0");
                    return (
                        <div key={i} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col max-w-[75%] ${isSender ? 'items-end' : 'items-start'}`}>
                                <div 
                                    className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed backdrop-blur-md ${
                                        isSender 
                                            ? 'bg-primary text-primary-foreground rounded-tr-none border border-primary/20' 
                                            : 'bg-card text-card-foreground border border-border/40 rounded-tl-none'
                                    }`}
                                >
                                    {(() => {
                                        const text = msg.text || "";
                                        const callMatch = text.match(/https:\/\/sehatyar\.vercel\.app\/call\?roomId=([^&]+)&type=([^&]+)/);
                                        
                                        if (callMatch) {
                                            const callRoomId = callMatch[1];
                                            const callType = callMatch[2] as 'video' | 'audio';
                                            return (
                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <div className="flex items-center gap-2 font-semibold">
                                                        {callType === 'video' ? <Video size={20} /> : <Phone size={20} />}
                                                        <span>{callType === 'video' ? 'Video Call' : 'Audio Call'}</span>
                                                    </div>
                                                    <p className="text-xs opacity-80">
                                                        {msg.senderId === parseInt(user?.id?.toString() || "0") ? "You started a call" : "Incoming call..."}
                                                    </p>
                                                    <a 
                                                        href={`https://sehatyar.vercel.app/call?roomId=${callRoomId}&type=${callType}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`mt-2 py-2 px-4 rounded-xl text-center font-semibold text-sm transition-all shadow-md ${
                                                            isSender 
                                                                ? 'bg-background text-primary hover:bg-muted' 
                                                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                        }`}
                                                    >
                                                        Join Call
                                                    </a>
                                                </div>
                                            );
                                        }

                                        const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
                                        if (urlMatch) {
                                            const fileUrl = urlMatch[0];
                                            const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(fileUrl);
                                            
                                            if (isImage) {
                                                return (
                                                    <div className="mb-2 rounded-lg overflow-hidden border border-border/30 shadow-md">
                                                        <Image 
                                                            src={fileUrl} 
                                                            alt="Shared image" 
                                                            width={200} 
                                                            height={200} 
                                                            className="w-full h-auto object-cover"
                                                        />
                                                    </div>
                                                );
                                            } else {
                                                const fileName = fileUrl.split('/').pop() || "Attachment";
                                                return (
                                                    <a
                                                        href={fileUrl}
                                                        download={fileName}
                                                        className="flex items-center gap-2 p-2 bg-background/20 backdrop-blur-sm rounded-lg border border-border/30 hover:bg-background/30"
                                                    >
                                                        <Paperclip size={16} />
                                                        <span className="underline truncate max-w-[150px]">{fileName}</span>
                                                    </a>
                                                );
                                            }
                                        }

                                        return text;
                                    })()}
                                    
                                  
                                </div>
                                <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-background/30 backdrop-blur-sm rounded-full">
                                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.time)}</span>
                                    {isSender && (
                                        <CheckCheck size={12} className="text-primary drop-shadow-sm" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-muted/50 backdrop-blur-xl border-t border-border shadow-sm">
                <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm p-1.5 rounded-3xl border border-border focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-background/90 transition-all shadow-sm">
                    <button 
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-background/80 hover:backdrop-blur-sm rounded-full transition-all shadow-sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip size={20} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                    />
                    
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none appearance-none text-sm text-foreground placeholder:text-muted-foreground px-3 py-2"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    
                    <button
                        className={`p-3 rounded-full transition-all shadow-md border ${
                            input.trim() 
                                ? 'bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg border-primary/30 shadow-primary/30' 
                                : 'bg-muted/60 backdrop-blur-sm text-muted-foreground cursor-not-allowed border-border/20'
                        }`}
                        onClick={sendMessage}
                        disabled={!input.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
      ) : (
        <div className={`flex-1 flex-col items-center justify-center bg-muted/20 backdrop-blur-md relative z-10 ${!sidebarOpen ? 'flex' : 'hidden md:flex'}`}>
            <div className="w-24 h-24 bg-card backdrop-blur-md border border-border rounded-full flex items-center justify-center mb-6 animate-pulse shadow-xl">
                <Send size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Select a conversation</h3>
            <p className="text-muted-foreground text-sm max-w-xs text-center">
                Choose a patient from the sidebar to start chatting or view history.
            </p>
        </div>
      )}
    </div>
  );
}
