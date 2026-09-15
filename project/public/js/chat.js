console.log("FrapAI loaded!");


/* ============================================================
   CREATE CHATBOT ONLY ONCE
   ============================================================ */

if (!document.getElementById("chatbot-button")) {

    $("body").append(`
        <div id="chatbot-button">
            <img
                id="chatbot-image"
                src="/assets/project/images/frame_01.png"
                alt="FrapAI"
            >
        </div>

        <div id="chatbot-panel">

            <div id="chatbot-header">

                <div id="chatbot-title">
                    <span>🤖</span>
                    <span>Assistant</span>
                </div>

                <button
                    id="chatbot-close"
                    type="button"
                    aria-label="Close chatbot"
                >
                    ×
                </button>

            </div>


            <div id="chatbot-body">

                <div id="chatbot-welcome">

                    <div class="welcome-icon">
                        👋
                    </div>

                    <div class="welcome-title">
                        Hi! I'm your FrapAI
                    </div>

                    <div class="welcome-text">
                        How can I help you today?
                    </div>

                </div>

            </div>


            <div id="chatbot-input-area">

                <input
                    type="text"
                    id="chatbot-input"
                    placeholder="Ask something..."
                    autocomplete="off"
                >

                <button
                    id="chatbot-send"
                    type="button"
                >
                    ➤
                </button>

            </div>

        </div>
    `);

}


/* ============================================================
   CSS
   ============================================================ */

