
/**
 * @param {HTMLElement} container
 */
export const addScriptsToHead = container => {
    const scriptEls = container.querySelectorAll('script');
    /** @type {HTMLScriptElement} */
    for (const scriptEl of scriptEls) {
        if (
            !document.head.querySelector('script[src="' + scriptEl.src + '"]')
        ) {
            /** @type {HTMLScriptElement} */
            const el = document.createElement('script');
            el.type = scriptEl.type;
            el.src = scriptEl.src;
            document.head.appendChild(el);
        }
        scriptEl.remove()
    }
};

/**
 * @param {HTMLElement} container
 */
export const addLinksToHead = container => {
    const linkEls = container.querySelectorAll('link');
    /** @type {HTMLLinkElement} */
    for (const linkEl of linkEls) {
        if (!document.head.querySelector('link[href="' + linkEl.href + '"]')) {
            /** @type {HTMLLinkElement} */
            const el = document.createElement('link');
            el.type = linkEl.type;
            el.rel = linkEl.rel;
            el.href = linkEl.href;
            document.head.appendChild(el);
        }
        linkEl.remove()
    }
};

const captchaEtat = (function () {
    function _init(container = document) {
        const widgets = container.querySelectorAll('.js-captcha-widget');

        for (const widget of widgets) {
            const htmlContainer = widget.querySelector('.captcha-html-container');
            const idInput = widget.querySelector('.captcha-input [name*="[captcha_id]"]')
            if(htmlContainer.querySelector('.captcha-html')) {
                return
            }

            fetch('/api/simple-captcha').then((response) => {
                return response.text();
            }).then((html) => {
                const tmp = document.createElement('div');
                tmp.innerHTML = html;
                addLinksToHead(tmp);
                addScriptsToHead(tmp);
                const originalIdInput = tmp.querySelector('[name^="BDC_VCID"]')
                idInput.value = originalIdInput.value;

                const tmpRoot = tmp.children.item(0);
                tmpRoot.removeAttribute('id')
                tmpRoot.classList.add('captcha-html');

                htmlContainer.prepend(tmpRoot);

                const soundLink = widget.querySelector('.BDC_SoundLink');
                const answerInput = widget.querySelector('.captcha-input input[type="text"]');
                soundLink.addEventListener('click', function (e) {
                    if(answerInput) {
                        answer.removeAttribute('disabled');
                        answerInput.focus()
                    }
                })
            })
        }
    }

    return { init: _init };
})();

export default captchaEtat;
