document.addEventListener('DOMContentLoaded', async () => {
    let jsonURL = './src/json/emoji.json';

    fetch(jsonURL).then(resonse => {
        return resonse.json();
    }).then((response) => {
        let emojiContainer = document.querySelector('.emoji_container');
        let fragment = document.createDocumentFragment();

        for (let i = 0; i < response['emoji'].length; i++) {
            let emojiCode = response['emoji'][i];
            let span = document.createElement('span');

            span.innerHTML = emojiCode;
            span.addEventListener('click', () => {
                let chatInput = document.getElementById('chat__input');
                let typingText = chatInput.value;

                typingText += emojiCode;

                chatInput.value = typingText;
            });

            fragment.appendChild(span);
        }

        emojiContainer.appendChild(fragment);
    });
});