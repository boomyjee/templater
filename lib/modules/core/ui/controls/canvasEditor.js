ui.canvasFillCombo = ui.fillCombo.extend({
    extraItems: [{value:false,color:'white',label:'X'}]
},{});

fabric.TextCanvas = fabric.util.createClass(fabric.Canvas, {
    setValue: function (bg) {
        if (!this.text) {
            var text = new fabric.IText("",{
                hasBorders: false,
                hasControls: false,
                hasRotatingPoint: false,
                lockMovementX: true, 
                lockMovementY: true, 
                lockRotation: true, 
                lockScalingX: true, 
                lockScalingY: true, 
                lockUniScaling: true
            });
        } else {
            var text = this.text;
        }
        
        text.text = bg.text || "< enter text >";
        
        var fields = {fill:"fillValue",fontFamily:0,fontSize:0,stroke:"strokeValue",strokeWidth:0,lineHeight:0};
        for (var key in fields) {
            var val,valueKey = fields[key];
            if (valueKey) {
                text[valueKey] = bg[valueKey];
                val = teacss.functions.color(text[valueKey]);
            } else {
                val = bg[key];
            }
            if (val) text[key] = val;
        }
        
        var shadowColor = teacss.functions.color(bg.shadowColorValue);
        if (shadowColor) {
            var sh = {
                color: shadowColor,
                blur: bg.shadowBlur || 3,
                offsetX: bg.shadowX  || 2,
                offsetY: bg.shadowY  || 2
            }
            text.setShadow(sh);
        }
        
        var s = text.styles = $.extend(true,{},bg.styles);
        for (var p1 in s) {
            for (var p2 in s[p1]) {
                var st = s[p1][p2];
                if (st.fillValue) 
                    st.fill = teacss.functions.color(st.fillValue).toString();
            }
        }
        if (!this.text) {
            this.text = text;
            this.add(text);
        }
        
        text.setCoords();
        this.renderAll();
    }
});

