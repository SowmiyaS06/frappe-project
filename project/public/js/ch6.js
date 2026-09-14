console.log("Chatbot loaded!");

$("body").append(`
    <div id="chatbot-button">
        <img id="chatbot-image"
             src="/assets/project/images/chatbot_2.png">
    </div>
`);

$("body").append(`
    <div id="chatbot-panel">

        <div id="chatbot-header">

            <div id="chatbot-title">
                <span>🤖</span>
                <span>Assistant</span>
            </div>

            <button id="chatbot-close">
                ×
            </button>

        </div>

        <div id="chatbot-body">

            <div id="chatbot-welcome">

                <div class="welcome-icon">
                    👋
                </div>

                <div class="welcome-title">
                    Hi! I'm your assistant
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
            >

            <button id="chatbot-send">
                ➤
            </button>

        </div>

    </div>
`);

$("#chatbot-button").css({
    position: "fixed",
    bottom: "15px",
    right: "15px",
    width: "130px",
    height: "130px",
    "z-index": "9999",
    cursor: "pointer",
    animation: "chatbot-float 2.5s ease-in-out infinite"
});

$("#chatbot-image").css({
    width: "100%",
    height: "100%",
    "object-fit": "contain",
    filter: "drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.22))"
});

$("<style>")
    .text(`
        @keyframes chatbot-float {

            0% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-10px);
            }

            100% {
                transform: translateY(0);
            }

        }
    `)
    .appendTo("head");

$("#chatbot-panel").css({
    position: "fixed",
    bottom: "155px",
    right: "25px",
    width: "360px",
    height: "430px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    "border-radius": "18px",
    "box-shadow": "0 10px 35px rgba(0,0,0,0.18)",
    "z-index": "9998",
    display: "none",
    overflow: "hidden",
    "font-family": "Arial, sans-serif"
});

$("#chatbot-header").css({
    height: "65px",
    padding: "0 18px",
    background: "#f8fafc",
    "border-bottom": "1px solid #e5e7eb",
    display: "flex",
    "justify-content": "space-between",
    "align-items": "center"
});

$("#chatbot-title").css({
    display: "flex",
    "align-items": "center",
    gap: "9px",
    "font-size": "16px",
    "font-weight": "600"
});

$("#chatbot-close").css({
    border: "none",
    background: "transparent",
    "font-size": "24px",
    cursor: "pointer",
    color: "#555",
    "line-height": "1"
});

$("#chatbot-body").css({
    height: "calc(100% - 125px)",
    padding: "20px",
    "box-sizing": "border-box",
    overflow: "auto",
    background: "#ffffff"
});

$("#chatbot-welcome").css({
    "text-align": "center",
    "margin-top": "100px"
});

$(".welcome-icon").css({
    "font-size": "32px",
    "margin-bottom": "10px"
});

$(".welcome-title").css({
    "font-size": "17px",
    "font-weight": "600",
    "margin-bottom": "6px"
});

$(".welcome-text").css({
    "font-size": "13px",
    color: "#777"
});

$("#chatbot-input-area").css({
    height: "60px",
    padding: "10px",
    display: "flex",
    "align-items": "center",
    gap: "8px",
    "box-sizing": "border-box",
    background: "#ffffff",
    "border-top": "1px solid #e5e7eb"
});

$("#chatbot-input").css({
    flex: "1",
    height: "40px",
    border: "1px solid #ddd",
    "border-radius": "20px",
    padding: "0 15px",
    outline: "none",
    "font-size": "13px"
});

$("#chatbot-send").css({
    width: "40px",
    height: "40px",
    border: "none",
    "border-radius": "50%",
    cursor: "pointer",
    "font-size": "16px",
    background: "#f1f5f9"
});

$("#chatbot-button").on("click", function () {
    $("#chatbot-panel").toggle();
});

$("#chatbot-close").on("click", function () {
    $("#chatbot-panel").hide();
});

