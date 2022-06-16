let chatBody = document.getElementById("chat__body");
let btnSubmit = document.getElementById("btn--submit");
let btnOpen = document.getElementById("btn--open");
// let btnClose = document.getElementById("btn--close");

let socket = null;

btnOpen.addEventListener("click", () => {
    let socket = new WebSocket("ws://localhost:5000");

    removeEventListener("click", btnSubmit);

    btnSubmit.addEventListener("click", () => {
        socket.send("hello");
    });

    socket.addEventListener("open", (e) => {
        console.log("connected.");
    });
    
    socket.addEventListener("close", (e) => {
        console.log("closed.");
    });
    
    socket.addEventListener("error", (e) => {
        console.log("error.");
    });
    
    socket.addEventListener("message", (e) => {
        let newParagraph = document.createElement("p");
    
        newParagraph.innerText = e.data;
    
        chatBody.appendChild(newParagraph);
    });
});

// btnClose.addEventListener("click", () => {
//     //
// });
