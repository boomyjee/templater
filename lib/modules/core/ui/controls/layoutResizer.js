ui.layoutResizer = ui.control.extend({
    
    setValue: function (val) {
        this._super(val);
        if (val && val.type=="absolute")
            this.mover.show();
        else
            this.mover.hide();
    },
    
    init: function (o) {
        this._super(o);
        
        this.element = $("<div>").css({ position: 'absolute',left: 0, right: 0, top: 0, bottom: 0 });
        
        this.mover = $("<div class='highlight-handle'>").css({
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0, zIndex: 999, cursor: 'move'
        }).appendTo(this.element);
        
        this.resizer = $("<div>").css({
            position: 'absolute',
            right: 0, width: 5, top: -24, bottom: 0, cursor: 'w-resize',zIndex: 1001
        }).appendTo(this.element);
        
        var me = this;
        var cmp = me.options.cmp;
        cmp.controlsBack.append(this.element);
        
        setTimeout(function(){
            var startPosition;
            me.mover.draggable({
                helper: function () {
                    return $("<div>");
                },
                start: function () {
                    var val = me.value || {};
                    var pos = val.position;
                    startPosition = { 
                        x: parseFloat(pos.x) || 0,
                        y: parseFloat(pos.y) || 0
                    };
                    Component.previewFrame.showHandles(false);
                },
                drag: function (e,ui) {
                    var x = ui.position.left + startPosition.x;
                    var y = ui.position.top + startPosition.y;
                    
                    var val = me.value || {};                    
                    val.position = { x: x+"px", y:y+"px" };
                    me.setValue(val);
                    
                    cmp.element.css({left:x,top:y});
                    cmp.setHandleIndex(true,true);
                    cmp.parent.setHandleIndex(true,true);
                },
                stop: function () {
                    cmp.element.css({left:"",top:""});

                    Component.app.skipSave = false;
                    me.trigger("change");
                    Component.app.reloadTeaNow();
                    Component.previewFrame.showHandles(true);
                }
            });
            
            me.resizer.draggable({
                axis: "x",
                cursorAt: { left: 0 },
                appendTo: Component.previewFrame.$f("body"),
                helper: function (e,ui) {
                    return $("<div>").addClass("component-resizer-helper").height($(this).height());
                },
                start: function () {
                    ui.layoutCombo.column.showGrid(true);
                    Component.previewFrame.showHandles(false);
                    Component.app.skipSave = true;
                    
                    me.prevValue = false;
                    me.left = cmp.componentHandle.offset().left;
                },
                drag: function (e,ui) {

                    var left = me.left;
                    var right = ui.position.left;
                    var value = me.value || {};
                    
                    if (value.type=="absolute") {
                        cmp.element.css({width:right-left});
                        value.width = (right-left)+"px";
                        me.setValue(value);
                        
                        cmp.setHandleIndex(true,true);
                        cmp.parent.setHandleIndex(true,true);

                        setTimeout(function(){
                            ui.helper.height(me.resizer.height());
                        },1);
                        return;
                    }

                    var theme = Component.app.settings.theme;
                    var sheetWidth = parseFloat(theme.sheet.width);

                    var percent = (right - left) / sheetWidth * 100;
                    var min = 100;
                    var columns = 0;
                    
                    var curr = 0;
                    var m = 2;
                    var w = (100-m*11)/12;
                    var width = false;
                    
                    for (var i=0;i<12;i++) {
                        curr += w;

                        var delta = Math.abs(curr-percent);
                        if (delta<min) {
                            min = delta;
                            columns = i+1;
                            width = curr;
                        }
                        curr += m;
                    }                

                    if (columns && me.prevValue!=columns) {
                        value.type = "column";
                        value.column = columns;
                        me.setValue(value);
                        me.prevValue = columns;
                        
                        me.trigger("change");
                        Component.app.reloadTeaNow();
                        
                        Component.previewFrame.updateHandles(true);
                        setTimeout(function(){
                            ui.helper.height(me.resizer.height());
                        },1);
                    }
                },
                stop: function () {
                    cmp.element.css({width:""});
                    ui.layoutCombo.column.showGrid(false);
                    Component.previewFrame.showHandles(true);

                    Component.app.skipSave = false;
                    me.trigger("change");
                    Component.app.reloadTeaNow();
                }
            });
        },1);
    }
});
