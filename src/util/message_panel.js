class MessagePanel {
    constructor(message) {
        this._timer = null;
        this._panel = null;

        const panelWidth = 300;
        const panelHeight = 200;
        const panelOpacity = 0.75;

        this._panel = document.createElement('div');
        this._panel.style.position = 'fixed';
        this._panel.style.top = '50%';
        this._panel.style.left = '50%';
        this._panel.style.transform = 'translate(-50%, -50%)';
        this._panel.style.width = panelWidth + 'px';
        this._panel.style.height = panelHeight + 'px';
        this._panel.style.backgroundColor =
            'rgba(0, 0, 0, ' + panelOpacity + ')';
        this._panel.style.color = 'lime';
        this._panel.style.zIndex = '9999';
        this._panel.style.fontFamily = 'Courier New';
        this._panel.innerHTML = message;
    }

    show() {
        if (this._timer === null) {
            this._timer = setTimeout(() => {
                document.body.appendChild(this._panel);
                this._timer = null;
            }, 300);
        }
    }

    hide() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        this._panel.remove();
    }
}
