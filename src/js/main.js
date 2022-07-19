/**
 * TODO
 * No.1 SPなど対応させる
 * 
 * No.x チャットのログを残す
 */

/**
 * 同じJSが実行されたら場合にエラーを起こすことで、
 * 重複実行されないようにする
 */
let isFirst = true;

document.addEventListener('DOMContentLoaded', () => {
    window.Socket = class Socket {
        constructor(PORT = 5000) {
            this.SUBMIT_BTN = document.getElementById('btn__submit');
            this.CHAT_INPUT = document.getElementById('chat__input');
            this.BUTTON = document.getElementsByClassName('js-btn');
            this.CHAT_RECEIVE = document.getElementById('chat__receive');
            this.CHAT_ERROR = document.getElementById('chat__error');

            this.PORT = PORT;

            this.SOCKET_URL = 'ws://192.168.11.7:' + this.PORT;
            this.SOCKET = null;

            this.IS_SMART_PHONE = false;

            this.isFailed = false;
            this.timeoutTime = 0;
            this.messageEvent = null;
        }

        /**
         * 初期化
         */
        init() {
            let that = this;

            this.SOCKET = new WebSocket(this.SOCKET_URL);

            let error = function () {
                that.socketError();
            }

            let open = function () {
                that.openEvent();
            }

            let close = function () {
                that.displayCloseMessage();
            }

            let message = function (msgObj) {
                if (that.messageEvent !== null && typeof that.messageEvent === 'function') {
                    that.messageEvent(msgObj.data);
                }
            }

            this.IS_SMART_PHONE = isSmartPhone();

            this.SOCKET.removeEventListener('error', error);
            this.SOCKET.addEventListener('error', error);

            this.SOCKET.removeEventListener('open', open);
            this.SOCKET.addEventListener('open', open);

            this.SOCKET.removeEventListener('close', close);
            this.SOCKET.addEventListener('close', close);

            this.SOCKET.removeEventListener('message', message);
            this.SOCKET.addEventListener('message', message);
        }

        socketError() {
            this.isFailed = true;

            console.log('%c接続に失敗しました', 'color: red;');
        }

        openEvent(msg) {
            this.timeoutTime = 0;
            this.doEnable();
        }

        displayCloseMessage(msg) {
            /**
             * 再接続を行う。
             * 
             * 5回失敗したら接続行わない。
             */
            if (this.timeoutTime < 5) {
                let reconnect = setInterval(() => {
                    console.log('再接続する');
    
                    clearInterval(reconnect);
    
                    this.SOCKET = null;
                    this.init();
                }, 5000);
            }

            if (this.isFailed) {
                console.log('%cエラーにより接続が切れました', 'color: red;');
            } else {
                console.log('ネットワーク回線の不具合により接続が切れました');
            }

            this.timeoutTime++;

            this.doDisable();
        }

        receiveMessage(msg) {
            this.displayMessage(msg);
        }

        sendMessage(message) {
            if (!message) {
                return;
            }

            this.SOCKET.send(message);
        }

        getSendMessage() {
            let message = this.CHAT_INPUT.value;
            message = message.trim();

            if (message === '') {
                return false;
            }

            this.CHAT_INPUT.value = '';

            return message;
        }

        displayMessage(msg) {
            let messageElem = document.createElement('p');
            let text = document.createElement('span');
            let timeStamp = document.createElement('span');

            messageElem.classList.add('chat__message');
            text.classList.add('text');
            timeStamp.classList.add('chat__timestamp');

            text.innerText = msg.text;
            timeStamp.innerText = getServerDate();

            messageElem.appendChild(text);
            messageElem.appendChild(timeStamp);

            if (msg.isAdmin) {
                messageElem.classList.add('admin_message');
            }

            this.CHAT_RECEIVE.appendChild(messageElem);

            /**
             * 追加されたら、自動でスクロールされるようにする
             */
            this.CHAT_RECEIVE.scrollTop = this.CHAT_RECEIVE.scrollHeight;
        }

        /**
         * 要素を無効化する
         */
        doDisable() {
            for (let i = 0; i < this.BUTTON.length; i++) {
                this.BUTTON[i].setAttribute('disabled', true);
            }

            this.CHAT_INPUT.setAttribute('disabled', true);

            this.CHAT_ERROR.style.display = '';
        }

        /**
         * 要素を有効化する
         */
        doEnable() {
            for (let i = 0; i < this.BUTTON.length; i++) {
                this.BUTTON[i].removeAttribute('disabled');
            }

            this.CHAT_INPUT.removeAttribute('disabled');

            this.CHAT_ERROR.style.display = 'none';
        }
    }

    window.loadChat = function loadChat() {
        let socket = new window.Socket(5000);
    
        socket.init();
        socket.messageEvent = function(msg) {
            msg = JSON.parse(msg);

            socket.receiveMessage(msg);
        }

        let submitBtn = document.getElementById('btn__submit');
        let chatInput = document.getElementById('chat__input');
    
        let clickSend = function () {
            let message = socket.getSendMessage();

            if (!message) {
                return;
            }

            message = {'text': message};

            socket.sendMessage(JSON.stringify(message));
        }
    
        let enterSend = function (key) {
            if (key.key === 'Enter' && !key.shiftKey) {
                let message = socket.getSendMessage();

                if (!message) {
                    return;
                }

                message = {'text': message}

                socket.sendMessage(JSON.stringify(message));

                key.preventDefault();
            }
        }
    
        submitBtn.removeEventListener('click', clickSend);
        submitBtn.addEventListener('click', clickSend);
    
        chatInput.removeEventListener('keydown', enterSend);
        chatInput.addEventListener('keydown', enterSend);
    }

    window.reaction = function reaction(submitBtnClass, chatInputClass) {
        let reactionBtn = document.getElementsByClassName('btn__reaction');
        let toggleReactionBtn = document.getElementById('js-btn__toggle');
        let reactionContainer = document.getElementById('btn__reaction__container');
        let reactionData = {
            'type1' : {
                type: 'type1'
            },
            'type2' : {
                type: 'type2'
            },
            'type3' : {
                type: 'type3'
            },
            'type4' : {
                type: 'type4'
            },
        };
        let socket = new window.Socket(5001);
        let doEnableReaction = true;

        toggleReactionBtn.addEventListener('click', () => {
            // reactionスペースが隠されていたら表示させる
            if (reactionContainer.classList.contains('btn__reaction__container--hidden')) {
                reactionContainer.classList.remove('btn__reaction__container--hidden');
                reactionContainer.classList.add('btn__reaction__container--display');
                toggleReactionBtn.classList.remove('btn__toggle--open');
                toggleReactionBtn.classList.add('btn__toggle--close');

                doEnableReaction = true;
            } else {
                reactionContainer.classList.remove('btn__reaction__container--display');
                reactionContainer.classList.add('btn__reaction__container--hidden');
                toggleReactionBtn.classList.remove('btn__toggle--close');
                toggleReactionBtn.classList.add('btn__toggle--open');

                doEnableReaction = false;
            }
        });

        socket.SUBMIT_BTN = document.getElementById(submitBtnClass);
        socket.CHAT_INPUT = document.getElementById(chatInputClass);

        socket.init();
        socket.messageEvent = function(msg) {
            if (!doEnableReaction) {
                return;
            }

            let type = JSON.parse(msg)['type'];
            let reactionBody = document.querySelector('#reaction');
            let query = '[data-type="' + type +'"]'
            let moveY = 110;
            let maxMoveY = moveY + 300;

            if (isSmartPhone()) {
                moveY = 50;
            }

            let reactionElem = reactionBody.querySelector(query);
            let reaction = reactionElem.cloneNode(true);

            reaction.classList.add('flow_up_reaction');
            reactionBody.appendChild(reaction);

            let animation = function() {
                if (document.visibilityState === 'hidden') {
                    reactionBody.removeChild(reaction);

                    return;
                }

                if (moveY <= maxMoveY) {
                    // 移動量が200px超えたら、リアクション要素を透明にする
                    if (moveY === 200) {
                        reaction.style.opacity = 0;
                    }

                    moveY += 2;

                    reaction.style.top ='-' + moveY + 'px'

                    requestAnimationFrame(animation);
                } else {
                    // reactionBody.removeChild(reaction);
                }
            }

            animation();
        }

        let reaction = function(e) {
            let type = e.target.getAttribute('name');
            socket.sendMessage(JSON.stringify(reactionData[type]));
        }

        for (let i = 0; i < reactionBtn.length; i++) {
            reactionBtn[i].addEventListener('click', reaction);
        }
    }

    function getServerDate() {
        let date = new Date();
    
        let timeHours = date.getHours().toString(10).padStart(2, '0');
        let timeMinutes = date.getMinutes().toString(10).padStart(2, '0');
        let timeSeconds = date.getSeconds().toString(10).padStart(2, '0');
    
        return timeHours + ':' + timeMinutes + ':' + timeSeconds;
    }

    function isSmartPhone() {
        if (/(iPhone)/.test(navigator.userAgent)) {
            return true;
        } else {
            let windowSize = window.outerWidth;

            if (windowSize <= 1080) {
                return true;
            }
        }

        return false;
    }
});
