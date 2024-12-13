import React, { useEffect } from 'react';

const Chatbot = () => {
    useEffect(() => {
        // Inject chatbot configuration script
        const configScript = document.createElement('script');
        configScript.innerHTML = `
            window.embeddedChatbotConfig = {
                chatbotId: "72CVwtgfKijUBVEbsF1Pc",
                domain: "www.chatbase.co"
            };
        `;
        document.body.appendChild(configScript);

        // Inject chatbot embed script
        const chatbotScript = document.createElement('script');
        chatbotScript.src = "https://www.chatbase.co/embed.min.js";
        chatbotScript.setAttribute('chatbotId', '72CVwtgfKijUBVEbsF1Pc');
        chatbotScript.setAttribute('domain', 'www.chatbase.co');
        chatbotScript.defer = true;
        document.body.appendChild(chatbotScript);

        return () => {
            // Cleanup scripts if needed
            document.body.removeChild(configScript);
            document.body.removeChild(chatbotScript);
        };
    }, []);

    return null; // Chatbot script does not need to render anything
};

export default Chatbot;