if (!document.getElementById("frapai-styles")) {

    $("<style>")
        .attr("id", "frapai-styles")
        .text(`

            #chatbot-button {
                position: fixed;
                bottom: 15px;
                right: 15px;
                width: 90px;
                height: 90px;
                z-index: 9999;
                cursor: pointer;
                animation:
                    chatbot-float
                    2.5s
                    ease-in-out
                    infinite;
            }

            #chatbot-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter:
                    drop-shadow(
                        0 8px 8px
                        rgba(0, 0, 0, 0.22)
                    );
            }

            @keyframes chatbot-float {

                0% {
                    transform: translateY(0);
                }

                50% {
                    transform: translateY(-8px);
                }

                100% {
                    transform: translateY(0);
                }

            }


            /* =================================================
               PANEL
               ================================================= */

            #chatbot-panel {
                position: fixed;
                bottom: 115px;
                right: 25px;
                width: 400px;
                height: 550px;
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 18px;
                box-shadow:
                    0 10px 35px
                    rgba(0, 0, 0, 0.18);
                z-index: 9998;
                display: none;
                overflow: hidden;
                font-family: Arial, sans-serif;
            }


            /* =================================================
               HEADER
               ================================================= */

            #chatbot-header {
                height: 65px;
                padding: 0 18px;
                background: #f8fafc;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
            }

            #chatbot-title {
                display: flex;
                align-items: center;
                gap: 9px;
                font-size: 16px;
                font-weight: 600;
            }

            #chatbot-close {
                border: none;
                background: transparent;
                font-size: 25px;
                cursor: pointer;
                color: #555;
                line-height: 1;
                padding: 4px 8px;
            }

            #chatbot-close:hover {
                color: #111;
            }


            /* =================================================
               BODY
               ================================================= */

            #chatbot-body {
                height: calc(100% - 125px);
                padding: 18px;
                box-sizing: border-box;
                overflow-y: auto;
                overflow-x: hidden;
                background: #ffffff;
            }


            /* =================================================
               WELCOME
               ================================================= */

            #chatbot-welcome {
                text-align: center;
                margin-top: 100px;
            }

            .welcome-icon {
                font-size: 32px;
                margin-bottom: 10px;
            }

            .welcome-title {
                font-size: 17px;
                font-weight: 600;
                margin-bottom: 6px;
            }

            .welcome-text {
                font-size: 13px;
                color: #777;
            }


            /* =================================================
               USER MESSAGE
               ================================================= */

            .user-message {
                max-width: 75%;
                margin-left: auto;
                margin-bottom: 12px;
                padding: 10px 14px;
                background: #e8f0fe;
                border-radius: 15px 15px 3px 15px;
                font-size: 13px;
                line-height: 1.5;
                word-wrap: break-word;
                white-space: pre-wrap;
            }


            /* =================================================
               BOT MESSAGE
               ================================================= */

            .bot-message {
                max-width: 94%;
                margin-right: auto;
                margin-bottom: 15px;
                padding: 10px 14px;
                background: #f1f1f1;
                border-radius: 15px 15px 15px 3px;
                font-size: 13px;
                line-height: 1.6;
                word-wrap: break-word;
            }


            /* =================================================
               MARKDOWN
               ================================================= */

            .bot-message h1 {
                font-size: 20px;
                margin: 4px 0 10px;
                line-height: 1.3;
            }

            .bot-message h2 {
                font-size: 17px;
                margin: 12px 0 8px;
                line-height: 1.3;
            }

            .bot-message h3 {
                font-size: 15px;
                margin: 10px 0 7px;
                line-height: 1.3;
            }

            .bot-message p {
                margin: 6px 0;
            }

            .bot-message ul {
                margin: 7px 0;
                padding-left: 20px;
            }

            .bot-message ol {
                margin: 7px 0;
                padding-left: 20px;
            }

            .bot-message li {
                margin-bottom: 4px;
            }

            .bot-message strong {
                font-weight: 700;
            }

            .bot-message em {
                font-style: italic;
            }


            /* =================================================
               INLINE CODE
               ================================================= */

            .frapai-inline-code {
                padding: 2px 5px;
                border-radius: 4px;
                background: #e5e7eb;
                color: #111827;
                font-family:
                    Consolas,
                    Monaco,
                    "Courier New",
                    monospace;
                font-size: 12px;
            }


            /* =================================================
               CODE EDITOR
               ================================================= */

            .frapai-code-editor {
                width: 100%;
                margin: 12px 0;
                border: 1px solid #3a3a3a;
                border-radius: 9px;
                overflow: hidden;
                background: #1e1e1e;
                box-sizing: border-box;
            }

            .frapai-code-header {
                min-height: 38px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                padding: 0 10px;
                background: #252526;
                border-bottom: 1px solid #3a3a3a;
                box-sizing: border-box;
            }

            .frapai-code-language {
                color: #d4d4d4;
                font-size: 11px;
                font-weight: 600;
                text-transform: lowercase;
            }

            .frapai-code-actions {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .frapai-code-actions button {
                border: 1px solid #555;
                background: transparent;
                color: #ddd;
                border-radius: 5px;
                padding: 4px 8px;
                font-size: 10px;
                cursor: pointer;
            }

            .frapai-code-actions button:hover {
                background: #3a3a3a;
            }

            .frapai-code-display {
                margin: 0;
                padding: 13px;
                background: #1e1e1e;
                overflow-x: auto;
                box-sizing: border-box;
            }

            .frapai-code-display code {
                color: #d4d4d4;
                font-family:
                    Consolas,
                    Monaco,
                    "Courier New",
                    monospace;
                font-size: 12px;
                line-height: 1.55;
                white-space: pre;
            }


            /* =================================================
               EDIT MODE
               ================================================= */

            .frapai-code-editor-input {
                display: block;
                width: 100%;
                min-height: 180px;
                padding: 13px;
                box-sizing: border-box;
                resize: vertical;
                border: none;
                outline: none;
                background: #1e1e1e;
                color: #d4d4d4;
                font-family:
                    Consolas,
                    Monaco,
                    "Courier New",
                    monospace;
                font-size: 12px;
                line-height: 1.55;
            }


            /* =================================================
               BLOCKQUOTE
               ================================================= */

            .frapai-blockquote {
                margin: 8px 0;
                padding-left: 10px;
                border-left: 3px solid #aaa;
                color: #666;
            }


            /* =================================================
               TABLE
               ================================================= */

            .frapai-table-wrapper {
                width: 100%;
                overflow-x: auto;
                margin: 10px 0;
            }

            .frapai-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                background: #ffffff;
            }

            .frapai-table th,
            .frapai-table td {
                padding: 7px;
                border: 1px solid #ddd;
                text-align: left;
            }

            .frapai-table th {
                background: #f5f5f5;
                font-weight: 600;
            }


            /* =================================================
               LOADING
               ================================================= */

            .chatbot-loading {
                display: flex !important;
                align-items: center;
                gap: 4px;
                width: fit-content !important;
                min-width: 32px;
                padding: 8px 10px !important;
            }

            .typing-dot {
                display: block;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #777;
                animation:
                    chatbot-typing
                    1.2s
                    infinite
                    ease-in-out;
            }

            .typing-dot:nth-child(1) {
                animation-delay: 0s;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.15s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.30s;
            }

            @keyframes chatbot-typing {

                0%,
                60%,
                100% {
                    transform: translateY(0);
                    opacity: 0.35;
                }

                30% {
                    transform: translateY(-4px);
                    opacity: 1;
                }

            }


            /* =================================================
               RECOMMENDATIONS
               ================================================= */

            .recommendation-card {
                max-width: 90%;
                margin: 8px 0 12px;
                padding: 12px;
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                box-shadow:
                    0 2px 6px
                    rgba(0, 0, 0, 0.08);
            }

            .recommendation-name {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 5px;
            }

            .recommendation-reason {
                font-size: 12px;
                color: #777;
            }


            /* =================================================
               INPUT
               ================================================= */

            #chatbot-input-area {
                height: 60px;
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
                box-sizing: border-box;
                background: #ffffff;
                border-top: 1px solid #e5e7eb;
            }

            #chatbot-input {
                flex: 1;
                height: 40px;
                border: 1px solid #ddd;
                border-radius: 20px;
                padding: 0 15px;
                outline: none;
                font-size: 13px;
                box-sizing: border-box;
            }

            #chatbot-input:focus {
                border-color: #aaa;
            }

            #chatbot-send {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                background: #f1f5f9;
            }

            #chatbot-send:hover {
                background: #e2e8f0;
            }

        `)
        .appendTo("head");

}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHtml(text) {

    if (
        text === null ||
        text === undefined
    ) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   MARKDOWN RENDERER
   ============================================================ */

function renderBotMessage(message) {

    if (
        message === null ||
        message === undefined
    ) {
        return "";
    }

    let source = String(message);

    const codeBlocks = [];


    /* --------------------------------------------------------
       Extract fenced code blocks first
       -------------------------------------------------------- */

    source = source.replace(
        /```([a-zA-Z0-9_+#.-]*)[ \t]*\n([\s\S]*?)```/g,
        function (
            match,
            language,
            code
        ) {

            const index =
                codeBlocks.length;

            codeBlocks.push({
                language:
                    language || "text",
                code:
                    code.replace(/\n$/, "")
            });

            return (
                "\n___FRAPAI_CODE_" +
                index +
                "___\n"
            );

        }
    );


    /* --------------------------------------------------------
       Escape normal HTML
       -------------------------------------------------------- */

    let html =
        escapeHtml(source);


    /* --------------------------------------------------------
       Headings
       -------------------------------------------------------- */

    html = html.replace(
        /^### (.+)$/gm,
        "<h3>$1</h3>"
    );

    html = html.replace(
        /^## (.+)$/gm,
        "<h2>$1</h2>"
    );

    html = html.replace(
        /^# (.+)$/gm,
        "<h1>$1</h1>"
    );


    /* --------------------------------------------------------
       Bold
       -------------------------------------------------------- */

    html = html.replace(
        /\*\*(.+?)\*\*/g,
        "<strong>$1</strong>"
    );


    /* --------------------------------------------------------
       Italic
       -------------------------------------------------------- */

    html = html.replace(
        /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
        "<em>$1</em>"
    );


    /* --------------------------------------------------------
       Inline code
       -------------------------------------------------------- */

    html = html.replace(
        /`([^`\n]+)`/g,
        '<span class="frapai-inline-code">$1</span>'
    );


    /* --------------------------------------------------------
       Numbered list
       -------------------------------------------------------- */

    html = html.replace(
        /^(\d+)\. (.+)$/gm,
        '<div class="frapai-list-item"><strong>$1.</strong> $2</div>'
    );


    /* --------------------------------------------------------
       Bullet list
       -------------------------------------------------------- */

    html = html.replace(
        /^[-*] (.+)$/gm,
        '<div class="frapai-list-item">• $1</div>'
    );


    /* --------------------------------------------------------
       Blockquote
       -------------------------------------------------------- */

    html = html.replace(
        /^&gt; (.+)$/gm,
        '<div class="frapai-blockquote">$1</div>'
    );


    /* --------------------------------------------------------
       Line breaks
       -------------------------------------------------------- */

    html = html.replace(
        /\n\n/g,
        "<br><br>"
    );

    html = html.replace(
        /\n/g,
        "<br>"
    );


    /* --------------------------------------------------------
       Put code blocks back
       -------------------------------------------------------- */

    codeBlocks.forEach(
        function (
            block,
            index
        ) {

            const editorHtml = `

                <div class="frapai-code-editor">

                    <div class="frapai-code-header">

                        <span class="frapai-code-language">
                            ${escapeHtml(block.language)}
                        </span>

                        <div class="frapai-code-actions">

                            <button
                                type="button"
                                class="frapai-copy-code">
                                Copy
                            </button>

                            <button
                                type="button"
                                class="frapai-edit-code">
                                Edit
                            </button>

                        </div>

                    </div>

                    <pre class="frapai-code-display"><code>${escapeHtml(block.code)}</code></pre>

                </div>

            `;


            html = html.replace(
                "___FRAPAI_CODE_" +
                index +
                "___",
                editorHtml
            );

        }
    );


    return html;
}


/* ============================================================
   OPEN / CLOSE
   ============================================================ */

function openChatbot() {

    const panel =
        document.getElementById(
            "chatbot-panel"
        );

    if (!panel) {
        return;
    }

    panel.style.display = "block";


    setTimeout(
        function () {

            const input =
                document.getElementById(
                    "chatbot-input"
                );

            if (input) {
                input.focus();
            }

        },
        50
    );

}


function closeChatbot() {

    const panel =
        document.getElementById(
            "chatbot-panel"
        );

    if (!panel) {
        return;
    }

    panel.style.display = "none";

}


function toggleChatbot() {

    const panel =
        document.getElementById(
            "chatbot-panel"
        );

    if (!panel) {
        return;
    }

    const isOpen =
        window.getComputedStyle(
            panel
        ).display !== "none";


    if (isOpen) {
        closeChatbot();
    } else {
        openChatbot();
    }

}


/* ============================================================
   BUTTON HANDLERS
   ============================================================ */

$(document).off(
    "click.frapaiButton",
    "#chatbot-button"
);

$(document).on(
    "click.frapaiButton",
    "#chatbot-button",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        toggleChatbot();

    }
);


$(document).off(
    "click.frapaiClose",
    "#chatbot-close"
);

$(document).on(
    "click.frapaiClose",
    "#chatbot-close",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        closeChatbot();

    }
);


/* ============================================================
   OUTSIDE CLICK
   ============================================================ */
document.addEventListener(
    "pointerdown",
    function (event) {
        const panel = document.getElementById("chatbot-panel");
        const button = document.getElementById("chatbot-button");

        if (!panel || !button) {
            return;
        }

        // Check whether chatbot is currently open
        const isOpen = window.getComputedStyle(panel).display !== "none";

        if (!isOpen) {
            return;
        }

        // Click inside chatbot → do nothing
        if (panel.contains(event.target)) {
            return;
        }

        // Click robot button → do nothing
        // The button's own handler will toggle it
        if (button.contains(event.target)) {
            return;
        }

        // Anything else → close chatbot
        closeChatbot();
    },
    true
);

/* ============================================================
   CTRL + M
   ============================================================ */

$(document).off(
    "keydown.frapaiShortcut"
);

$(document).on(
    "keydown.frapaiShortcut",
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


/* ============================================================
   BLINK ANIMATION
   ============================================================ */

const chatbotFrames = [

    "/assets/project/images/frame_01.png",

    "/assets/project/images/frame_02.png",

    "/assets/project/images/frame_03.png",

    "/assets/project/images/frame_04.png",

    "/assets/project/images/frame_05.png",

    "/assets/project/images/frame_06.png",

    "/assets/project/images/frame_07.png",

    "/assets/project/images/frame_08.png",

    "/assets/project/images/frame_09.png",

    "/assets/project/images/frame_10.png",

    "/assets/project/images/frame_11.png",

    "/assets/project/images/frame_12.png",

    "/assets/project/images/frame_13.png"

];


chatbotFrames.forEach(
    function (src) {

        const image =
            new Image();

        image.src = src;

    }
);


const blinkTimings = [

    0,
    70,
    130,
    190,
    250,
    310,
    370,
    450,
    530,
    610,
    690,
    770,
    850

];


function playBlink() {

    const image =
        $("#chatbot-image");


    chatbotFrames.forEach(
        function (
            frame,
            index
        ) {

            setTimeout(
                function () {

                    image.attr(
                        "src",
                        frame
                    );

                },
                blinkTimings[index]
            );

        }
    );

}


setInterval(
    playBlink,
    2500
);


/* ============================================================
   COPY CODE
   ============================================================ */

$(document).off(
    "click.frapaiCopy",
    ".frapai-copy-code"
);

$(document).on(
    "click.frapaiCopy",
    ".frapai-copy-code",
    async function (event) {

        event.preventDefault();

        event.stopPropagation();


        const button =
            $(this);

        const editor =
            button.closest(
                ".frapai-code-editor"
            );

        const code =
            editor
                .find(
                    ".frapai-code-display code"
                )
                .text();


        try {

            await navigator.clipboard.writeText(
                code
            );

            button.text(
                "Copied!"
            );


            setTimeout(
                function () {

                    button.text(
                        "Copy"
                    );

                },
                1200
            );


        } catch (error) {

            console.error(
                "FrapAI copy error:",
                error
            );

        }

    }
);


/* ============================================================
   EDIT CODE
   ============================================================ */

$(document).off(
    "click.frapaiEdit",
    ".frapai-edit-code"
);

$(document).on(
    "click.frapaiEdit",
    ".frapai-edit-code",
    function (event) {

        event.preventDefault();

        event.stopPropagation();


        const button =
            $(this);

        const editor =
            button.closest(
                ".frapai-code-editor"
            );

        const display =
            editor.find(
                ".frapai-code-display"
            );

        const code =
            display
                .find("code")
                .text();


        const textarea =
            $("<textarea>")
                .addClass(
                    "frapai-code-editor-input"
                );


        textarea.val(
            code
        );


        display.replaceWith(
            textarea
        );


        editor
            .find(
                ".frapai-code-actions"
            )
            .html(`

                <button
                    type="button"
                    class="frapai-save-code">
                    Save
                </button>

                <button
                    type="button"
                    class="frapai-cancel-code">
                    Cancel
                </button>

            `);


        textarea.focus();

    }
);


/* ============================================================
   SAVE CODE
   ============================================================ */

$(document).off(
    "click.frapaiSave",
    ".frapai-save-code"
);

$(document).on(
    "click.frapaiSave",
    ".frapai-save-code",
    function (event) {

        event.preventDefault();

        event.stopPropagation();


        const button =
            $(this);

        const editor =
            button.closest(
                ".frapai-code-editor"
            );

        const textarea =
            editor.find(
                ".frapai-code-editor-input"
            );

        const code =
            textarea.val() || "";


        const display = `

            <pre class="frapai-code-display">
                <code>${escapeHtml(code)}</code>
            </pre>

        `;


        textarea.replaceWith(
            display
        );


        editor
            .find(
                ".frapai-code-actions"
            )
            .html(`

                <button
                    type="button"
                    class="frapai-copy-code">
                    Copy
                </button>

                <button
                    type="button"
                    class="frapai-edit-code">
                    Edit
                </button>

            `);

    }
);


/* ============================================================
   CANCEL CODE EDIT
   ============================================================ */

$(document).off(
    "click.frapaiCancel",
    ".frapai-cancel-code"
);

$(document).on(
    "click.frapaiCancel",
    ".frapai-cancel-code",
    function (event) {

        event.preventDefault();

        event.stopPropagation();


        const button =
            $(this);

        const editor =
            button.closest(
                ".frapai-code-editor"
            );

        const textarea =
            editor.find(
                ".frapai-code-editor-input"
            );

        const code =
            textarea.val() || "";


        const display = `

            <pre class="frapai-code-display">
                <code>${escapeHtml(code)}</code>
            </pre>

        `;


        textarea.replaceWith(
            display
        );


        editor
            .find(
                ".frapai-code-actions"
            )
            .html(`

                <button
                    type="button"
                    class="frapai-copy-code">
                    Copy
                </button>

                <button
                    type="button"
                    class="frapai-edit-code">
                    Edit
                </button>

            `);

    }
);


/* ============================================================
   SEND MESSAGE
   ============================================================ */

async function sendMessage() {

    const input =
        document.getElementById(
            "chatbot-input"
        );


    if (!input) {
        return;
    }


    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    /* --------------------------------------------------------
       Remove welcome
       -------------------------------------------------------- */

    $("#chatbot-welcome").remove();


    /* --------------------------------------------------------
       Show user message
       -------------------------------------------------------- */

    $("#chatbot-body").append(`

        <div class="user-message">
            ${escapeHtml(message)}
        </div>

    `);


    input.value = "";


    scrollChat();


    /* --------------------------------------------------------
       Loading
       -------------------------------------------------------- */

    const loadingMessage =
        $(`
            <div class="bot-message chatbot-loading">

                <span class="typing-dot"></span>

                <span class="typing-dot"></span>

                <span class="typing-dot"></span>

            </div>
        `);


    $("#chatbot-body").append(
        loadingMessage
    );


    scrollChat();


    try {

        /* ----------------------------------------------------
           Call Frappe backend
           ---------------------------------------------------- */

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
                            function (
                                response
                            ) {

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


        console.log(
            "FrapAI backend response:",
            response
        );


        /* ----------------------------------------------------
           Remove loading IMMEDIATELY
           No artificial delay.
           ---------------------------------------------------- */

        loadingMessage.remove();


        /* ----------------------------------------------------
           Frappe response
           ---------------------------------------------------- */

        const backendData =
            response
                ? response.message
                : null;


        let reply = "";

        let recommendations = [];


        /*
         * Python returns:
         *
         * {
         *     success: true,
         *     message: "Gemini response"
         * }
         *
         * Frappe wraps that inside response.message.
         */


        if (
            backendData &&
            typeof backendData === "object"
        ) {

            if (
                backendData.success === false
            ) {

                throw new Error(
                    backendData.message ||
                    "Backend request failed"
                );

            }


            reply =
                backendData.message ||
                "";


            if (
                Array.isArray(
                    backendData.recommendations
                )
            ) {

                recommendations =
                    backendData.recommendations;

            }

        }

        else if (
            typeof backendData === "string"
        ) {

            reply =
                backendData;

        }


        /* ----------------------------------------------------
           Safety fallback
           ---------------------------------------------------- */

        if (!reply) {

            throw new Error(
                "Empty response from FrapAI"
            );

        }


        console.log(
            "FrapAI reply:",
            reply
        );


        /* ----------------------------------------------------
           Render structured Markdown
           ---------------------------------------------------- */

        const renderedMessage =
            renderBotMessage(
                reply
            );


        $("#chatbot-body").append(`

            <div class="bot-message">
                ${renderedMessage}
            </div>

        `);


        /* ----------------------------------------------------
           Recommendations
           ---------------------------------------------------- */

        recommendations.forEach(
            function (
                recommendation
            ) {

                $("#chatbot-body").append(`

                    <div class="recommendation-card">

                        <div class="recommendation-name">
                            ${escapeHtml(
                                recommendation.name ||
                                ""
                            )}
                        </div>

                        <div class="recommendation-reason">
                            ${escapeHtml(
                                recommendation.reason ||
                                ""
                            )}
                        </div>

                    </div>

                `);

            }
        );


        scrollChat();


    } catch (error) {

        loadingMessage.remove();


        console.error(
            "FrapAI error:",
            error
        );


        $("#chatbot-body").append(`

            <div class="bot-message">
                Sorry, I couldn't process your request right now. 😕
            </div>

        `);


        scrollChat();

    }

}


/* ============================================================
   SEND BUTTON
   ============================================================ */

$(document).off(
    "click.frapaiSend",
    "#chatbot-send"
);

$(document).on(
    "click.frapaiSend",
    "#chatbot-send",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        sendMessage();

    }
);


/* ============================================================
   ENTER TO SEND
   ============================================================ */

$(document).off(
    "keydown.frapaiInput",
    "#chatbot-input"
);

$(document).on(
    "keydown.frapaiInput",
    "#chatbot-input",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* ============================================================
   SCROLL
   ============================================================ */
function scrollChat() {

    const body =
        document.getElementById(
            "chatbot-body"
        );

    if (!body) {
        return;
    }

    body.scrollTop =
        body.scrollHeight;

}