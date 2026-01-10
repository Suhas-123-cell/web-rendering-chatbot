import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';

    let bubbleClasses = 'max-w-[70%] p-3 rounded-lg shadow-sm text-base break-words';
    let textClasses = 'text-gray-800';
    let containerClasses = 'flex my-2';

    if (isUser) {
        bubbleClasses += ' bg-blue-500 text-white self-end rounded-br-none';
        containerClasses += ' justify-end';
        textClasses = 'text-white'; // User messages text is white
    } else if (isSystem) {
        bubbleClasses += ' bg-gray-200 text-gray-700 self-start rounded-bl-none';
        containerClasses += ' justify-start';
        textClasses = 'text-gray-700'; // System messages text is gray-700
    } else { // Gemini's response
        bubbleClasses += ' bg-white text-gray-800 self-start rounded-bl-none border border-gray-200';
        containerClasses += ' justify-start';
        textClasses = 'text-gray-800'; // Gemini messages text is gray-800
    }

    const bubbleVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } },
    };

    return (
        <motion.div
            className={containerClasses}
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
        >
            <div className={bubbleClasses}>
                <p className={textClasses}>{message.text}</p>
            </div>
        </motion.div>
    );
};

export default ChatBubble;