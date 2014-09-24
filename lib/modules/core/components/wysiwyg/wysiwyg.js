var $ = teacss.jQuery;
var ui = teacss.ui;
var dir = require.dir;

require("./tinymce/jquery.tinymce.min.js");

ui.wysiwyg = ui.control.extend({
    init: function (o) {
        this._super($.extend({
        },o));
        
        var me = this;
        this.element = $("<textarea>",{rows:20});
        this.element.change(function(){
            me.trigger("change");
        });
        
        this.element.css({margin:0,"-moz-box-sizing":'border-box',"-webkit-box-sizing":"border-box"});
        if (this.options.height)
            this.element.css({height:this.options.height});
        
        setTimeout(function(){
            me.element.tinymce({
                script_url: dir ? dir + "/tinymce/tinymce.min.js" : undefined,
                resize: false,
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "emoticons template paste textcolor"
                ],                
                theme: "modern",
                toolbar1: "styleselect | insertfile undo redo | bullist numlist | media link image | forecolor | backcolor | code",
                image_advtab: true,
                
                file_browser_callback: me.options.file_browser_callback,
                oninit: function (ed) {
                    me.editor = ed;
                    me.editor.on('change',function(ed, l) {
                        me.trigger("change");    
                    });      
                    $(me.editor.getBody()).on('blur', function() {
                        me.trigger("change");
                    });
                }
            });
        },1);
    },
    
    getValue: function () {
        if (this.editor) this.editor.save();
        this.value = this.element.val();
        return this.value;
    },
    
    setValue: function (val) {
        this._super(val);
        this.element.val(val || "");
    }
});