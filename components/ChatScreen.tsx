
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import Icon from './Icon';
import { Message } from '../types';
import { generateRomanticMessage } from '../services/geminiService';

const EMOJIS = ['❤️', '😂', '😍', '😊', '😭', '😘', '👍', '✨', '🎉', '🤔', '👋', '🙏'];

const ChatScreen: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { users, messages, setMessages } = context;
    const [newMessage, setNewMessage] = useState('');
    const [activeUser, setActiveUser] = useState(users[0].name);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages, typingUser]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        // Mark previous messages from the other user as read
        const updatedMessages = messages.map(msg => 
            msg.sender !== activeUser && !msg.read ? { ...msg, read: true } : msg
        );

        const message: Message = {
            id: new Date().toISOString(),
            text: newMessage,
            sender: activeUser,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
        };
        setMessages([...updatedMessages, message]);
        setNewMessage('');
        setShowEmojiPicker(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingUser(null);
    };
    
    const handleGenerateMessage = async () => {
        setIsGenerating(true);
        const romanticMessage = await generateRomanticMessage();
        setNewMessage(romanticMessage);
        setIsGenerating(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setTypingUser(activeUser);
        typingTimeoutRef.current = window.setTimeout(() => {
            setTypingUser(null);
        }, 2000);
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] lg:max-h-[calc(100vh-4rem)]">
            <h1 className="text-3xl font-bold text-text-main mb-4">Our Chat</h1>
            <div className="flex items-center mb-4 p-2 bg-white rounded-lg shadow">
                <span className="mr-2 text-text-light">Sending as:</span>
                <div className="flex items-center space-x-2">
                {users.map(user => (
                    <button key={user.id} onClick={() => setActiveUser(user.name)} className={`px-3 py-1 rounded-full text-sm font-semibold transition ${activeUser === user.name ? 'bg-secondary text-white' : 'bg-primary/50 text-accent'}`}>
                        {user.name}
                    </button>
                ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-primary/20 rounded-t-lg shadow-inner">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-text-light">Say something sweet to start the conversation...</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex mb-4 animate-fade-in ${msg.sender === users[0].name ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow ${msg.sender === users[0].name ? 'bg-primary text-text-main rounded-bl-none' : 'bg-secondary text-white rounded-br-none'}`}>
                                <p className={`font-bold text-sm ${msg.sender === users[0].name ? 'text-accent' : 'text-white/90'}`}>{msg.sender}</p>
                                <p className="text-base break-words mt-1">{msg.text}</p>
                                <div className="flex justify-end items-center text-xs mt-1 opacity-80">
                                    {msg.sender === activeUser && msg.read && <Icon name="check-check" className="w-4 h-4 mr-1 text-blue-500" />}
                                    <span>{msg.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {typingUser && typingUser !== activeUser && (
                    <div className="flex mb-4 justify-start">
                        <div className="px-4 py-3 rounded-2xl bg-primary text-text-main rounded-bl-none inline-flex items-center shadow">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-text-light/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-text-light/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-text-light/70 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>

            <div className="relative p-4 bg-white rounded-b-lg shadow-lg">
                 {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 left-4 bg-white p-2 rounded-lg shadow-xl grid grid-cols-6 gap-1 z-10">
                        {EMOJIS.map(emoji => 
                            <button key={emoji} onClick={() => handleEmojiSelect(emoji)} className="text-2xl p-1 rounded-md hover:bg-primary/50 transition">
                                {emoji}
                            </button>
                        )}
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                     <button type="button" onClick={handleGenerateMessage} disabled={isGenerating} className="p-2 text-accent hover:text-heart transition disabled:opacity-50">
                        <Icon name="sparkles" className={isGenerating ? 'animate-spin' : ''} />
                    </button>
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-accent hover:text-heart transition">
                        <Icon name="smile" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-secondary/50 rounded-full focus:ring-accent focus:border-accent"
                    />
                    <button type="submit" className="bg-heart text-white p-3 rounded-full hover:bg-opacity-90 transition transform hover:scale-110">
                        <Icon name="send" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatScreen;