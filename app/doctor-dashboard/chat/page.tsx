"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Search, Plus, Phone, Video, Info, Paperclip, Send, Smile, MoreVertical, ChartBar, MessageCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Messages from "@/components/Messages"
// Mock data for conversations


export default function ChatPage() {
 

  

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-3">
      <Messages/>
    </div>
  )
}
