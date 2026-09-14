console.log("Chatbot loaded!");


// ========================================
// Chatbot Character
// ========================================

$("body").append(`
    <div id="chatbot-button">

        <img id="chatbot-image"
             src="/assets/project/images/chatbot_2.png">

    </div>
`);


// ========================================
// Chatbot Panel
// ========================================

$("body").append(`
    <div id="chatbot-panel">

        <!-- Header -->
        <div id="chatbot-header">

            <div id="chatbot-title">

                <span>🤖</span>

                <span>Assistant</span>

            </div>

            <button id="chatbot-close">
                ×
            </button>

        </div>


        <!-- Chat Body -->
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


        <!-- Input Area -->
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


// ========================================
// Character Style
// ========================================

$("#chatbot-button").css({

    position: "fixed",

    bottom: "15px",

    right: "15px",

    width: "130px",

    height: "130px",

    "z-index": "9999",

    cursor: "pointer",

    animation:
        "chatbot-float 2.5s ease-in-out infinite"

});


// ========================================
// Character Image Style
// ========================================

$("#chatbot-image").css({

    width: "100%",

    height: "100%",

    "object-fit": "contain",

    filter:
        "drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.22))"

});


// ========================================
// Floating Animation
// ========================================

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


// ========================================
// Chatbot Panel Style
// ========================================

$("#chatbot-panel").css({

    position: "fixed",

    bottom: "155px",

    right: "25px",

    width: "360px",

    height: "430px",

    background: "#ffffff",

    border: "1px solid #e5e7eb",

    "border-radius": "18px",

    "box-shadow":
        "0 10px 35px rgba(0,0,0,0.18)",

    "z-index": "9998",

    display: "none",

    overflow: "hidden",

    "font-family":
        "Arial, sans-serif"

});


// ========================================
// Header Style
// ========================================

$("#chatbot-header").css({

    height: "65px",

    padding: "0 18px",

    background: "#f8fafc",

    "border-bottom":
        "1px solid #e5e7eb",

    display: "flex",

    "justify-content":
        "space-between",

    "align-items": "center"

});


// ========================================
// Header Title
// ========================================

$("#chatbot-title").css({

    display: "flex",

    "align-items": "center",

    gap: "9px",

    "font-size": "16px",

    "font-weight": "600"

});


// ========================================
// Close Button
// ========================================

$("#chatbot-close").css({

    border: "none",

    background: "transparent",

    "font-size": "24px",

    cursor: "pointer",

    color: "#555",

    "line-height": "1"

});


// ========================================
// Chat Body
// ========================================

$("#chatbot-body").css({

    height: "calc(100% - 125px)",

    padding: "20px",

    "box-sizing": "border-box",

    overflow: "auto",

    background: "#ffffff"

});


// ========================================
// Welcome Message
// ========================================

$("#chatbot-welcome").css({

    "text-align": "center",

    "margin-top": "100px"

});


// ========================================
// Welcome Icon
// ========================================

$(".welcome-icon").css({

    "font-size": "32px",

    "margin-bottom": "10px"

});


// ========================================
// Welcome Title
// ========================================

$(".welcome-title").css({

    "font-size": "17px",

    "font-weight": "600",

    "margin-bottom": "6px"

});


// ========================================
// Welcome Text
// ========================================

$(".welcome-text").css({

    "font-size": "13px",

    color: "#777"

});


// ========================================
// Input Area
// ========================================

$("#chatbot-input-area").css({

    height: "60px",

    padding: "10px",

    display: "flex",

    "align-items": "center",

    gap: "8px",

    "box-sizing": "border-box",

    background: "#ffffff",

    "border-top":
        "1px solid #e5e7eb"

});


// ========================================
// Input Box
// ========================================

$("#chatbot-input").css({

    flex: "1",

    height: "40px",

    border: "1px solid #ddd",

    "border-radius": "20px",

    padding: "0 15px",

    outline: "none",

    "font-size": "13px"

});


// ========================================
// Send Button
// ========================================

$("#chatbot-send").css({

    width: "40px",

    height: "40px",

    border: "none",

    "border-radius": "50%",

    cursor: "pointer",

    "font-size": "16px",

    background: "#f1f5f9"

});


// ========================================
// Open / Close Chatbot
// ========================================

$("#chatbot-button").on("click", function () {

    $("#chatbot-panel").toggle();

});


// ========================================
// Close Chatbot
// ========================================

$("#chatbot-close").on("click", function () {

    $("#chatbot-panel").hide();

});


// ========================================
// Eye Blink Animation
// Open → Half → Closed → Half → Open
// ========================================

const chatbotFrames = [

    "/assets/project/images/chatbot_2.png",

    "/assets/project/images/chatbot_1.png",

    "/assets/project/images/chatbot_0.png",

    "/assets/project/images/chatbot_1.png",

    "/assets/project/images/chatbot_2.png"

];


// ========================================
// Natural Blink
// ========================================

function blink() {

    // Make sure eyes are open
    $("#chatbot-image").attr(
        "src",
        chatbotFrames[0]
    );


    // Open → Half closed
    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[1]
        );

    }, 120);


    // Half closed → Closed
    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[2]
        );

    }, 190);


    // Closed → Half open
    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[3]
        );

    }, 290);


    // Half open → Open
    setTimeout(function () {

        $("#chatbot-image").attr(
            "src",
            chatbotFrames[4]
        );

    }, 360);

}


// ========================================
// Blink Every 2.5 Seconds
// ========================================

setInterval(function () {

    blink();

}, 2500);


// ========================================
// Send Button
// ========================================

$("#chatbot-send").on("click", function () {

    sendMessage();

});


// ========================================
// Send Using Enter
// ========================================

$("#chatbot-input").on("keypress", function (e) {

    if (e.which === 13) {

        sendMessage();

    }

});


// ========================================
// Send Message
// ========================================

async function sendMessage() {

    let message = $("#chatbot-input").val().trim();


    // Don't send empty messages
    if (!message) {

        return;

    }


    // ========================================
    // Display User Message
    // ========================================

    $("#chatbot-body").append(`

        <div class="user-message">

            ${message}

        </div>

    `);


    // Clear input
    $("#chatbot-input").val("");


    // Scroll to bottom
    scrollChat();


    // ========================================
    // Show Loading Indicator
    // ========================================

    $("#chatbot-body").append(`

        <div id="chatbot-loading" class="bot-message">

            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>

        </div>

    `);


    scrollChat();


    try {

        // ========================================
        // Call Python Backend
        // ========================================

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


        console.log(
            "Chatbot backend response:",
            response
        );


        // ========================================
        // Artificial Delay
        // Only for UI Testing
        // ========================================

        await new Promise(resolve => {

            setTimeout(resolve, 1200);

        });


        // ========================================
        // Remove Loading
        // ========================================

        $("#chatbot-loading").remove();


        // ========================================
        // Get Backend Data
        // ========================================

        let data = response.message;


        // ========================================
        // Display Bot Message
        // ========================================

        $("#chatbot-body").append(`

            <div class="bot-message">

                ${data.message}

            </div>

        `);


        // ========================================
        // Display Recommendation
        // ========================================

        if (
            data.recommendations &&
            data.recommendations.length > 0
        ) {

            data.recommendations.forEach(
                function (recommendation) {

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

                }
            );

        }


        scrollChat();


    } catch (error) {

        console.error(
            "Chatbot error:",
            error
        );


        // Remove loading
        $("#chatbot-loading").remove();


        // Show error
        $("#chatbot-body").append(`

            <div class="bot-message">

                Sorry, something went wrong. 😕 

            </div>

        `);


        scrollChat();

    }

}


// ========================================
// Scroll Chat
// ========================================

function scrollChat() {

    let chatBody = $("#chatbot-body");

    chatBody.scrollTop(
        chatBody[0].scrollHeight
    );

}

// ========================================
// Message Styles
// ========================================

$("<style>")
    .text(`

        .user-message {

            max-width: 75%;

            margin-left: auto;

            margin-bottom: 10px;

            padding: 10px 14px;

            background: #e8f0fe;

            border-radius:
                15px 15px 3px 15px;

            font-size: 13px;

            word-wrap: break-word;

        }


        .bot-message {

            max-width: 75%;

            margin-right: auto;

            margin-bottom: 10px;

            padding: 10px 14px;

            background: #f1f1f1;

            border-radius:
                15px 15px 15px 3px;

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

            box-shadow:
                0 2px 6px rgba(0,0,0,0.08);

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


        #chatbot-loading {

            display: flex;

            align-items: center;

            gap: 4px;

            width: fit-content;

            padding: 12px 14px;

        }


        .typing-dot {

            width: 6px;

            height: 6px;

            background: #777;

            border-radius: 50%;

            animation:
                chatbot-typing
                1.2s infinite ease-in-out;

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

                opacity: 0.4;

            }

            30% {

                transform: translateY(-4px);

                opacity: 1;

            }

        }

    `)
    .appendTo("head");