console.log("FrapAI loaded!");

(function () {
    "use strict";

    /* =========================================================
       CONFIGURATION
    ========================================================= */

    const CHATBOT_ID = "frapai-chatbot";
    const BUTTON_ID = "chatbot-button";
    const PANEL_ID = "chatbot-panel";
    const MESSAGES_ID = "chatbot-messages";
    const INPUT_ID = "chatbot-input";
    const SEND_ID = "chatbot-send";

    const ROBOT_FRAMES = 13;
    const ROBOT_FRAME_PATH = "/assets/project/images/frame_";

    /* =========================================================
       REMOVE OLD CHATBOT
       Prevent duplicate chatbot after Desk navigation/reload
    ========================================================= */

    const oldContainer = document.getElementById(CHATBOT_ID);

    if (oldContainer) {
        oldContainer.remove();
    }

    const oldButton = document.getElementById(BUTTON_ID);

    if (oldButton) {
        oldButton.remove();
    }

    const oldPanel = document.getElementById(PANEL_ID);

    if (oldPanel) {
        oldPanel.remove();
    }

    /* =========================================================
       MAIN CONTAINER
    ========================================================= */

    const chatbotContainer = document.createElement("div");

    chatbotContainer.id = CHATBOT_ID;

    chatbotContainer.innerHTML = `
        <!-- ================================================
             CHATBOT FLOATING BUTTON
        ================================================= -->

        <button
            id="chatbot-button"
            type="button"
            aria-label="Open Assistant"
            title="Open Assistant"
        >
            <img
                id="chatbot-button-image"
                src="${ROBOT_FRAME_PATH}01.png"
                alt="Assistant"
            />
        </button>


        <!-- ================================================
             CHATBOT PANEL
        ================================================= -->

        <div
            id="chatbot-panel"
            class="frapai-chatbot-panel"
            aria-hidden="true"
        >

            <!-- ============================================
                 HEADER
            ============================================= -->

            <div id="chatbot-header">

                <div id="chatbot-title">

                    <span id="chatbot-title-icon">
                        🤖
                    </span>

                    <span>
                        Assistant
                    </span>

                </div>


                <div id="chatbot-header-actions">

                    <!-- MAXIMIZE / RESTORE -->

                    <button
                        id="chatbot-maximize"
                        type="button"
                        aria-label="Maximize chatbot"
                        title="Maximize"
                    >
                        ⛶
                    </button>


                    <!-- CLOSE -->

                    <button
                        id="chatbot-close"
                        type="button"
                        aria-label="Close chatbot"
                        title="Close"
                    >
                        ×
                    </button>

                </div>

            </div>


            <!-- ============================================
                 CHAT BODY
            ============================================= -->

            <div id="chatbot-body">

                <div id="${MESSAGES_ID}">

                    <div class="frapai-welcome-message">

                        Hello! I'm FrapAI.
                        How can I help you with Frappe Framework,
                        ERPNext, Python, JavaScript, or other
                        technical questions today?

                    </div>

                </div>

            </div>


            <!-- ============================================
                 INPUT AREA
            ============================================= -->

            <div id="chatbot-input-area">

                <div id="chatbot-input-wrapper">

                    <textarea
                        id="${INPUT_ID}"
                        rows="1"
                        placeholder="Ask something..."
                        autocomplete="off"
                    ></textarea>

                    <button
                        id="${SEND_ID}"
                        type="button"
                        aria-label="Send message"
                        title="Send"
                    >
                        ➤
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(chatbotContainer);


    /* =========================================================
       CSS
    ========================================================= */

    const style = document.createElement("style");

    style.id = "frapai-chatbot-styles";

    style.textContent = `

        /* =====================================================
           MAIN CONTAINER
        ===================================================== */

        #${CHATBOT_ID} {
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Helvetica,
                Arial,
                sans-serif;
        }


        /* =====================================================
           FLOATING ROBOT BUTTON
        ===================================================== */

        #chatbot-button {

            position: fixed;

            right: 25px;
            bottom: 35px;

            width: 78px;
            height: 78px;

            border: none;
            padding: 0;

            background: transparent;

            cursor: pointer;

            z-index: 999999;

            display: flex;
            align-items: center;
            justify-content: center;

            transition:
                transform 0.2s ease,
                filter 0.2s ease;
        }


        #chatbot-button:hover {

            transform: scale(1.07);

            filter:
                drop-shadow(
                    0 8px 18px rgba(0, 0, 0, 0.18)
                );
        }


        #chatbot-button:active {

            transform: scale(0.96);
        }


        #chatbot-button-image {

            width: 78px;
            height: 78px;

            object-fit: contain;

            display: block;

            user-select: none;
            pointer-events: none;
        }


        /* =====================================================
           CHATBOT PANEL
           NORMAL FLOATING SIZE
        ===================================================== */

        #chatbot-panel {

            position: fixed;

            right: 25px;
            bottom: 115px;

            width: 430px;
            height: 600px;

            min-width: 320px;
            min-height: 380px;

            max-width: 85vw;
            max-height: 85vh;

            background: #ffffff;

            border: 1px solid #dfe3e8;

            border-radius: 16px;

            box-shadow:
                0 15px 45px rgba(0, 0, 0, 0.16);

            overflow: hidden;

            display: flex;
            flex-direction: column;

            z-index: 999998;

            opacity: 0;
            visibility: hidden;

            transform:
                translateY(15px)
                scale(0.98);

            transition:
                opacity 0.2s ease,
                visibility 0.2s ease,
                transform 0.2s ease;
        }


        /* =====================================================
           OPEN STATE
        ===================================================== */

        #chatbot-panel.frapai-open {

            opacity: 1;

            visibility: visible;

            transform:
                translateY(0)
                scale(1);
        }


        /* =====================================================
           MAXIMIZED STATE
           
           IMPORTANT:
           There is NO manual edge/corner resizing here.
        ===================================================== */

        #chatbot-panel.frapai-maximized {

            top: 35px;
            right: 35px;
            bottom: 35px;

            /*
                Leave space for Frappe Desk sidebar.
            */
            left: 275px;

            width: auto;
            height: auto;

            min-width: 0;
            min-height: 0;

            max-width: none;
            max-height: none;

            border-radius: 16px;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        #chatbot-header {

            height: 64px;

            min-height: 64px;

            padding:
                0 18px
                0 20px;

            display: flex;

            align-items: center;

            justify-content: space-between;

            background: #f8fafc;

            border-bottom:
                1px solid #e5e7eb;

            user-select: none;
        }


        #chatbot-title {

            display: flex;

            align-items: center;

            gap: 10px;

            font-size: 20px;

            font-weight: 600;

            color: #555;
        }


        #chatbot-title-icon {

            font-size: 22px;

            display: flex;

            align-items: center;

            justify-content: center;
        }


        /* =====================================================
           HEADER BUTTONS
        ===================================================== */

        #chatbot-header-actions {

            display: flex;

            align-items: center;

            gap: 6px;
        }


        #chatbot-maximize,
        #chatbot-close {

            width: 34px;
            height: 34px;

            border: none;

            background: transparent;

            border-radius: 7px;

            cursor: pointer;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 22px;

            color: #555;

            transition:
                background 0.15s ease,
                color 0.15s ease;
        }


        #chatbot-maximize:hover,
        #chatbot-close:hover {

            background: #e9edf2;

            color: #222;
        }


        #chatbot-close {

            font-size: 28px;

            line-height: 1;
        }


        /* =====================================================
           CHAT BODY
        ===================================================== */

        #chatbot-body {

            flex: 1;

            min-height: 0;

            overflow: hidden;

            background: #ffffff;

            position: relative;
        }


        /* =====================================================
           MESSAGES CONTAINER
        ===================================================== */

        #chatbot-messages {

            width: 100%;

            height: 100%;

            box-sizing: border-box;

            overflow-y: auto;

            overflow-x: hidden;

            padding:
                22px 20px 90px 20px;

            scroll-behavior: smooth;
        }


        /* =====================================================
           SCROLLBAR
        ===================================================== */

        #chatbot-messages::-webkit-scrollbar {

            width: 8px;
        }


        #chatbot-messages::-webkit-scrollbar-track {

            background: transparent;
        }


        #chatbot-messages::-webkit-scrollbar-thumb {

            background: #c9cdd2;

            border-radius: 10px;
        }


        #chatbot-messages::-webkit-scrollbar-thumb:hover {

            background: #aeb4ba;
        }


        /* =====================================================
           WELCOME MESSAGE
        ===================================================== */

        .frapai-welcome-message {

            width: fit-content;

            max-width: 92%;

            box-sizing: border-box;

            margin:
                0 0 14px 0;

            padding:
                14px 17px;

            background: #f1f1f1;

            color: #555;

            border-radius:
                4px 18px 18px 18px;

            font-size: 14px;

            line-height: 1.55;

            word-break: break-word;
        }


        /* =====================================================
           MESSAGE ROW
        ===================================================== */

        .frapai-message {

            display: flex;

            width: 100%;

            margin:
                10px 0;

            box-sizing: border-box;
        }


        /* =====================================================
           USER MESSAGE ROW
        ===================================================== */

        .frapai-user-message {

            justify-content: flex-end;
        }


        /* =====================================================
           USER MESSAGE BUBBLE

           IMPORTANT:
           This keeps user messages compact.
        ===================================================== */

        .frapai-user-bubble {

            width: fit-content;

            max-width: 65%;

            box-sizing: border-box;

            padding:
                12px 18px;

            background: #e8f0ff;

            color: #444;

            border-radius:
                18px 18px 4px 18px;

            font-size: 14px;

            line-height: 1.5;

            white-space: pre-wrap;

            overflow-wrap: anywhere;

            word-break: break-word;
        }


        /* =====================================================
           BOT MESSAGE ROW
        ===================================================== */

        .frapai-bot-message {

            justify-content: flex-start;
        }


        /* =====================================================
           BOT MESSAGE BUBBLE
        ===================================================== */

        .frapai-bot-bubble {

            width: fit-content;

            max-width: 92%;

            box-sizing: border-box;

            padding:
                14px 17px;

            background: #f1f1f1;

            color: #555;

            border-radius:
                4px 18px 18px 18px;

            font-size: 14px;

            line-height: 1.6;

            word-break: break-word;

            overflow-wrap: anywhere;
        }


        /* =====================================================
           BOT MARKDOWN
        ===================================================== */

        .frapai-bot-bubble p {

            margin:
                0 0 12px 0;
        }


        .frapai-bot-bubble p:last-child {

            margin-bottom: 0;
        }


        .frapai-bot-bubble strong {

            color: #333;

            font-weight: 650;
        }


        .frapai-bot-bubble em {

            font-style: italic;
        }


        .frapai-bot-bubble h1,
        .frapai-bot-bubble h2,
        .frapai-bot-bubble h3,
        .frapai-bot-bubble h4 {

            margin:
                14px 0 8px 0;

            color: #222;

            line-height: 1.35;
        }


        .frapai-bot-bubble h1 {

            font-size: 21px;
        }


        .frapai-bot-bubble h2 {

            font-size: 19px;
        }


        .frapai-bot-bubble h3 {

            font-size: 17px;
        }


        .frapai-bot-bubble h4 {

            font-size: 15px;
        }


        .frapai-bot-bubble ul,
        .frapai-bot-bubble ol {

            margin:
                8px 0 12px 20px;

            padding: 0;
        }


        .frapai-bot-bubble li {

            margin:
                4px 0;
        }


        .frapai-bot-bubble hr {

            border: none;

            border-top:
                1px solid #d5d5d5;

            margin:
                14px 0;
        }


        .frapai-bot-bubble blockquote {

            margin:
                10px 0;

            padding:
                8px 12px;

            border-left:
                3px solid #b8c4d8;

            background: #e9edf3;

            color: #555;
        }


        /* =====================================================
           INLINE CODE
        ===================================================== */

        .frapai-inline-code {

            padding:
                2px 5px;

            border-radius: 4px;

            background: #e4e7eb;

            color: #333;

            font-family:
                Consolas,
                Monaco,
                monospace;

            font-size: 13px;
        }


        /* =====================================================
           CODE BLOCK
        ===================================================== */

        .frapai-code-wrapper {

            margin:
                12px 0;

            border:
                1px solid #d7dbe0;

            border-radius: 9px;

            overflow: hidden;

            background: #1e1e1e;
        }


        .frapai-code-header {

            height: 38px;

            padding:
                0 10px;

            background: #292d32;

            display: flex;

            align-items: center;

            justify-content: space-between;
        }


        .frapai-code-language {

            color: #cfd4da;

            font-size: 12px;

            font-family:
                Consolas,
                Monaco,
                monospace;
        }


        .frapai-code-actions {

            display: flex;

            gap: 5px;
        }


        .frapai-code-button {

            border: none;

            background: #3a3f45;

            color: #e7e9eb;

            border-radius: 5px;

            padding:
                5px 8px;

            font-size: 11px;

            cursor: pointer;
        }


        .frapai-code-button:hover {

            background: #4a5057;
        }


        .frapai-code-content {

            margin: 0;

            padding:
                14px;

            overflow-x: auto;

            color: #f1f1f1;

            font-family:
                Consolas,
                Monaco,
                "Courier New",
                monospace;

            font-size: 13px;

            line-height: 1.55;

            white-space: pre;
        }


        .frapai-code-editor {

            display: none;

            width: 100%;

            min-height: 180px;

            box-sizing: border-box;

            resize: vertical;

            padding:
                14px;

            border: none;

            outline: none;

            background: #1e1e1e;

            color: #f1f1f1;

            font-family:
                Consolas,
                Monaco,
                monospace;

            font-size: 13px;

            line-height: 1.55;
        }


        .frapai-code-edit-actions {

            display: none;

            padding:
                7px 10px;

            background: #292d32;

            gap: 6px;
        }


        /* =====================================================
           LINKS
        ===================================================== */

        .frapai-bot-bubble a {

            color: #3274d9;

            text-decoration: underline;

            word-break: break-all;
        }


        /* =====================================================
           THINKING / LOADING
        ===================================================== */

        .frapai-thinking {

            display: flex;

            align-items: center;

            gap: 7px;

            padding:
                13px 16px;

            background: #f1f1f1;

            border-radius:
                4px 18px 18px 18px;

            width: fit-content;
        }


        .frapai-thinking-dot {

            width: 7px;
            height: 7px;

            border-radius: 50%;

            background: #8a8f95;

            animation:
                frapai-thinking-animation
                1.2s infinite ease-in-out;
        }


        .frapai-thinking-dot:nth-child(2) {

            animation-delay: 0.15s;
        }


        .frapai-thinking-dot:nth-child(3) {

            animation-delay: 0.3s;
        }


        @keyframes frapai-thinking-animation {

            0%,
            60%,
            100% {

                transform: translateY(0);

                opacity: 0.45;
            }

            30% {

                transform: translateY(-4px);

                opacity: 1;
            }
        }


        /* =====================================================
           INPUT AREA
        ===================================================== */

        #chatbot-input-area {

            position: absolute;

            left: 0;
            right: 0;
            bottom: 0;

            padding:
                10px;

            background:
                linear-gradient(
                    to top,
                    #ffffff 75%,
                    rgba(255, 255, 255, 0)
                );

            z-index: 10;
        }


        #chatbot-input-wrapper {

            display: flex;

            align-items: center;

            gap: 7px;

            width: 100%;

            min-height: 50px;

            box-sizing: border-box;

            padding:
                5px 6px 5px 17px;

            background: #ffffff;

            border:
                1px solid #d9dde2;

            border-radius: 28px;

            box-shadow:
                0 2px 8px rgba(0, 0, 0, 0.04);
        }


        #chatbot-input-wrapper:focus-within {

            border-color: #b9c5d4;

            box-shadow:
                0 2px 10px rgba(0, 0, 0, 0.06);
        }


        #chatbot-input {

            flex: 1;

            min-width: 0;

            max-height: 120px;

            resize: none;

            border: none;

            outline: none;

            background: transparent;

            color: #444;

            font-family: inherit;

            font-size: 14px;

            line-height: 20px;

            padding:
                8px 0;
        }


        #chatbot-input::placeholder {

            color: #8a8f95;
        }


        #chatbot-send {

            flex: 0 0 auto;

            width: 38px;
            height: 38px;

            border: none;

            border-radius: 50%;

            background: #4f6f9f;

            color: #ffffff;

            cursor: pointer;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 17px;

            transition:
                transform 0.15s ease,
                opacity 0.15s ease;
        }


        #chatbot-send:hover {

            transform: scale(1.05);
        }


        #chatbot-send:disabled {

            opacity: 0.5;

            cursor: not-allowed;

            transform: none;
        }


        /* =====================================================
           RECOMMENDATIONS
        ===================================================== */

        .frapai-recommendations {

            margin-top: 12px;

            display: flex;

            flex-direction: column;

            gap: 8px;
        }


        .frapai-recommendation {

            padding:
                11px 13px;

            border:
                1px solid #dce1e7;

            border-radius: 9px;

            background: #ffffff;
        }


        .frapai-recommendation-title {

            font-weight: 600;

            color: #333;

            margin-bottom: 4px;
        }


        .frapai-recommendation-reason {

            color: #666;

            font-size: 12px;

            line-height: 1.45;
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

            #chatbot-panel {

                right: 12px;
                bottom: 95px;

                width: calc(100vw - 24px);

                height: calc(100vh - 120px);

                max-width: none;
                max-height: none;

                border-radius: 14px;
            }


            #chatbot-panel.frapai-maximized {

                top: 15px;
                right: 15px;
                bottom: 15px;
                left: 15px;

                width: auto;
                height: auto;
            }


            .frapai-user-bubble {

                max-width: 78%;
            }


            .frapai-bot-bubble {

                max-width: 94%;
            }


            #chatbot-button {

                right: 15px;
                bottom: 15px;
            }
        }


        /* =====================================================
           VERY SMALL SCREENS
        ===================================================== */

        @media (max-width: 400px) {

            #chatbot-header {

                padding-left: 14px;
                padding-right: 10px;
            }


            #chatbot-messages {

                padding-left: 12px;
                padding-right: 12px;
            }


            .frapai-user-bubble {

                max-width: 82%;

                padding:
                    10px 14px;
            }


            .frapai-bot-bubble {

                max-width: 96%;

                padding:
                    12px 14px;
            }
        }

    `;

    document.head.appendChild(style);


    /* =========================================================
       ELEMENT REFERENCES
    ========================================================= */

    const panel = document.getElementById(PANEL_ID);
    const button = document.getElementById(BUTTON_ID);
    const closeButton = document.getElementById("chatbot-close");
    const maximizeButton = document.getElementById("chatbot-maximize");
    const messages = document.getElementById(MESSAGES_ID);
    const input = document.getElementById(INPUT_ID);
    const sendButton = document.getElementById(SEND_ID);
    const robotImage = document.getElementById("chatbot-button-image");


    /* =========================================================
       OPEN CHATBOT
    ========================================================= */

    function openChatbot() {

        if (!panel) {
            return;
        }

        panel.classList.add("frapai-open");

        panel.setAttribute(
            "aria-hidden",
            "false"
        );

        setTimeout(function () {

            if (input) {
                input.focus();
            }

            scrollChat();

        }, 150);
    }


    /* =========================================================
       CLOSE CHATBOT
    ========================================================= */

    function closeChatbot() {

        if (!panel) {
            return;
        }

        panel.classList.remove("frapai-open");

        panel.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    /* =========================================================
       TOGGLE CHATBOT
    ========================================================= */

    function toggleChatbot() {

        if (!panel) {
            return;
        }

        if (panel.classList.contains("frapai-open")) {

            closeChatbot();

        } else {

            openChatbot();
        }
    }


    /* =========================================================
       OPEN BUTTON
    ========================================================= */

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            toggleChatbot();
        }
    );


    /* =========================================================
       CLOSE BUTTON
    ========================================================= */

    closeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            closeChatbot();
        }
    );


    /* =========================================================
       MAXIMIZE / RESTORE

       NO RESIZING.
       ONLY TWO FIXED STATES:
       1. Normal floating
       2. Maximized
    ========================================================= */

    maximizeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isMaximized =
                panel.classList.contains(
                    "frapai-maximized"
                );

            if (isMaximized) {

                panel.classList.remove(
                    "frapai-maximized"
                );

                maximizeButton.textContent = "⛶";

                maximizeButton.setAttribute(
                    "aria-label",
                    "Maximize chatbot"
                );

                maximizeButton.setAttribute(
                    "title",
                    "Maximize"
                );

            } else {

                panel.classList.add(
                    "frapai-maximized"
                );

                maximizeButton.textContent = "❐";

                maximizeButton.setAttribute(
                    "aria-label",
                    "Restore chatbot"
                );

                maximizeButton.setAttribute(
                    "title",
                    "Restore"
                );
            }

            setTimeout(
                scrollChat,
                100
            );
        }
    );


    /* =========================================================
       SCROLL CHAT
    ========================================================= */

    function scrollChat() {

        if (!messages) {
            return;
        }

        messages.scrollTop =
            messages.scrollHeight;
    }


    /* =========================================================
       ESCAPE HTML
    ========================================================= */

    function escapeHtml(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================================================
       ESCAPE ATTRIBUTE
    ========================================================= */

    function escapeAttribute(value) {

        return escapeHtml(value)
            .replace(/`/g, "&#096;");
    }


    /* =========================================================
       MARKDOWN RENDERER
    ========================================================= */

    function renderBotMessage(markdown) {

        if (
            markdown === null ||
            markdown === undefined
        ) {
            return "";
        }

        let text = String(markdown);

        /*
         * First protect fenced code blocks.
         */

        const codeBlocks = [];

        text = text.replace(
            /```([\w+-]*)\n?([\s\S]*?)```/g,
            function (
                match,
                language,
                code
            ) {

                const index =
                    codeBlocks.length;

                codeBlocks.push({
                    language:
                        language || "code",

                    code:
                        code.replace(
                            /\n$/,
                            ""
                        )
                });

                return `@@FRAPAI_CODE_${index}@@`;
            }
        );


        /*
         * Escape everything else.
         */

        text = escapeHtml(text);


        /*
         * Headings
         */

        text = text.replace(
            /^#### (.+)$/gm,
            "<h4>$1</h4>"
        );

        text = text.replace(
            /^### (.+)$/gm,
            "<h3>$1</h3>"
        );

        text = text.replace(
            /^## (.+)$/gm,
            "<h2>$1</h2>"
        );

        text = text.replace(
            /^# (.+)$/gm,
            "<h1>$1</h1>"
        );


        /*
         * Horizontal rule
         */

        text = text.replace(
            /^---+$/gm,
            "<hr>"
        );


        /*
         * Bold
         */

        text = text.replace(
            /\*\*(.+?)\*\*/g,
            "<strong>$1</strong>"
        );


        /*
         * Italic
         */

        text = text.replace(
            /(^|[^\*])\*([^*\n]+)\*(?!\*)/g,
            "$1<em>$2</em>"
        );


        /*
         * Inline code
         */

        text = text.replace(
            /`([^`\n]+)`/g,
            '<code class="frapai-inline-code">$1</code>'
        );


        /*
         * Links
         */

        text = text.replace(
            /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
            function (
                match,
                label,
                url
            ) {

                return `
                    <a
                        href="${escapeAttribute(url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${label}
                    </a>
                `;
            }
        );


        /*
         * Unordered lists
         */

        text = text.replace(
            /(?:^|\n)(?:[-*] .+(?:\n|$))+/g,
            function (block) {

                const items =
                    block
                        .trim()
                        .split("\n")
                        .map(function (line) {

                            return line.replace(
                                /^[-*]\s+/,
                                ""
                            );

                        })
                        .map(function (item) {

                            return `<li>${item}</li>`;

                        })
                        .join("");

                return `
                    <ul>
                        ${items}
                    </ul>
                `;
            }
        );


        /*
         * Ordered lists
         */

        text = text.replace(
            /(?:^|\n)(?:\d+\.\s.+(?:\n|$))+/g,
            function (block) {

                const items =
                    block
                        .trim()
                        .split("\n")
                        .map(function (line) {

                            return line.replace(
                                /^\d+\.\s+/,
                                ""
                            );

                        })
                        .map(function (item) {

                            return `<li>${item}</li>`;

                        })
                        .join("");

                return `
                    <ol>
                        ${items}
                    </ol>
                `;
            }
        );


        /*
         * Blockquotes
         */

        text = text.replace(
            /(?:^|\n)(?:&gt; .+(?:\n|$))+/g,
            function (block) {

                const quote =
                    block
                        .trim()
                        .split("\n")
                        .map(function (line) {

                            return line.replace(
                                /^&gt;\s?/,
                                ""
                            );

                        })
                        .join("<br>");

                return `
                    <blockquote>
                        ${quote}
                    </blockquote>
                `;
            }
        );


        /*
         * Convert remaining new lines.
         */

        text = text.replace(
            /\n{2,}/g,
            "</p><p>"
        );

        text = text.replace(
            /\n/g,
            "<br>"
        );


        /*
         * Restore code blocks.
         */

        codeBlocks.forEach(
            function (block, index) {

                const safeCode =
                    escapeHtml(
                        block.code
                    );

                const language =
                    escapeHtml(
                        block.language
                    );

                const codeId =
                    "frapai-code-" +
                    Date.now() +
                    "-" +
                    index +
                    "-" +
                    Math.floor(
                        Math.random() * 100000
                    );

                const codeHtml = `

                    <div
                        class="frapai-code-wrapper"
                        data-code-id="${codeId}"
                    >

                        <div class="frapai-code-header">

                            <span
                                class="frapai-code-language"
                            >
                                ${language}
                            </span>


                            <div
                                class="frapai-code-actions"
                            >

                                <button
                                    type="button"
                                    class="frapai-code-button frapai-copy-code"
                                    data-code-id="${codeId}"
                                >
                                    Copy
                                </button>

                                <button
                                    type="button"
                                    class="frapai-code-button frapai-edit-code"
                                    data-code-id="${codeId}"
                                >
                                    Edit
                                </button>

                            </div>

                        </div>


                        <pre
                            class="frapai-code-content"
                            id="${codeId}"
                        >${safeCode}</pre>


                        <textarea
                            class="frapai-code-editor"
                            data-code-id="${codeId}"
                        >${escapeHtml(block.code)}</textarea>


                        <div
                            class="frapai-code-edit-actions"
                            data-code-id="${codeId}"
                        >

                            <button
                                type="button"
                                class="frapai-code-button frapai-save-code"
                                data-code-id="${codeId}"
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                class="frapai-code-button frapai-cancel-code"
                                data-code-id="${codeId}"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                `;

                text = text.replace(
                    `@@FRAPAI_CODE_${index}@@`,
                    codeHtml
                );
            }
        );


        /*
         * Wrap normal content in paragraph.
         */

        if (
            !text.includes("<h1>") &&
            !text.includes("<h2>") &&
            !text.includes("<h3>") &&
            !text.includes("<h4>") &&
            !text.includes("<ul>") &&
            !text.includes("<ol>") &&
            !text.includes("<blockquote>") &&
            !text.includes("<hr>") &&
            !text.includes("frapai-code-wrapper")
        ) {

            text =
                `<p>${text}</p>`;
        }


        return text;
    }


    /* =========================================================
       ADD USER MESSAGE
    ========================================================= */

    function addUserMessage(message) {

        const row =
            document.createElement("div");

        row.className =
            "frapai-message frapai-user-message";


        const bubble =
            document.createElement("div");

        bubble.className =
            "frapai-user-bubble";

        bubble.textContent =
            message;


        row.appendChild(bubble);

        messages.appendChild(row);

        scrollChat();
    }


    /* =========================================================
       ADD BOT MESSAGE
    ========================================================= */

    function addBotMessage(message) {

        const row =
            document.createElement("div");

        row.className =
            "frapai-message frapai-bot-message";


        const bubble =
            document.createElement("div");

        bubble.className =
            "frapai-bot-bubble";

        bubble.innerHTML =
            renderBotMessage(message);


        row.appendChild(bubble);

        messages.appendChild(row);

        scrollChat();
    }


    /* =========================================================
       SHOW THINKING
    ========================================================= */

    function showThinking() {

        const row =
            document.createElement("div");

        row.className =
            "frapai-message frapai-bot-message";

        row.id =
            "frapai-thinking-message";


        const thinking =
            document.createElement("div");

        thinking.className =
            "frapai-thinking";


        thinking.innerHTML = `

            <span class="frapai-thinking-dot"></span>
            <span class="frapai-thinking-dot"></span>
            <span class="frapai-thinking-dot"></span>

        `;


        row.appendChild(thinking);

        messages.appendChild(row);

        scrollChat();
    }


    /* =========================================================
       REMOVE THINKING
    ========================================================= */

    function removeThinking() {

        const thinking =
            document.getElementById(
                "frapai-thinking-message"
            );

        if (thinking) {
            thinking.remove();
        }
    }


    /* =========================================================
       ADD RECOMMENDATIONS
    ========================================================= */

    function addRecommendations(
        recommendations
    ) {

        if (
            !Array.isArray(
                recommendations
            ) ||
            recommendations.length === 0
        ) {
            return;
        }


        const row =
            document.createElement("div");

        row.className =
            "frapai-message frapai-bot-message";


        const container =
            document.createElement("div");

        container.className =
            "frapai-bot-bubble frapai-recommendations";


        recommendations.forEach(
            function (item) {

                if (!item) {
                    return;
                }

                /*
                 * Support different backend response shapes.
                 */

                const name =
                    item.name ||
                    item.app_name ||
                    item.title ||
                    item.symbol_name ||
                    item.doctype ||
                    "Recommendation";


                const reason =
                    item.reason ||
                    item.description ||
                    item.module ||
                    item.file_path ||
                    "";


                const card =
                    document.createElement("div");

                card.className =
                    "frapai-recommendation";


                const title =
                    document.createElement("div");

                title.className =
                    "frapai-recommendation-title";

                title.textContent =
                    name;


                const reasonElement =
                    document.createElement("div");

                reasonElement.className =
                    "frapai-recommendation-reason";

                reasonElement.textContent =
                    reason;


                card.appendChild(title);


                if (reason) {

                    card.appendChild(
                        reasonElement
                    );
                }


                container.appendChild(card);

            }
        );


        row.appendChild(container);

        messages.appendChild(row);

        scrollChat();
    }


    /* =========================================================
       NORMALIZE API RESPONSE
    ========================================================= */

    function normalizeResponse(response) {

        if (
            response === null ||
            response === undefined
        ) {

            return {
                reply: "",
                recommendations: []
            };
        }


        /*
         * frappe.call usually gives:
         *
         * response.message
         */

        let data =
            response.message !== undefined
                ? response.message
                : response;


        /*
         * Sometimes backend returns a JSON string.
         */

        if (typeof data === "string") {

            try {

                data =
                    JSON.parse(data);

            } catch (error) {

                return {
                    reply: data,
                    recommendations: []
                };
            }
        }


        /*
         * Different possible response keys.
         */

        const reply =
            data.reply ||
            data.response ||
            data.answer ||
            data.message ||
            "";


        const recommendations =
            data.recommendations ||
            data.results ||
            [];


        return {
            reply:
                String(reply),

            recommendations:
                Array.isArray(
                    recommendations
                )
                    ? recommendations
                    : []
        };
    }


    /* =========================================================
       SEND MESSAGE
    ========================================================= */

    async function sendMessage() {

        if (!input || !sendButton) {
            return;
        }


        const message =
            input.value.trim();


        if (!message) {
            return;
        }


        /*
         * Add user message.
         */

        addUserMessage(message);


        /*
         * Clear input.
         */

        input.value = "";

        autoResizeInput();


        /*
         * Disable send while waiting.
         */

        sendButton.disabled = true;


        /*
         * Show thinking animation.
         */

        showThinking();


        try {

            const response =
                await new Promise(
                    function (
                        resolve,
                        reject
                    ) {

                        frappe.call({

                            method:
                                "project.api.chat",

                            args: {

                                message:
                                    message

                            },

                            callback:
                                function (response) {

                                    resolve(
                                        response
                                    );
                                },

                            error:
                                function (
                                    error
                                ) {

                                    reject(
                                        error
                                    );
                                }

                        });

                    }
                );


            removeThinking();


            const result =
                normalizeResponse(
                    response
                );


            if (result.reply) {

                addBotMessage(
                    result.reply
                );
            } else {

                addBotMessage(
                    "Sorry, I couldn't generate a response."
                );
            }


            if (
                result.recommendations &&
                result.recommendations.length
            ) {

                addRecommendations(
                    result.recommendations
                );
            }

        } catch (error) {

            console.error(
                "FrapAI error:",
                error
            );


            removeThinking();


            let errorMessage =
                "Sorry, something went wrong while processing your request.";


            /*
             * Try to get a useful Frappe error.
             */

            if (
                error &&
                error.message
            ) {

                errorMessage =
                    error.message;
            }


            addBotMessage(
                errorMessage
            );

        } finally {

            sendButton.disabled =
                false;

            input.focus();

            scrollChat();
        }
    }


    /* =========================================================
       SEND BUTTON
    ========================================================= */

    sendButton.addEventListener(
        "click",
        function () {

            sendMessage();
        }
    );


    /* =========================================================
       ENTER KEY
       
       Enter = Send
       Shift + Enter = New line
    ========================================================= */

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();
            }
        }
    );


    /* =========================================================
       AUTO RESIZE INPUT
    ========================================================= */

    function autoResizeInput() {

        if (!input) {
            return;
        }


        input.style.height =
            "auto";


        input.style.height =
            Math.min(
                input.scrollHeight,
                120
            ) + "px";
    }


    input.addEventListener(
        "input",
        autoResizeInput
    );


    /* =========================================================
       CODE COPY
    ========================================================= */

    document.addEventListener(
        "click",
        async function (event) {

            const button =
                event.target.closest(
                    ".frapai-copy-code"
                );


            if (!button) {
                return;
            }


            const codeId =
                button.dataset.codeId;


            const codeElement =
                document.getElementById(
                    codeId
                );


            if (!codeElement) {
                return;
            }


            const code =
                codeElement.textContent;


            try {

                await navigator.clipboard.writeText(
                    code
                );


                const oldText =
                    button.textContent;


                button.textContent =
                    "Copied!";


                setTimeout(
                    function () {

                        button.textContent =
                            oldText;

                    },
                    1200
                );

            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );
            }
        }
    );


    /* =========================================================
       CODE EDIT
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".frapai-edit-code"
                );


            if (!button) {
                return;
            }


            const codeId =
                button.dataset.codeId;


            const wrapper =
                document.querySelector(
                    `.frapai-code-wrapper[data-code-id="${codeId}"]`
                );


            if (!wrapper) {
                return;
            }


            const code =
                wrapper.querySelector(
                    ".frapai-code-content"
                );

            const editor =
                wrapper.querySelector(
                    ".frapai-code-editor"
                );

            const editActions =
                wrapper.querySelector(
                    ".frapai-code-edit-actions"
                );


            if (!code || !editor || !editActions) {
                return;
            }


            editor.value =
                code.textContent;


            code.style.display =
                "none";


            editor.style.display =
                "block";


            editActions.style.display =
                "flex";


            button.style.display =
                "none";
        }
    );


    /* =========================================================
       CODE SAVE
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".frapai-save-code"
                );


            if (!button) {
                return;
            }


            const codeId =
                button.dataset.codeId;


            const wrapper =
                document.querySelector(
                    `.frapai-code-wrapper[data-code-id="${codeId}"]`
                );


            if (!wrapper) {
                return;
            }


            const code =
                wrapper.querySelector(
                    ".frapai-code-content"
                );

            const editor =
                wrapper.querySelector(
                    ".frapai-code-editor"
                );

            const editActions =
                wrapper.querySelector(
                    ".frapai-code-edit-actions"
                );

            const editButton =
                wrapper.querySelector(
                    ".frapai-edit-code"
                );


            if (
                !code ||
                !editor ||
                !editActions
            ) {
                return;
            }


            code.textContent =
                editor.value;


            code.style.display =
                "block";


            editor.style.display =
                "none";


            editActions.style.display =
                "none";


            if (editButton) {

                editButton.style.display =
                    "inline-block";
            }
        }
    );


    /* =========================================================
       CODE CANCEL
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".frapai-cancel-code"
                );


            if (!button) {
                return;
            }


            const codeId =
                button.dataset.codeId;


            const wrapper =
                document.querySelector(
                    `.frapai-code-wrapper[data-code-id="${codeId}"]`
                );


            if (!wrapper) {
                return;
            }


            const code =
                wrapper.querySelector(
                    ".frapai-code-content"
                );

            const editor =
                wrapper.querySelector(
                    ".frapai-code-editor"
                );

            const editActions =
                wrapper.querySelector(
                    ".frapai-code-edit-actions"
                );

            const editButton =
                wrapper.querySelector(
                    ".frapai-edit-code"
                );


            if (
                !code ||
                !editor ||
                !editActions
            ) {
                return;
            }


            editor.value =
                code.textContent;


            code.style.display =
                "block";


            editor.style.display =
                "none";


            editActions.style.display =
                "none";


            if (editButton) {

                editButton.style.display =
                    "inline-block";
            }
        }
    );


    /* =========================================================
       CTRL + M SHORTCUT
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "m"
            ) {

                event.preventDefault();

                toggleChatbot();
            }
        }
    );


    /* =========================================================
       ESC TO CLOSE
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                panel.classList.contains(
                    "frapai-open"
                )
            ) {

                /*
                 * If maximized, Escape first restores.
                 */

                if (
                    panel.classList.contains(
                        "frapai-maximized"
                    )
                ) {

                    panel.classList.remove(
                        "frapai-maximized"
                    );

                    maximizeButton.textContent =
                        "⛶";

                    maximizeButton.setAttribute(
                        "aria-label",
                        "Maximize chatbot"
                    );

                    maximizeButton.setAttribute(
                        "title",
                        "Maximize"
                    );

                } else {

                    closeChatbot();
                }
            }
        }
    );


    /* =========================================================
       ROBOT BLINKING ANIMATION
    ========================================================= */

    let currentFrame = 1;


    function updateRobotFrame() {

        if (!robotImage) {
            return;
        }


        currentFrame++;


        if (
            currentFrame >
            ROBOT_FRAMES
        ) {

            currentFrame = 1;
        }


        const frameNumber =
            String(
                currentFrame
            ).padStart(
                2,
                "0"
            );


        robotImage.src =
            `${ROBOT_FRAME_PATH}${frameNumber}.png`;
    }


    setInterval(
        updateRobotFrame,
        180
    );


    /* =========================================================
       OUTSIDE CLICK
    ========================================================= */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !panel.classList.contains(
                    "frapai-open"
                )
            ) {
                return;
            }


            const clickedInsidePanel =
                panel.contains(
                    event.target
                );


            const clickedButton =
                button.contains(
                    event.target
                );


            if (
                !clickedInsidePanel &&
                !clickedButton
            ) {

                closeChatbot();
            }
        }
    );


    /* =========================================================
       INITIAL STATE
    ========================================================= */

    panel.classList.remove(
        "frapai-open"
    );

    panel.classList.remove(
        "frapai-maximized"
    );

    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    /* =========================================================
       FINAL LOG
    ========================================================= */

    console.log(
        "FrapAI chatbot initialized successfully."
    );

})();