const chatbotFrames = [
    "/assets/project/images/chatbot_2.png",
    "/assets/project/images/chatbot_1.png",
    "/assets/project/images/chatbot_0.png",
    "/assets/project/images/chatbot_1.png",
    "/assets/project/images/chatbot_2.png"
];

function blink() {

    $("#chatbot-image").attr(
        "src",
        chatbotFrames[0]
    );

    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[1]
        );

    }, 120);

    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[2]
        );

    }, 190);

    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[3]
        );

    }, 290);

    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[4]
        );

    }, 360);
}

setInterval(function () {
    blink();
}, 2500);

$("#chatbot-send").on("click", function () {
    sendMessage();
});

$("#chatbot-input").on("keypress", function (e) {

    if (e.which === 13) {
        sendMessage();
    }

});

async function sendMessage() {

    let message = $("#chatbot-input").val().trim();

    if (!message) {
        return;
    }

    $("#chatbot-body").append(`
        <div class="user-message">
            ${message}
        </div>
    `);

    $("#chatbot-input").val("");

    scrollChat();

    const loadingMessage = $(`
        <div class="bot-message chatbot-loading">

            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>

        </div>
    `);

    $("#chatbot-body").append(loadingMessage);

    scrollChat();

    try {

        let response = await new Promise((resolve, reject) => {

            frappe.call({

                method: "project.api.chat",

                args: {
                    message: message
                },

                callback: function (response) {
                    resolve(response);
                },

                error: function (error) {
                    reject(error);
                }

            });

        });

        await new Promise(resolve => {
            setTimeout(resolve, 1500);
        });

        loadingMessage.remove();

        console.log(
            "Backend response:",
            response
        );

        let data = response.message;

        $("#chatbot-body").append(`
            <div class="bot-message">
                ${data.message}
            </div>
        `);

        if (
            data.recommendations &&
            data.recommendations.length > 0
        ) {

            data.recommendations.forEach(function (recommendation) {

                $("#chatbot-body").append(`

                    <div class="recommendation-card">

                        <div class="recommendation-name">
                            ${recommendation.name}
                        </div>

                        <div class="recommendation-reason">
                            ${recommendation.reason}
                        </div>

                    </div>

                `);

            });

        }

        scrollChat();

    } catch (error) {

        loadingMessage.remove();

        console.error(
            "Chatbot error:",
            error
        );

        $("#chatbot-body").append(`
            <div class="bot-message">
                Sorry, something went wrong. 😕
            </div>
        `);

        scrollChat();

    }

}

function scrollChat() {

    let chatBody = $("#chatbot-body");

    chatBody.scrollTop(
        chatBody[0].scrollHeight
    );

}

$("<style>")
    .text(`

        .user-message {
            max-width: 75%;
            margin-left: auto;
            margin-bottom: 10px;
            padding: 10px 14px;
            background: #e8f0fe;
            border-radius: 15px 15px 3px 15px;
            font-size: 13px;
            word-wrap: break-word;
        }

        .bot-message {
            max-width: 75%;
            margin-right: auto;
            margin-bottom: 10px;
            padding: 10px 14px;
            background: #f1f1f1;
            border-radius: 15px 15px 15px 3px;
            font-size: 13px;
            word-wrap: break-word;
        }

        .recommendation-card {
            max-width: 80%;
            margin-right: auto;
            margin-bottom: 10px;
            padding: 12px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
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

        .chatbot-loading {
            display: flex !important;
            align-items: center;
            gap: 5px;
            width: fit-content !important;
            min-width: 45px;
            padding: 12px 14px !important;
        }

        .typing-dot {
            display: block;
            width: 7px;
            height: 7px;
            background: #777;
            border-radius: 50%;
            animation: chatbot-typing 1.2s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.15s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0.3s;
        }

        @keyframes chatbot-typing {

            0%,
            60%,
            100% {
                transform: translateY(0);
                opacity: 0.35;
            }

            30% {
                transform: translateY(-5px);
                opacity: 1;
            }

        }

    `)
    .appendTo("head");