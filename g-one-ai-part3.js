<script>
/* =========================
   G ONE AI - PART 2
   SMART CONVERSATION
========================= */

let userName = localStorage.getItem("gOneUserName") || "";
let lastTopic = "";
let lastReplyType = "";


/* RANDOM REPLY */

function randomReply(list){
    return list[Math.floor(Math.random() * list.length)];
}


/* TEXT CLEAN */

function cleanText(text){
    return text
        .toLowerCase()
        .replace(/[?!.,'"]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================
   NATURAL REPLIES
========================= */

const conversation = {

    hello: [
        "Hello! 😊 Kaise ho?",
        "Namaste! 👋 Kya haal hai?",
        "Hey! 😄 Batao, aaj kya baat karni hai?",
        "Hello dost! 🤖 Main ready hoon."
    ],

    howAreYou: [
        "Main bilkul badhiya hoon 🤖 Aap kaise ho?",
        "Main mast hoon 😄 Aapse baat karke achha lag raha hai.",
        "Main ekdum ready hoon! 🚀 Aapka din kaisa ja raha hai?"
    ],

    fine: [
        "Ye sunkar achha laga! 😊",
        "Great! 😄 Aaj ka din productive banate hain.",
        "Bahut badhiya! 🔥"
    ],

    thanks: [
        "You're welcome! 😊",
        "Koi baat nahi! ❤️",
        "Hamesha! 🤖",
        "My pleasure! 😄"
    ],

    sorry: [
        "Koi baat nahi 😊",
        "It's okay! 👍",
        "Tension mat lo, sab theek hai."
    ],

    compliment: [
        "Thank you! 😊 Aapne mujhe khush kar diya.",
        "Aww, thanks! 🤖❤️",
        "Bahut-bahut thank you!"
    ],

    doing: [
        "Main abhi aapse baat kar raha hoon 😄",
        "Aapke messages ka reply de raha hoon 🤖",
        "Bas aapse chatting kar raha hoon!"
    ],

    bored: [
        "Bore ho rahe ho? 😄 Joke sunna hai?",
        "Chalo boredom khatam karte hain! 😎",
        "Main hoon na! 🤖 Kuch interesting karte hain."
    ],

    motivation: [
        "🔥 Never give up! Chhote steps bhi bade results laate hain.",
        "💪 Aap kar sakte ho. Bas consistency maintain rakho.",
        "🚀 Aaj ka ek small step kal ka big result ban sakta hai."
    ],

    joke: [
        "Teacher: Homework kahan hai? 😂 Student: Sir, Google Drive mein tha, internet nahi tha!",
        "Computer doctor ke paas gaya. Doctor bola: Kya hua? Computer bola: Mujhe virus ho gaya! 😂",
        "Teacher: Late kyun aaye? Student: Sir, sapne mein school aa gaya tha! 😂"
    ]

};


/* =========================
   NAME MEMORY
========================= */

function checkName(text){

    const patterns = [
        /mera naam ([a-zA-Z]+)/i,
        /my name is ([a-zA-Z]+)/i,
        /i am ([a-zA-Z]+)/i
    ];

    for(let pattern of patterns){

        const match = text.match(pattern);

        if(match){

            let name = match[1];

            if(
                name.toLowerCase() !== "fine" &&
                name.toLowerCase() !== "good" &&
                name.toLowerCase() !== "okay"
            ){

                userName = name;

                localStorage.setItem(
                    "gOneUserName",
                    userName
                );

                return true;
            }
        }
    }

    return false;
}


/* =========================
   SMART AI BRAIN
========================= */

function smartAI(original){

    const text = cleanText(original);


    /* NAME */

    if(checkName(original)){

        lastReplyType = "name";

        return `Nice to meet you, ${userName}! 😊 Ab main aapka naam yaad rakhunga.`;
    }


    /* GREETING */

    if(
        /^(hi|hello|hey|hii|helo|namaste|नमस्ते)$/.test(text)
    ){

        lastReplyType = "hello";

        return randomReply(conversation.hello);
    }


    /* HOW ARE YOU */

    if(
        text.includes("how are you") ||
        text.includes("how r u") ||
        text.includes("aap kaise ho") ||
        text.includes("tum kaise ho") ||
        text === "kaise ho"
    ){

        lastReplyType = "how";

        return randomReply(conversation.howAreYou);
    }


    /* USER IS FINE */

    if(
        text.includes("main theek hoon") ||
        text.includes("mai theek hu") ||
        text.includes("i am fine") ||
        text.includes("i am good") ||
        text.includes("main badhiya hoon") ||
        text.includes("mast hoon")
    ){

        lastReplyType = "fine";

        return randomReply(conversation.fine);
    }


    /* THANK YOU */

    if(
        text.includes("thank you") ||
        text.includes("thanks") ||
        text.includes("shukriya") ||
        text.includes("dhanyawad")
    ){

        lastReplyType = "thanks";

        return randomReply(conversation.thanks);
    }


    /* SORRY */

    if(
        text.includes("sorry") ||
        text.includes("maaf karo")
    ){

        lastReplyType = "sorry";

        return randomReply(conversation.sorry);
    }


    /* COMPLIMENT */

    if(
        text.includes("you are good") ||
        text.includes("you are smart") ||
        text.includes("smart ai") ||
        text.includes("bahut achhe") ||
        text.includes("best ai") ||
        text.includes("awesome")
    ){

        lastReplyType = "compliment";

        return randomReply(conversation.compliment);
    }


    /* WHAT ARE YOU DOING */

    if(
        text.includes("kya kar rahe ho") ||
        text.includes("kya kar rahe") ||
        text.includes("what are you doing")
    ){

        lastReplyType = "doing";

        return randomReply(conversation.doing);
    }


    /* BORED */

    if(
        text.includes("bore ho raha") ||
        text.includes("bore ho rahi") ||
        text.includes("boring") ||
        text.includes("bored")
    ){

        lastReplyType = "bored";

        return randomReply(conversation.bored);
    }


    /* JOKE */

    if(
        text.includes("joke") ||
        text.includes("jokes") ||
        text.includes("ek joke") ||
        text.includes("joke sunao") ||
        text.includes("hasao")
    ){

        lastReplyType = "joke";

        return randomReply(conversation.joke);
    }


    /* ANOTHER */

    if(
        text.includes("ek aur") ||
        text.includes("another") ||
        text.includes("aur sunao")
    ){

        if(lastReplyType === "joke"){

            return randomReply(conversation.joke);

        }

        return "Bilkul 😄 Batao kis topic par?";
    }


    /* MOTIVATION */

    if(
        text.includes("motivation") ||
        text.includes("motivate") ||
        text.includes("himmat")
    ){

        lastReplyType = "motivation";

        return randomReply(conversation.motivation);
    }


    /* STUDY */

    if(
        text.includes("study") ||
        text.includes("padhai") ||
        text.includes("exam") ||
        text.includes("college")
    ){

        lastTopic = "study";

        return "📚 Study Mode ON! Subject aur topic batao, main simple language mein explain karunga.";
    }


    /* NAME QUESTION */

    if(
        text.includes("mera naam kya") ||
        text.includes("my name")
    ){

        if(userName){

            return `Aapka naam ${userName} hai 😊`;

        }else{

            return "Mujhe abhi aapka naam nahi pata. Aap bol sakte ho: 'Mera naam Karan hai'.";

        }
    }


    /* AI NAME */

    if(
        text.includes("tumhara naam") ||
        text.includes("aapka naam") ||
        text.includes("your name") ||
        text.includes("who are you")
    ){

        return "Mera naam G ONE AI hai 🤖 Main aapka browser-based AI assistant hoon.";
    }


    /* TIME */

    if(
        text.includes("time") ||
        text.includes("samay") ||
        text.includes("kitne baje")
    ){

        return "⏰ Abhi time hai: " +
        new Date().toLocaleTimeString("en-IN");
    }


    /* DATE */

    if(
        text.includes("date") ||
        text.includes("tarikh") ||
        text.includes("aaj ki date")
    ){

        return "📅 Aaj ki date hai: " +
        new Date().toLocaleDateString("en-IN");
    }


    /* GOOD MORNING */

    if(text.includes("good morning")){

        return "Good Morning! ☀️ Aaj ka din productive banate hain! 💪";
    }


    /* GOOD NIGHT */

    if(text.includes("good night")){

        return "Good Night! 🌙 Achhi neend lo. Kal phir baat karenge.";
    }


    /* YES CONTEXT */

    if(
        text === "haan" ||
        text === "yes" ||
        text === "ha"
    ){

        if(lastReplyType === "bored"){

            lastReplyType = "joke";

            return "Perfect! 😂 " +
            randomReply(conversation.joke);
        }

        if(lastReplyType === "joke"){

            return randomReply(conversation.joke);
        }

        return "Great! 😊 Batao, kya karna hai?";
    }


    /* BYE */

    if(
        text === "bye" ||
        text === "goodbye" ||
        text.includes("see you")
    ){

        return "Bye! 👋 Phir milte hain. G ONE AI yahin rahega! 🤖";
    }


    /* LOVE */

    if(
        text.includes("love you") ||
        text.includes("i love you")
    ){

        return "Aww ❤️ Thank you! Main aapka AI assistant hoon aur help ke liye ready hoon. 🤖";
    }


    /* HELP */

    if(
        text === "help" ||
        text.includes("kya kar sakte ho")
    ){

        return `
🤖 G ONE AI Features:

• Normal conversation
• Hindi / Hinglish / English
• Name memory
• Voice input
• Voice reply
• Jokes
• Study help
• Motivation
• Time & Date
• Google Search
• YouTube
• Calculator
        `;
    }


    /* YOUTUBE */

    if(
        text.includes("youtube kholo") ||
        text.includes("open youtube")
    ){

        window.open(
            "https://www.youtube.com",
            "_blank"
        );

        return "▶️ YouTube open kar diya.";
    }


    /* GOOGLE */

    if(
        text.includes("google kholo") ||
        text.includes("open google")
    ){

        window.open(
            "https://www.google.com",
            "_blank"
        );

        return "🔎 Google open kar diya.";
    }


    /* SEARCH */

    if(
        text.startsWith("search ") ||
        text.startsWith("google ")
    ){

        let query = original
            .replace(/^(search|google)\s+/i,"")
            .trim();

        if(query){

            window.open(
                "https://www.google.com/search?q=" +
                encodeURIComponent(query),
                "_blank"
            );

            return `🔎 "${query}" Google पर search कर दिया।`;
        }
    }


    /* DEFAULT */

    if(userName){

        return `Hmm ${userName} 🤔 Main samajhne ki koshish kar raha hoon. Thoda aur batao.`;

    }

    return "Hmm 🤔 Is baat ko thoda aur explain karo, main help karne ki koshish karta hoon.";
}


/* =========================
   SEND MESSAGE
========================= */

function sendMessage(){

    const input =
        document.getElementById("userInput");

    const text =
        input.value.trim();

    if(!text) return;


    addMessage(
        text,
        "user"
    );

    input.value = "";


    document.getElementById("status")
        .innerText = "● Thinking...";


    setTimeout(function(){

        const answer =
            smartAI(text);


        addMessage(
            answer,
            "ai"
        );


        speak(
            answer
            .replace(/<br>/g," ")
        );


        document.getElementById("status")
            .innerText = "● Online";


    },350);
}


/* =========================
   VOICE INPUT
========================= */

function startVoice(){

    const Recognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if(!Recognition){

        botMessage(
            "Voice recognition इस browser में available नहीं है। Chrome या Edge इस्तेमाल करें।"
        );

        return;
    }


    const recognition =
        new Recognition();


    recognition.lang =
        "hi-IN";


    recognition.interimResults =
        false;


    document.getElementById("status")
        .innerText = "● Listening...";


    recognition.onresult =
        function(event){

            const text =
                event.results[0][0].transcript;


            document.getElementById(
                "userInput"
            ).value = text;


            sendMessage();
        };


    recognition.onerror =
        function(){

            document.getElementById("status")
                .innerText = "● Online";
        };


    recognition.onend =
        function(){

            document.getElementById("status")
                .innerText = "● Online";
        };


    recognition.start();
}


/* =========================
   BOT MESSAGE HELPER
========================= */

function botMessage(text){

    addMessage(
        text,
        "ai"
    );

    speak(text);
}


/* =========================
   VOICE REPLY
========================= */

function speak(text){

    if(!("speechSynthesis" in window))
        return;


    speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang =
        "hi-IN";


    speech.rate =
        1;


    speech.pitch =
        1;


    speechSynthesis.speak(
        speech
    );
}


/* =========================
   CLEAR CHAT
========================= */

function clearChat(){

    document.getElementById("chat")
        .innerHTML = "";


    botMessage(
        "Chat clear ho gayi 😊 Phir se baat shuru karein!"
    );
}


/* =========================
   ENTER BUTTON
========================= */

document
.getElementById("userInput")
.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){

            sendMessage();

        }

    }
);

