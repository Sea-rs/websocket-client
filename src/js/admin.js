document.addEventListener('DOMContentLoaded', () => {
    window.reaction('btn__submit--admin', 'chat__input--admin');

    admin();
    info();

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

    function info() {
        let socket = new window.Socket(5002);

        socket.SUBMIT_BTN = document.getElementById('btn__submit--admin');
        socket.CHAT_INPUT = document.getElementById('chat__input--admin');

        socket.init();
        socket.messageEvent = function(msg) {
            console.log(JSON.parse(msg));
        }

        let sendInfo = function() {
            let notice = document.getElementById('notice_panel').querySelector('input').value;
            let message = document.getElementById('message_panel').querySelector('input').value;
            let description = document.getElementById('description_panel').querySelector('textarea').value;

            let sendObj = {
                'notice': notice,
                'message': message,
                'description': description
            }

            socket.sendMessage(JSON.stringify(sendObj));
        }

        let submitInfoBtn = document.getElementById('info_submit');

        submitInfoBtn.addEventListener('click', sendInfo);
    }
});