var CanvasWrapper = {
    init: function () {
        if (this.canvas) return;
        
        var frame = Component.previewFrame.frame;
        var off = frame.offset();
        var canvasEl = document.createElement("canvas");

        this.canvasDiv = $("<div>")
            .css({ position: "absolute", overflow: "hidden", left: off.left, right: 0, top: off.top, bottom: 0 })
            .appendTo("body")
            .append(canvasEl)
            .hide()

        var overlay = this.overlay = $("<div>")
            .css({ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 })
            .appendTo(this.canvasDiv);

        for (var i=0;i<8;i++) {
            overlay.append($("<div>")
                .css({position:'absolute',zIndex: 1001,background:'rgba(0,0,0,0.3)'})
                .click(function(){
                    CanvasWrapper.hide();
                })
            );
        }            

        this.canvas = new fabric.TextCanvas(canvasEl);
        this.canvas.setDimensions({width:800,height:500});

        this.canvasContainer = this.canvasDiv.children().eq(0).css({zIndex:1000,position:"absolute"});

        var me = this;
        var update = function(){
            me.updateOverlay();
            clearTimeout(me.selectionTimeout);
            me.selectionTimeout = setTimeout(function(){
                me.updateSelection();
            },1);
        };
        
        this.canvas.on("text:editing:entered",update);
        this.canvas.on('text:selection:changed',update);
        this.canvas.on('text:keydown',update);
    },
    
    connectTo: function (editor) {
        this.init();
        this.editor = editor;
        this.cmp = editor.options.cmp;
        this.setValue(editor.getValue());
    },
    
    show: function (editor,hideCallback) {
        this.connectTo(editor);
        this.hideCallback = hideCallback;
        
        var el = this.cmp.componentHandle;
        var off = el.offset();
        var frame = Component.previewFrame.frame;
        var frameScroll = $(frame[0].contentWindow).scrollTop();
        var w = el.outerWidth();
        var h = el.outerHeight();
        
        if (frameScroll > off.top-10) {
            $(frame[0].contentWindow).scrollTop(off.top-10);
            frameScroll = $(frame[0].contentWindow).scrollTop();
        }
        
        var x = off.left;
        var y = off.top - frameScroll;
        
        this.cmp.element.css({background:"transparent"});
        
        this.canvasDiv.show();
        this.canvasContainer.css({left:x,top:y});
        
        this.canvas.setActiveObject(this.canvas.text);
        this.canvas.text.__lastPointer = {};
        this.canvas.text.enterEditing();
        this.canvas.calcOffset();
        
        this.updateOverlay();
        this.updateSelection();
    },
    
    hide: function () {
        this.canvas.text.exitEditing();
        this.canvasDiv.hide();
        this.cmp.element.css({background:""});
        
        this.editor.updateSelection();
        if (this.hideCallback) this.hideCallback();
    },
    
    updateSelection: function () {
        var obj = this.canvas.text;
        var def = {
            fillValue: obj.fillValue,
            fontSize: obj.fontSize,
            fontFamily: obj.fontFamily
        };
        var start = obj.selectionStart;
        var end = obj.selectionEnd;
        
        if (start>=end) end = start + 1;
        if (start>=obj.text.length) {
            start = obj.text.length - 1;
            end = obj.text.length;
        }
        
        var styles = obj.styles;
        var list = [];
        for (var i = start; i < end; i++) {
            var loc = obj.get2DCursorLocation(i);
            var st = {};
            if (styles[loc.lineIndex]) {
                st = styles[loc.lineIndex][loc.charIndex] || {};
            }
            var it = $.extend({},def,st);
            list.push(it);
        }
        if (list.length==0) list.push(def);
        this.editor.updateSelection(list);
    },
    
    // update overlay hole position according to the text dimensions
    updateOverlay: function () {
        if (!this.canvas.text.isEditing) return;
        
        this.canvas.text.setCoords();
        var pos = this.canvasContainer.position();
        var rect = this.canvas.text.getBoundingRect();
        
        var xx = [ 0 , pos.left , pos.left + rect.width  , this.overlay.width()  ];
        var yy = [ 0 , pos.top  , pos.top  + rect.height , this.overlay.height() ];
        
        var cnt = 0, 
            list = this.overlay.children();
        
        for (var i=0;i<3;i++) {
            for (var j=0;j<3;j++) {
                if (i==1 && j==1) continue;
                list.eq(cnt++).css({
                    left: xx[i], width:  xx[i+1]-xx[i],
                    top:  yy[j], height: yy[j+1]-yy[j]
                });
            }
        };
    },
    
    // copies value to canvas
    setValue: function (val) {
        this.value = val;
        this.canvas.setValue(this.value);
        this.updateOverlay();
    },
    
    // get value from canvas
    getValue: function () {
        // we get some plain properties from this.value set in setValue functions
        var val = $.extend(true,{},this.value);
        this.canvas.text.setCoords();
        // and other like width/height/text/styles directly from canvas
        var rect = this.canvas.text.getBoundingRect();
        val.width = Math.ceil(rect.width);
        val.height = Math.ceil(rect.height);
        val.text = this.canvas.text.getText();
        val.styles = $.extend(true,{},this.canvas.text.styles);
        $.each(val.styles,function(i,list){
            $.each(list,function(j,st){
                delete st.fill;
                if (Object.keys && Object.keys(st).length==0) delete list[j];
            });
            if (Object.keys && Object.keys(list).length==0) delete val.styles[i];
        });
        return val;
    },
    
    changeValue: function (sub,key) {
        // we behave differently in editing mode and in general
        if (this.canvas.text.isEditing) {
            // in edit mode we change selection styles for some keys
            if (key=="fontFamily" || key=="fillValue" || key=="fontSize") {
                var hash = {}; 
                hash[key] = sub;
                if (key=="fillValue") hash["fill"] = teacss.functions.color(sub);
                this.canvas.text.setSelectionStyles(hash);
                this.canvas.renderAll();
                this.canvas.text.setCoords();
            } 
            // just change saved value for others
            else {
                this.value[key] = sub;
                this.canvas.setValue(this.value);
            }
        } else {
            // otherwise we change object values and clear styles for this key
            this.value[key] = sub;
            $.each(this.canvas.text.styles,function(i,list){
                $.each(list,function(j,st){
                    delete st[key];
                });
            });
            this.value.styles = this.getValue().styles;
            this.canvas.setValue(this.value);
        }
        this.updateOverlay();
    }
    
}

