fabric.util.object.extend(fabric.IText.prototype,{

    _keysMap: {
        8:  'removeChars',
        13: 'insertNewline',
        37: 'moveCursorLeft',
        38: 'moveCursorUp',
        39: 'moveCursorRight',
        40: 'moveCursorDown',
        46: 'forwardDelete',
        36: 'moveCursorHome',
        35: 'moveCursorEnd'
    },    
    
    initKeyHandlers: function() {
    },

    /**
    * Initializes hidden textarea (needed to bring up keyboard in iOS)
    */
    initHiddenTextarea: function() {
        this.hiddenTextarea = fabric.document.createElement('textarea');

        this.hiddenTextarea.setAttribute('autocapitalize', 'off');
        this.hiddenTextarea.style.cssText = 'position: absolute; top: 0; left: -9999px';

        fabric.document.body.appendChild(this.hiddenTextarea);
        
        fabric.util.addListener(this.hiddenTextarea, 'keydown', this.onKeyDown.bind(this));
        fabric.util.addListener(this.hiddenTextarea, 'keypress', this.onKeyPress.bind(this));
        
        if (!this.returnToTextareaHandler) {
            this.returnToTextareaHandler = true;
            fabric.util.addListener(this.canvas.upperCanvasEl, 'click', this.onClick.bind(this));
        }
    },    
    
    onKeyDown: function(e) {
        if (!this.isEditing) return;
        
        if (e.keyCode in this._keysMap) {
            this[this._keysMap[e.keyCode]](e);
            this.canvas.fire('text:keydown', { target: this });
        }
        else if ((e.keyCode in this._ctrlKeysMap) && (e.ctrlKey || e.metaKey)) {
            this[this._ctrlKeysMap[e.keyCode]](e);
            this.canvas.fire('text:keydown', { target: this });
        }
        else {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        this.canvas && this.canvas.renderAll();
    },    
    
    onKeyPress: function(e) {
        if (!this.isEditing || e.metaKey || e.ctrlKey || e.keyCode === 8 || e.keyCode === 13) {
            return;
        }

        this.insertChars(String.fromCharCode(e.which));
        this.canvas.fire('text:keydown', { target: this });

        e.preventDefault();
        e.stopPropagation();
    },    
    
    moveCursorEnd: function (e) {
        var endLine = this.text.indexOf("\n",this.selectionStart);
        if (endLine==-1) endLine = this.text.length;
        if (e.shiftKey) {
            this.selectionEnd = endLine;
        } else {
            this.selectionEnd = this.selectionStart = endLine;
        }
    },
    
    moveCursorHome: function (e) {
        var startLine = this.text.lastIndexOf("\n",this.selectionStart-1)+1;
        if (startLine==-1) startLine = 0;
        if (this.selectionStart==0) startLine = 0;
        
        if (e.shiftKey) {
            this.selectionEnd = this.selectionStart;
            this.selectionStart = startLine;
        } else {
            this.selectionEnd = this.selectionStart = startLine;
        }
    }
});
