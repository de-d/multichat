interface User {
  id: number;
  username: string;
  avatar: string;
  is_online: boolean;
}

interface Message {
  message: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  chatId: number;
  partner: User;
  lastMessage?: Message;
  unreadCount: number;
}

interface FormattedChat {
  partnerId: number;
  avatar: string;
  is_online: boolean;
  username: string;
  message: string;
  time: string;
  messageCount: number;
  chatId: number;
}

export { User, Message, Chat, FormattedChat };
