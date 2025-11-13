
export interface User {
  id: number;
  name: string;
  online: boolean;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
}

export interface Memory {
  id: string;
  date: string;
  text: string;
  photoUrl?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  read: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}