const chatInput = document.querySelector("#chat-input")
const sendBtn = document.querySelector("#send-btn")
const chatCointainer = document.querySelector(".chat-container")
const themeBtn = document.querySelector("#theme-btn")
const delBtn = document.querySelector("#delete-btn")

let userText = null
const initHeight = chatInput.scrollHeight

const CreateElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className)
    chatDiv.innerHTML = html
    return chatDiv
}

const loadChat = () => {
    const themeColor = localStorage.getItem("theme-color")
    
    document.body.classList.toggle("light-mode", themeColor.innerText === "light_mode")
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"

    const defaultText = `    <div class="default-text">
    <h1>ChatGpt 4 (clone)</h1>
    <p>Dibuat oleh <a href="https://deanry.my.id/" target="_blank" class="" style="text-decoration:none;">Rsya</a> dengan html css dan js</p>
</div>`

    chatCointainer.innerHTML = localStorage.getItem("all-chats") || defaultText
    chatCointainer.scrollTo(0, chatCointainer.scrollHeight)
}

loadChat()

const apiResponse = async (incomingChatDiv) => {
    const pElement = document.createElement("p")
    try {
        const json = await (await fetch(`https://aemt.me/gpt4?text=${userText}`)).json()
        pElement.textContent = json.result.trim()
        // if (!json.status) return 
        console.log(json);
    } catch(e) {
        console.log(e);
        pElement.classList.add("error")
        pElement.textContent = `Maaf Terjadi Error Atau Cek Internet Anda. ${e.message} `
    }

    incomingChatDiv.querySelector(".typing-animation").remove()
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement)
    localStorage.setItem("all-chats", chatCointainer.innerHTML)
    chatCointainer.scrollTo(0, chatCointainer.scrollHeight)
}

const copyResponse = (copyBtn) => {
    const responseText = copyBtn.parentElement.querySelector("p")
    navigator.clipboard.writeText(responseText.textContent)
    copyBtn.textContent = "done"
    setTimeout(() => copyBtn.textContent = "content_copy" , 1000);
}

const typingAnimation = () => {
    const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="./images/chatbot.jpg" alt="user-img" width="90px">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
    </div>
    <span onclick="copyResponse(this)" class="material-symbols-outlined">content_copy</span>
</div>`;
    const incomingChatDiv = CreateElement(html, "incoming")
    chatCointainer.appendChild(incomingChatDiv)
    chatCointainer.scrollTo(0, chatCointainer.scrollHeight)
    apiResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim() // ambil text dari chat input
    // console.log(userText);
    if (!userText) return

    chatInput.value = ""
    chatInput.style.height = `${initHeight}px`

    const html = `<div class="chat-content">
                    <div class="chat-details">
                    <img src="./images/user.jpg" alt="user-img" width="90px">
                        <p></p>
                    </div>
                </div>`;
    const outgoingChatDiv = CreateElement(html, "outgoing")
    outgoingChatDiv.querySelector("p").textContent = userText
    document.querySelector(".default-text")?.remove()
    chatCointainer.appendChild(outgoingChatDiv)
    chatCointainer.scrollTo(0, chatCointainer.scrollHeight)
    setTimeout(typingAnimation, 500)
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode")
    localStorage.setItem("theme-color", themeBtn.innerHTML)
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"
})

delBtn.addEventListener("click", () => {
    if(confirm("Kamu yakin menghapus semua chat?")) {
        localStorage.removeItem("all-chats")
        loadChat()
    }
})

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
        event.preventDefault()
        handleOutgoingChat()
    }
})

sendBtn.addEventListener("click", handleOutgoingChat)