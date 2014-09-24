ui.fileCombo = ui.combo.extend({
    iconPath: function (value,urlValue) {
        var url = value || "";
        var base = Component.app.options.upload_url + "/files/";
        if (!urlValue)
            url = base+url;

        if (url.indexOf(base)===0) url = url.substring(base.length);

        var file = url.split("/").pop();
        var dir = url.substring(0,url.length - file.length - 1);

        var params = $.param({
            type: 'files',
            file: file,
            dir: 'files/'+dir,
            act: 'thumb'
        });
        return Component.app.options.browse_url + "?" + params;
    },
    switcherLabel: function (value,urlValue) {
        
        if (urlValue && value) {
            if (value.indexOf(Component.app.options.upload_url)==-1) {
                return ui.imageCombo.switcherLabel(value,true);
            }
        }
        
        if (!value) {
            return ui.fillCombo.colorLabel('transparent',64,52);
        } else {
            var thumb_url = this.iconPath(value,urlValue);
            var bg = "background-image:url("+thumb_url+")";
            return "<span class='button-image-label' style='"+bg+"'></span>";
        }
    }
},{
    init: function (o) {
        this._super($.extend({
            comboWidth: 670,
            comboHeight: 400,
            urlValue: true,
            label: "File",
            thumb: true
        },o));
        
        this.panel.height(this.options.comboHeight);
        this.bind("opened",this.onOpened);
        this.bind("hide",this.onHide);
    },
    
    setUrl: function (url) {
        var prefix = "http://upload.url/dir/files/";
        if (url.indexOf(prefix)===0) {
            url = url.substring(prefix.length);
        }
        
        if (this.options.urlValue) {
            this.setValue(Component.app.options.upload_url+"/files/"+url);
        } else {
            this.setValue(url);
        }
        this.trigger("change");
    },
    
    getLabel: function () {
        return this.Class.switcherLabel(this.value,this.options.urlValue);
    },
    
    onOpened: function () {
        var me = this;
        if (!me.Class.frame) {
            me.Class.frame = $("<iframe>",{
                name: "image_browser",
                src:Component.app.options.browse_url+"?type=files",
            });
            me.Class.frame.css({width:"100%",height:"100%",border:"none"}).data("control",me);
            me.Class.frameDiv = $("<div class='button-select-panel'>")
                .appendTo(teacss.ui.layer)
                .append(me.Class.frame)
                .css({position:"fixed",border:'1px solid #eee'});
            
            window.KCFinder = {};
            window.KCFinder.callBack = function(url) {
                me.Class.current.setUrl(url);
                me.Class.current.hide();
            };
        }

        var el = me.panel;
        var off = el.offset();
        me.Class.frameDiv.css({
            zIndex: el.css("z-index"),
            display: "",
            left: off.left,
            top: off.top,
            width: el.width(),
            height: el.height()
        });        
        me.Class.current = this;
    },
    
    onHide: function () {
        if (this.Class.frameDiv) this.Class.frameDiv.hide();
    }
});
