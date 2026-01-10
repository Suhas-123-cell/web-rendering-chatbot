import React from 'react';
import { WebpageProvider } from './context/WebpageContext';
import UrlInput from './components/UrlInput';
import WebpageFrame from './components/WebpageFrame';
import Chatbot from './components/Chatbot';

function App() {
    return (
        <WebpageProvider>
            <div className="relative flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-900 border border-gray-300 rounded-xl shadow-2xl">
                {/* URL Input at the top */}
                <UrlInput />

                {/* Webpage Frame fills the rest of the screen, with adjusted z-index */}
                <div className="flex-1 mt-20 relative z-0"> {/* Adjust mt-20 based on UrlInput height */}
                    <WebpageFrame />
                </div>

                {/* Chatbot floating at bottom-right */}
                <Chatbot />
            </div>
        </WebpageProvider>
    );
}

export default App;