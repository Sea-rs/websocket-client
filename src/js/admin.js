document.addEventListener('DOMContentLoaded', () => {
    window.reaction('btn__submit--admin', 'chat__input--admin');

    admin();

    function admin() {
        let socket = new window.Socket(5000);

        socket.CHAT_INPUT = document.getElementById('chat__input--admin');

        socket.init();
        socket.messageEvent = function(msg) {
            msg = JSON.parse(msg);

            socket.receiveMessage(msg);
        }

        let submitBtn = document.getElementById('btn__submit--admin');
        let chatInput = document.getElementById('chat__input--admin');
    
        let clickSend = function () {
            let message = socket.getSendMessage();

            if (!message) {
                return;
            }

            message = {'text': message, 'isAdmin': true};

            socket.sendMessage(JSON.stringify(message));
        }
    
        let enterSend = function (key) {
            if (key.key === 'Enter' && !key.shiftKey) {
                let message = socket.getSendMessage();

                if (!message) {
                    return;
                }

                message = {'text': message, 'isAdmin': true};

                socket.sendMessage(JSON.stringify(message));

                key.preventDefault();
            }
        }
    
        submitBtn.removeEventListener('click', clickSend);
        submitBtn.addEventListener('click', clickSend);
    
        chatInput.removeEventListener('keydown', enterSend);
        chatInput.addEventListener('keydown', enterSend);
    }
});