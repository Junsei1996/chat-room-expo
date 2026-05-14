export type RoomCategory = "Tech" | "Gaming" | "Study" | "Random" | "Startups";
export type RoomPrivacy = "Public" | "Private";

export type Room = {
  id: string;
  name: string;
  description: string;
  category: RoomCategory;
  members: number;
  online: number;
  lastMessage: string;
  lastActive: string;
  code: string;
  privacy: RoomPrivacy;
};

export type Message = {
  id: string;
  roomId: string;
  senderName: string;
  senderId: string;
  senderInitials: string;
  text?: string;
  image?: string;
  sentAt: string;
  isCurrentUser: boolean;
};

export const categories: RoomCategory[] = [
  "Tech",
  "Gaming",
  "Study",
  "Random",
  "Startups",
];

export const mockRooms: Room[] = [
  {
    id: "1",
    name: "Launch Lab",
    description: "Share product ideas and launch feedback in real time.",
    category: "Startups",
    members: 128,
    online: 12,
    lastMessage: "Mia: Finalized the feature list for Monday.",
    lastActive: "2m ago",
    code: "LAUNCH",
    privacy: "Public",
  },
  {
    id: "2",
    name: "Dev Den",
    description: "Daily coding sessions, reviews, and growth hacks.",
    category: "Tech",
    members: 297,
    online: 18,
    lastMessage: "Noah: Want to pair on the hook API?",
    lastActive: "5m ago",
    code: "CODEX",
    privacy: "Public",
  },
  {
    id: "3",
    name: "Study Circle",
    description: "Focused study sprints, notes, and productivity tips.",
    category: "Study",
    members: 84,
    online: 9,
    lastMessage: "Ava: Ready for the next sprint?",
    lastActive: "8m ago",
    code: "FOCUS",
    privacy: "Private",
  },
  {
    id: "4",
    name: "Game Night",
    description: "Strategy, co-op, and new release hype for gamers.",
    category: "Gaming",
    members: 54,
    online: 21,
    lastMessage: "Luca: Who wants to join ranked?",
    lastActive: "Just now",
    code: "PLAY4",
    privacy: "Public",
  },
  {
    id: "5",
    name: "Random Bytes",
    description: "Off-topic chats, memes, and creative inspiration.",
    category: "Random",
    members: 62,
    online: 4,
    lastMessage: "Mia: Check out this new playlist.",
    lastActive: "12m ago",
    code: "RANDOM",
    privacy: "Public",
  },
];

export const roomMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      roomId: "1",
      senderName: "Mia",
      senderId: "u1",
      senderInitials: "M",
      text: "Finalized the feature list for Monday.",
      sentAt: "2m ago",
      isCurrentUser: false,
    },
    {
      id: "m2",
      roomId: "1",
      senderName: "You",
      senderId: "u0",
      senderInitials: "Y",
      text: "Love it! I can add the onboarding flow today.",
      sentAt: "1m ago",
      isCurrentUser: true,
    },
  ],
  "2": [
    {
      id: "m3",
      roomId: "2",
      senderName: "Noah",
      senderId: "u2",
      senderInitials: "N",
      text: "Want to pair on the hook API?",
      sentAt: "5m ago",
      isCurrentUser: false,
    },
    {
      id: "m4",
      roomId: "2",
      senderName: "You",
      senderId: "u0",
      senderInitials: "Y",
      text: "Sure, I can join in 10 minutes.",
      sentAt: "4m ago",
      isCurrentUser: true,
    },
  ],
  "3": [
    {
      id: "m5",
      roomId: "3",
      senderName: "Ava",
      senderId: "u3",
      senderInitials: "A",
      text: "Ready for the next sprint?",
      sentAt: "8m ago",
      isCurrentUser: false,
    },
    {
      id: "m6",
      roomId: "3",
      senderName: "You",
      senderId: "u0",
      senderInitials: "Y",
      text: "Yes! Let’s review the notes first.",
      sentAt: "6m ago",
      isCurrentUser: true,
    },
  ],
  "4": [
    {
      id: "m7",
      roomId: "4",
      senderName: "Luca",
      senderId: "u4",
      senderInitials: "L",
      text: "Who wants to join ranked?",
      sentAt: "Just now",
      isCurrentUser: false,
    },
    {
      id: "m8",
      roomId: "4",
      senderName: "You",
      senderId: "u0",
      senderInitials: "Y",
      image:
        "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80",
      sentAt: "Just now",
      isCurrentUser: true,
    },
  ],
  "5": [
    {
      id: "m9",
      roomId: "5",
      senderName: "Mia",
      senderId: "u1",
      senderInitials: "M",
      text: "Check out this new playlist.",
      sentAt: "12m ago",
      isCurrentUser: false,
    },
  ],
};

export const joinCodes: Record<string, string> = {
  LAUNCH: "1",
  CODEX: "2",
  FOCUS: "3",
  PLAY4: "4",
  RANDOM: "5",
};

export const userProfile = {
  name: "Ava Chen",
  username: "@avachen",
  joinedRooms: 14,
  messagesSent: 326,
  bio: "Building fast, friendly chat experiences.",
};