</script>
/* =========================
   G ONE AI - PART 3
   REAL AI BACKEND CONNECTOR
   ========================= */

async function askRealAI(userText) {
    const messages = [];

    // Use the current browser conversation as context when available.
    // `history` is optional; the function still works without it.
    if (Array.isArray(window.gOneHistory)) {
        messages.push(...window.gOneHistory.slice(-20));
    }

    messages.push({ role: "user", content: userText });

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "AI server error");
    }

    return data.reply || data.text || "Mujhe response nahi mila.";
}

/* Replace the old sendMessage() with this version. */
async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    document.getElementById("status").innerText = "● Thinking...";

    try {
        // First use the local smart brain for commands that should happen
        // directly in the browser (time, date, Google, YouTube, etc.).
        const localAnswer = smartAI(text);

        // If the local brain produced a generic fallback, ask the real AI.
        const isFallback =
            localAnswer.includes("samajhne ki koshish") ||
            localAnswer.includes("thoda aur explain karo");

        let answer = localAnswer;

        if (isFallback) {
            answer = await askRealAI(text);
        }

        addMessage(answer, "ai");
        speak(answer.replace(/<br>/g, " "));

        if (!Array.isArray(window.gOneHistory)) window.gOneHistory = [];
        window.gOneHistory.push(
            { role: "user", content: text },
            { role: "assistant", content: answer }
        );
        window.gOneHistory = window.gOneHistory.slice(-40);
        localStorage.setItem("gOneHistory", JSON.stringify(window.gOneHistory));

    } catch (error) {
        console.error(error);
        addMessage(
            "⚠️ Real AI se connection nahi ho paya. Backend aur API key check karo. Local features phir bhi kaam karenge.",
            "ai"
        );
    }

    document.getElementById("status").innerText = "● Online";
}

/* Load saved real-AI conversation context. */
try {
    window.gOneHistory = JSON.parse(localStorage.getItem("gOneHistory") || "[]");
} catch {
    window.gOneHistory = [];
}
