import React, { createContext, useState, useContext } from 'react';

const WebpageContext = createContext();

export const WebpageProvider = ({ children }) => {
    const [url, setUrl] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [loading, setLoading] = useState(false); // For API calls

    const addChatMessage = (message) => {
        setChatMessages((prevMessages) => [...prevMessages, message]);
    };

    const clearChatMessages = () => {
        setChatMessages([]);
    }

    return (
        <WebpageContext.Provider
            value={{
                url,
                setUrl,
                extractedText,
                setExtractedText,
                chatMessages,
                addChatMessage,
                clearChatMessages,
                isChatbotOpen,
                setIsChatbotOpen,
                loading,
                setLoading,
            }}
        >
            {children}
        </WebpageContext.Provider>
    );
};

export const useWebpage = () => useContext(WebpageContext);