ui.canvasEditor = ui.panel.extend({},{
    init: function (o) {
        this._super($.extend({
            width: "100.0%",
            margin: 0
        },o));
        
        var me = this;
        
        this.editButton = $("<span>",{title:"Edit text"})
            .text('\uf040') // pencil icon
            .css({
                display:"inline-block",
                fontFamily:"FontAwesome",
                fontSize: "32px",
                lineHeight: "48px"
            })
            .click(function(){me.startEdit()});        
        me.options.cmp.controlsCenter.append(me.editButton);
        
        this.push(
            ui.label({template:"Text options",width:'100%',margin:"0 0 0 0"}),
            me.fontCombo = ui.fontCombo({
                falseItem: false,
                width:"80%",margin:"0 2% 5px 0",
                change:function(){ me.changed(this.value,'fontFamily') }
            }),
            me.fillCombo = ui.canvasFillCombo({
                width:"18.0%",margin:"0 0 5px 0",value:'black',label:false,
                change:function(){ me.changed(this.value,'fillValue') }
            }),
            me.fontSizeCombo = ui.lengthCombo({
                label:'Font size',
                options:[{value:'-',label:'-',hidden:true},16,24,32,48,64,100,120],units:false,labelUnits:"px",
                min:8,max:80,margin:"0 2% 0 0",width:"49.0%",
                change:function(){ me.changed(this.value,'fontSize') }
            }),
            me.lineHeightCombo = ui.lengthCombo({
                label:'Line height',options:[0.5,1.0,1.3,1.5,2.0,2.5], units: false,
                min:0.5,max:3,margin:"0 0 0",width:"49.0%",value:'1.3',
                change:function(){ me.changed(this.value,'lineHeight') }
            }),

            ui.label({template:"Stroke",width:'100%',margin:"10px 0 0 0"}),
            me.strokeWidthCombo = ui.lengthCombo({
                label:'Width',options:[1,2,3,5,7,10,15],min:0,max:50,units:false,labelUnits:"px",
                margin:"0 2% 0 0",width:"80.0%",
                change:function(){ me.changed(this.value,'strokeWidth') }
            }),
            me.strokeColorCombo = ui.canvasFillCombo({
                width:"18.0%",margin:"0 0 0px 0",label:false,
                change:function(){ me.changed(this.value,'strokeValue') }
            }),

            ui.label({template:"Shadow",width:'100%',margin:"10px 0 0 0"}),
            me.shadowXCombo = ui.lengthCombo({
                label:'X',options:[1,2,3,5,7,10,15],min:0,max:50,units:false,labelUnits:"px",
                margin:"0 2% 0 0",width:"25%",
                change:function(){ me.changed(this.value,'shadowX') }
            }),
            me.shadowYCombo = ui.lengthCombo({
                label:'Y',options:[1,2,3,5,7,10,15],min:0,max:50,units:false,labelUnits:"px",
                margin:"0 2% 0 0",width:"25%",
                change:function(){ me.changed(this.value,'shadowY') }
            }),
            me.shadowBlurCombo = ui.lengthCombo({
                label:'Blur',options:[1,2,3,5,7,10,15],min:0,max:50,units:false,labelUnits:"px",
                margin:"0 2% 0 0",width:"26.0%",
                change:function(){ me.changed(this.value,'shadowBlur') }
            }),
            me.shadowColorCombo = ui.canvasFillCombo({
                label:false,width:"18%",margin:"0 0 0px",value:"rgba(0,0,0,0.3)",
                change:function(){ me.changed(this.value,'shadowColorValue') }
            })
        );
    },
    
    // called on any control change
    changed: function (sub,key) {
        var val = this.value || {};
        val.styles = val.styles || {};
        
        if (
            (key=="fillValue"  && sub==false) ||
            (key=="fontSize"   && sub=='-') ||
            (key=="fontFamily" && sub=='-')
        ) {
            // if sub is combined value, restore value from backup
            this.value = this.valueBackup;
            CanvasWrapper.connectTo(this);
        } else {
            // render current value into canvas
            CanvasWrapper.connectTo(this);
            // it's normal value - change value in the canvas
            CanvasWrapper.changeValue(sub,key);
        }
        // get back canvas value (width/height may changed)
        this.value = CanvasWrapper.getValue();
        if (!this.isEditing) this.trigger("change");
    },
    
    setValue: function (val) {
        val = val || {};
        val.styles = val.styles || {};
        this._super(val);
        
        this.updateSelection();
        
        this.strokeWidthCombo.setValue(val.strokeWidth || 0);
        this.strokeColorCombo.setValue(val.stroke);
        
        this.shadowXCombo.setValue(val.shadowX||2);
        this.shadowYCombo.setValue(val.shadowY||2);
        this.shadowBlurCombo.setValue(val.shadowBlur||3);
        this.shadowColorCombo.setValue(val.shadowColor);
    },    
    
    startEdit: function () {
        this.isEditing = true;
        CanvasWrapper.show(this,$.proxy(this.endEdit,this));
    },
    
    endEdit: function () {
        this.isEditing = false;
        this.value = CanvasWrapper.getValue();
        this.trigger("change");
        
        Component.app.reloadTeaNow();
        Component.previewFrame.updateHandles(true);
    },
    
    // update controls values based on current selection
    // in non-edit mode whole text is selected and list param is undefined
    updateSelection: function (list) {
        var def = {
            fillValue:  this.value.fillValue  || "#000",
            fontSize:   this.value.fontSize   || 16,
            fontFamily: this.value.fontFamily || "Times New Roman"
        };
        
        if (!list) {
            list = [];
            $.each(this.value.styles,function(i,st){
                $.each(st,function(j,s){
                    list.push($.extend({},def,s));
                });
            });
            if (list.length==0 || list.length<this.value.text.length) list.push(def);
        }
        
        var ret = {};
        $.each(["fillValue","fontFamily","fontSize"],function(i,key){
            ret[key] = list[0][key];
            $.each(list,function(j,item){
                var a = item[key];
                var b = ret[key];
                if (a!=b && !(a && b && a.length && b.length && a[0]==b[0] && a[1]==b[1] && a.length==2 && b.length==2)) {
                    ret[key] = false;
                    return false;
                }
            });
        });
        
        this.fontCombo.setValue(ret.fontFamily || "-");
        this.fillCombo.setValue(ret.fillValue);
        this.fontSizeCombo.setValue(ret.fontSize || "-");
        
        this.valueBackup = $.extend(true,{},this.value);
    }
});