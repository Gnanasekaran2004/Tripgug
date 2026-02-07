import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm TripBot. How can I help you?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages([...messages, newMsg]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm just a prototype, but I think that sounds great!",
                sender: 'bot'
            }]);
        }, 1000);
    };

    return (
        <>
            <button
                className="btn btn-primary"
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    padding: 0,
                    zIndex: 60,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                }}
                onClick={toggleChat}
            >
                {isOpen ? <X /> : <MessageCircle />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            position: 'fixed',
                            bottom: '170px',
                            right: '20px',
                            width: '300px',
                            height: '400px',
                            background: 'white',
                            borderRadius: '1rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            zIndex: 60,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <div style={{ padding: '1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: '600' }}>
                            Trip Assistant
                        </div>

                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.sender === 'user' ? 'var(--primary)' : '#f1f5f9',
                                        color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '1rem',
                                        borderBottomRightRadius: msg.sender === 'user' ? '4px' : '1rem',
                                        borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '1rem',
                                        maxWidth: '80%'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={sendMessage} style={{ padding: '0.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask something..."
                                style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', borderRadius: '0.5rem' }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
