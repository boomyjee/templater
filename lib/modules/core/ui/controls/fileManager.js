ui.fileManager = ui.panel.extend({
    updateTimer: false,
    update: function () {
        $.each(this.list,function(i){
            var me = this;
            var el = me.element;
            
            if (el && el.is(":visible")) {
                
                if (!me.frame) {
                    me.frame = $("<iframe>",{
                        name: "browser_"+i,
                        src:Component.app.options.browse_url+"?theme="+me.options.theme+"&type="+me.options.type
                    });
                    me.frame.css({width:"100%",height:"100%",border:"none"}).data("control",me);
                    
                    var parent = el;
                    var z = 0;
                    while (parent.length) {
                        z = parent.css("z-index");
                        if (z!="auto") break;
                        parent = parent.parent();
                    }
                    me.frameDiv = $("<div>").appendTo("body").append(me.frame).css({position:"fixed",zIndex:z});
                }
                
                var off = el.offset();
                me.frameDiv.css({
                    display: "",
                    left: off.left,
                    top: off.top,
                    width: el.width(),
                    height: el.height()
                });
                
            } else {
                if (me.frame && me.frame.css("left")=="auto") {
                    me.frameDiv.hide();
                }
            }
                
        });
    },
    list: []
},{
    init: function (o) {
        this._super($.extend({
            type: "files",
            theme: "templater",
            height: 300
        },o));
        
        var me = this;
        
        this.Class.list.push(this);
        if (!this.Class.updateTimer) {
            this.Class.updateTimer = true;
            setInterval(function(){
                me.Class.update();
            },100);
        }
    },
    setValue: function (val,fromFrame) {
        this.value = val;
        if (this.frameSetValue && !fromFrame)
            this.frameSetValue(val);
    },
    getValue: function () {
        return this.value;
    }
});