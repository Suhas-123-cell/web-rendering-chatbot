import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebpage } from '../context/WebpageContext';

const UrlInput = () => {
    const [inputUrl, setInputUrl] = useState('');
    const { setUrl, setExtractedText, setLoading, addChatMessage, clearChatMessages, loading } = useWebpage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputUrl || loading) return; // Prevent multiple submissions

        setLoading(true);
        clearChatMessages(); // Clear chat when a new URL is submitted
        addChatMessage({ sender: 'system', text: 'Fetching and analyzing webpage...' });

        try {
            const response = await fetch('http://localhost:8000/extract', { // Assuming backend runs on 8000
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: inputUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to extract webpage content');
            }

            const data = await response.json();
            setUrl(inputUrl);
            setExtractedText(data.extracted_text);
            addChatMessage({ sender: 'system', text: 'Webpage analyzed. You can now ask questions.' });
        } catch (error) {
            console.error('Error fetching webpage:', error);
            addChatMessage({ sender: 'system', text: `Error: ${error.message}. Please try again with a valid URL.` });
            setExtractedText(''); // Clear extracted text on error
            setUrl(''); // Clear URL on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ y: -120, rotate: -3 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="absolute top-0 left-0 right-0 p-4 bg-white shadow-md z-10 rounded-b-lg border-b border-gray-200"
        >
            <form onSubmit={handleSubmit} className="flex space-x-3 items-center">
                <motion.input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter webpage URL (e.g., https://www.example.com)"
                    className="flex-grow p-2.5 text-base rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                    required
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileFocus={{ scale: 1.01, boxShadow: "0px 0px 8px rgba(0, 123, 255, 0.6)" }}
                />
                <motion.button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Load Page'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default UrlInput;