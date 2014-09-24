ui.layoutResizer = ui.control.extend({
    setValue: function (val) {
        this._super(val);
        if (val && val.type=="absolute")
            this.mover.show();
        else
            this.mover.hide();
    },
    
    startDrag: function (e,ui) {
        teacss.ui.layoutCombo.column.showGrid(true);
        Component.previewFrame.showHandles(false);
        Component.app.skipSave = true;

        var me = this;
        var val = me.value = me.value || {};
        var pos = val.position || {};
        var cmp = me.options.cmp;

        me.startPosition = { 
            x: pos.x ? (parseFloat(pos.x) || 0) : 0,
            y: pos.y ? (parseFloat(pos.y) || 0) : 0,
            z: pos.z
        };
        me.handleStartOffset = cmp.componentHandle.offset();
        me.startOffset = ui.offset;
        Component.previewFrame.showHandles(false);
    },
    
    endDrag: function (e,ui) {
        teacss.ui.layoutCombo.column.showGrid(false);
        Component.app.skipSave = false;
        this.trigger("change");
        
        Component.app.reloadTeaNow();
        Component.previewFrame.showHandles(true);
        this.options.cmp.element.css({left:"",top:"",width:"",height:""});
    },
    
    draggable: function (el,o) {
        var me = this;
        el.draggable($.extend({
            distance: 3,
            appendTo: Component.previewFrame.$f("body"),
            helper: function () { return $("<div>") },
            start: function (e,ui) {
                me.startDrag(e,ui);
            },
            stop: function (e,ui) {
                me.endDrag(e,ui);
            }
        },o));
    },
    
    updateHandles: function () {
        var cmp = this.options.cmp;
        cmp.setHandleIndex(true,true);
        cmp.parent.setHandleIndex(true,true);
    },
    
    initDraggables: function (cmp) {
        var me = this;
        this.draggable(me.mover,{
            drag: function (e,ui) {
                var x = ui.offset.left + me.startPosition.x - me.startOffset.left;
                var y = ui.offset.top + me.startPosition.y - me.startOffset.top;
                
                me.value.position = { x: x+"px", y:y+"px", z: me.startPosition.z };
                
                cmp.element.css({left:x,top:y});
                me.updateHandles();
            }
        });  
        
        this.draggable(me.heightResizer,{
            axis: "y",
            helper: function (e,ui) {
                return $("<div>").addClass("component-resizer-helper").width($(this).width());
            },
            drag: function (e,ui) {
                var height = ui.offset.top - me.handleStartOffset.top;
                cmp.element.css({height:height});
                me.value.height = height+"px";
                me.updateHandles();
            }
        });        
        
        this.draggable(me.widthResizer,{
            axis: "x",
            helper: function (e,ui) {
                return $("<div>").addClass("component-resizer-helper").height($(this).height());
            },
            drag: function (e,ui) {
                var width = ui.offset.left - me.handleStartOffset.left;
                if (me.value.type=="absolute") {
                    cmp.element.css({width:width});
                    me.value.width = width+"px";
                    me.updateHandles();
                } else {
                    var theme = Component.app.settings.theme;
                    var sheetWidth = parseFloat(theme.sheet.width);
                    var percent = width / sheetWidth * 100;
                    
                    var gap = 2, col = (100-gap*11)/12, columns = 0, min = 1000;
                    
                    for (var i=1;i<=12;i++) {
                        var pos = (col+gap)*i - gap;
                        var delta = Math.abs(pos-percent);
                        if (delta<min) {
                            min = delta;
                            columns = i;
                        }
                    }
                    
                    if (columns && columns!=me.value.column) {
                        me.value.column = columns;
                        me.trigger("change");
                        me.updateHandles();
                        Component.app.reloadTeaNow();
                    }
                }
                setTimeout(function(){
                    ui.helper.height(me.widthResizer.height());
                },1);
            }
        });        
    },
    
    init: function (o) {
        this._super(o);
        
        this.element = $("<div>").css({ position: 'absolute',left: 0, right: 0, top: 0, bottom: 0 });
        
        this.mover = $("<div class='highlight-handle'>").css({
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0, zIndex: 999, cursor: 'move'
        }).appendTo(this.element);
        this.mover.dblclick(function(e){ cmp.selectNext(e) });
        
        this.widthResizer = $("<div>").css({
            position: 'absolute',
            right: 0, width: 5, top: 0, bottom: 0, cursor: 'w-resize',zIndex: 1001
        }).appendTo(this.element);
        
        this.heightResizer = $("<div>").css({
            position: 'absolute',
            bottom: 0, height: 5, left: 0, right: 0, cursor: 's-resize',zIndex: 1001
        }).appendTo(this.element);
        
        var me = this;
        var cmp = me.options.cmp;
        cmp.controlsBack.append(this.element);
        
        setTimeout(function(){
            me.initDraggables(cmp);
        });
    }
});
