import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebpage } from '../context/WebpageContext';
import ChatBubble from './ChatBubble';

const Chatbot = () => {
    const {
        isChatbotOpen,
        setIsChatbotOpen,
        chatMessages,
        addChatMessage,
        extractedText,
        loading,
        setLoading,
        url,
        clearChatMessages,
        setUrl,
        setExtractedText
    } = useWebpage();
    const [question, setQuestion] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim() || !extractedText || loading) return;

        addChatMessage({ sender: 'user', text: question });
        setQuestion('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question, context: extractedText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to get answer from Gemini');
            }

            const data = await response.json();
            addChatMessage({ sender: 'gemini', text: data.answer });
        } catch (error) {
            console.error('Error asking Gemini:', error);
            addChatMessage({ sender: 'system', text: `Error: ${error.message}.` });
        } finally {
            setLoading(false);
        }
    };

    const handleReanalyzePage = async () => {
        if (!url || loading) return;

        setLoading(true);
        clearChatMessages();
        addChatMessage({ sender: 'system', text: 'Re-analyzing webpage...' });

        try {
            const response = await fetch('http://localhost:8000/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to re-extract webpage content');
            }

            const data = await response.json();
            setExtractedText(data.extracted_text);
            addChatMessage({ sender: 'system', text: 'Webpage re-analyzed. You can now ask questions.' });
        } catch (error) {
            console.error('Error re-analyzing webpage:', error);
            addChatMessage({ sender: 'system', text: `Error: ${error.message}. Please try again.` });
            setExtractedText('');
            setUrl('');
        } finally {
            setLoading(false);
        }
    };


    const chatWindowVariants = {
        hidden: { opacity: 0, scale: 0.7, y: 60, x: 60, rotate: -5 },
        visible: { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0, transition: { type: "spring", stiffness: 100, damping: 18 } },
        exit: { opacity: 0, scale: 0.7, y: 60, x: 60, rotate: 5, transition: { duration: 0.3 } }
    };

    const pillVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 25 } },
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {!isChatbotOpen && (extractedText || url) && ( // Only show pill if there's a page loaded
                    <motion.div
                        key="pill"
                        variants={pillVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => setIsChatbotOpen(true)}
                    >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                    </motion.div>
                )}

                {isChatbotOpen && (
                    <motion.div
                        key="chatWindow"
                        variants={chatWindowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                    >
                        {/* Chat Header */}
                        <div className="flex justify-between items-center p-4 bg-blue-600 text-white text-lg font-semibold rounded-t-2xl shadow-md">
                            <span>Webpage Chat</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsChatbotOpen(false)}
                                className="text-white hover:text-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </motion.button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gray-50">
                            {chatMessages.length === 0 && (
                                <p className="text-gray-500 text-center mt-10 text-sm">
                                    {url ? "Ask me anything about this page!" : "Load a webpage in the input above to start chatting."}
                                </p>
                            )}
                            {chatMessages.map((msg, index) => (
                                <ChatBubble key={index} message={msg} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleAskQuestion} className="p-4 border-t border-gray-200 bg-white">
                            {url && ( // Only show re-analyze if a URL is loaded
                                <motion.button
                                    type="button"
                                    onClick={handleReanalyzePage}
                                    className="w-full mb-3 p-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Re-analyzing...' : 'Re-analyze Page'}
                                </motion.button>
                            )}
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder={url ? "Ask a question..." : "Load a page first"}
                                    className="flex-grow p-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm shadow-sm"
                                    disabled={loading || !url} // Disable if no URL or loading
                                />
                                <motion.button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center shadow-md transition-colors duration-200"
                                    disabled={loading || !url || !question.trim()} // Disable if no URL, loading, or empty question
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;