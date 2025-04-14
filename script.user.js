// ==UserScript==
// @name         YT Quick DL
// @namespace    https://github.com/qomarhsn/YT-Quick-DL
// @version      2.0
// @description  Adds a floating button to YouTube for quick video downloads via ssyoutube.com.
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

    async function showUblockSuggestion() {
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
                max-width: 400px;
                font-family: Roboto, Arial, sans-serif;
                width: 90%;
            `;

            const title = document.createElement('h2');
            title.textContent = 'Ad Blocker Recommended';
            title.style.cssText = `
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 12px;
                color: #f1f1f1;
            `;

            const message = document.createElement('p');
            message.textContent = 'To avoid ads and redirects on ssyoutube.com, we recommend installing uBlock Origin.';
            message.style.cssText = `
                font-size: 14px;
                color: #aaa;
                margin-bottom: 16px;
                line-height: 1.5;
            `;

            const link = document.createElement('a');
            link.href = 'https://ublockorigin.com/';
            link.target = '_blank';
            link.textContent = 'Install uBlock Origin';
            link.style.cssText = `
                color: #3ea6ff;
                font-weight: 500;
                font-size: 14px;
                text-decoration: none;
            `;

            const checkboxes = document.createElement('div');
            checkboxes.style.cssText = `
                margin-top: 16px;
                font-size: 13px;
            `;

            const checkboxLine = (id, text) => {
                const label = document.createElement('label');
                label.style.cssText = `
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    cursor: pointer;
                `;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = id;
                checkbox.style.marginRight = '8px';
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(text));
                return label;
            };

            checkboxes.appendChild(checkboxLine('dont-show-again', "Don't show again"));
            checkboxes.appendChild(checkboxLine('already-installed', "Already installed"));

            const buttons = document.createElement('div');
            buttons.style.cssText = `
                display: flex;
                justify-content: flex-end;
                margin-top: 24px;
            `;

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Continue';
            confirmBtn.style.cssText = `
                background-color: #3ea6ff;
                color: #fff;
                border: none;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 500;
                border-radius: 2px;
                cursor: pointer;
            `;

            buttons.appendChild(confirmBtn);

            popup.appendChild(title);
            popup.appendChild(message);
            popup.appendChild(link);
            popup.appendChild(checkboxes);
            popup.appendChild(buttons);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            confirmBtn.addEventListener('click', async () => {
                const cb1 = document.getElementById('dont-show-again');
                const cb2 = document.getElementById('already-installed');
                if (cb1.checked || cb2.checked) {
                    await GM.setValue('skipUblockNotification', true);
                }
                document.body.removeChild(overlay);
                resolve('continue');
            });
        });
    }

    async function handleDownloadClick() {
        const skipped = await GM.getValue('skipUblockNotification', false);

        const redirect = () => {
            const newUrl = window.location.href.replace(/(www|m)\.youtube\.com/, 'www.ssyoutube.com');
            window.open(newUrl, '_blank', 'width=800,height=600,toolbar=no,menubar=no,resizable=no,scrollbars=no,status=no');
        };

        if (skipped) {
            redirect();
        } else {
            const result = await showUblockSuggestion();
            if (result === 'continue') {
                redirect();
            }
        }
    }

    function addDownloadButton() {
        const topControls = document.querySelector('.ytp-chrome-top');
        if (!topControls || document.getElementById('ss-download-button')) return;

        const btn = document.createElement('button');
        btn.id = 'ss-download-button';
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
