// ==UserScript==
// @name         YT Quick DL
// @namespace    https://github.com/qomarhsn/YT-Quick-DL
// @version      3.0
// @description  Adds a floating button to YouTube for quick video downloads via cobalt.tools.
// @author       Qomarul Hasan
// @license      MIT
// @match        *://www.youtube.com/watch?v*
// @match        *://m.youtube.com/watch?v*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-end
// @grant        GM.setValue
// @grant        GM.getValue
// @homepageURL  https://github.com/qomarhsn/YT-Quick-DL
// @supportURL   https://github.com/qomarhsn/YT-Quick-DL/issues
// @updateURL    https://github.com/qomarhsn/YT-Quick-DL/raw/main/script.user.js
// @downloadURL  https://github.com/qomarhsn/YT-Quick-DL/raw/main/script.user.js
// ==/UserScript==

(function () {
    'use strict';

    async function showInfoPopup() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background-color: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;

            const popup = document.createElement('div');
            popup.style.cssText = `
                background-color: #282828;
                color: #fff;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                max-width: 500px;
                font-family: Roboto, Arial, sans-serif;
                width: 90%;
                font-size: 14px;
                line-height: 1.5;
            `;

            const title = document.createElement('h2');
            title.textContent = 'YT Quick DL';
            title.style.cssText = `
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 10px;
                color: #f1f1f1;
            `;

            const scriptDesc = document.createElement('p');
            scriptDesc.textContent = 'YT Quick DL is a simple userscript that adds a floating button on YouTube pages for quick video downloads via cobalt.tools.';
            scriptDesc.style.marginBottom = '12px';

            const cobaltInfo = document.createElement('div');
            cobaltInfo.innerHTML = `
                <strong>About cobalt.tools:</strong><br>
                Cobalt.tools is one of the best free video and audio downloaders for various sites — ad-free, fast, and easy to use.<br><br>
                <em>Important:</em><br>
                - Configure your preferred video quality, audio quality, and file format on cobalt.tools first. It doesn’t let you choose these during download, but defaults are usually fine.<br>
                - After opening cobalt.tools, <strong>you must manually click the ">>" button</strong> next to the URL input to start the download.<br>
                - We've requested the maintainers to add auto-download support. They said it’s coming soon!<br><br>
                See the script source on <a href="https://github.com/qomarhsn/YT-Quick-DL" target="_blank" style="color:#3ea6ff;text-decoration:none;">GitHub</a>.
            `;
            cobaltInfo.style.marginBottom = '16px';

            const checkbox = document.createElement('label');
            checkbox.style.cssText = 'display: flex; align-items: center; margin-top: 10px;';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'dont-show-again';
            input.style.marginRight = '8px';
            checkbox.appendChild(input);
            checkbox.appendChild(document.createTextNode("Don't show again"));

            const buttons = document.createElement('div');
            buttons.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 24px;';

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Continue';
            confirmBtn.style.cssText = `
                background-color: #3ea6ff;
                color: #fff;
                border: none;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 500;
                border-radius: 4px;
                cursor: pointer;
            `;

            buttons.appendChild(confirmBtn);

            popup.appendChild(title);
            popup.appendChild(scriptDesc);
            popup.appendChild(cobaltInfo);
            popup.appendChild(checkbox);
            popup.appendChild(buttons);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            confirmBtn.addEventListener('click', async () => {
                if (input.checked) {
                    await GM.setValue('skipInfoPopup', true);
                }
                document.body.removeChild(overlay);
                resolve('continue');
            });
        });
    }

    async function handleDownloadClick() {
        const skipped = await GM.getValue('skipInfoPopup', false);

        const redirect = () => {
            const youtubeUrl = encodeURIComponent(window.location.href);
            const cobaltUrl = `https://cobalt.tools/?u=${youtubeUrl}`;
            window.open(cobaltUrl, '_blank');
        };

        if (skipped) {
            redirect();
        } else {
            const result = await showInfoPopup();
            if (result === 'continue') {
                redirect();
            }
        }
    }

    function addDownloadButton() {
        const topControls = document.querySelector('.ytp-chrome-top');
        if (!topControls || document.getElementById('cobalt-download-button')) return;

        const btn = document.createElement('button');
        btn.id = 'cobalt-download-button';
        btn.className = 'ytp-button';
        btn.style.position = 'absolute';
        btn.style.top = '12px';
        btn.style.left = '12px';
        btn.style.width = '36px';
        btn.style.height = '36px';
        btn.style.borderRadius = '50%';
        btn.style.background = 'rgba(255, 255, 255, 0.4)';
        btn.style.padding = '6px';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.transition = '0.3s';

        btn.onmouseover = () => btn.style.background = 'rgba(255, 255, 255, 0.6)';
        btn.onmouseout = () => btn.style.background = 'rgba(255, 255, 255, 0.4)';

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "black");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M5 20h14v-2H5v2zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1z");

        svg.appendChild(path);
        btn.appendChild(svg);

        btn.onclick = handleDownloadClick;

        topControls.appendChild(btn);
    }

    function observeDOM() {
        const observer = new MutationObserver(() => addDownloadButton());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    addDownloadButton();
    observeDOM();
})();
