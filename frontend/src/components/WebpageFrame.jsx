import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebpage } from '../context/WebpageContext';

const WebpageFrame = () => {
    const { url } = useWebpage();

    const frameVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="absolute inset-0 w-full h-full bg-gray-50">
            <AnimatePresence mode="wait">
                {url ? (
                    <motion.iframe
                        key={url} // Key ensures re-mount and animation when URL changes
                        src={url}
                        title="Webpage Content"
                        className="w-full h-full border-none shadow-inner"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Increased security
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={frameVariants}
                    ></motion.iframe>
                ) : (
                    <motion.div
                        key="placeholder"
                        className="flex flex-col items-center justify-center w-full h-full text-gray-500 text-xl p-4 text-center"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={frameVariants}
                    >
                        <svg className="w-20 h-20 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-2.25-2.25M3.75 9.75l4.5-4.5m1.5 1.5l4.5 4.5m1.5 1.5l4.5 4.5M12 21.75c3.54-1.16 6.6-3.1 9-5.17M3 7.5c3.54-1.16 6.6-3.1 9-5.17M9 16.5c2.822-0.865 5.5-2.227 7.75-4.0M3 13.5c2.822-0.865 5.5-2.227 7.75-4.0"></path>
                        </svg>
                        <p className="font-semibold mb-2">No Webpage Loaded</p>
                        <p className="text-lg">Enter a URL in the input bar above to begin.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WebpageFrame;