ui.canvasFillCombo = ui.fillCombo.extend({
    extraItems: [{value:false,color:'white',label:'X'}]
},{});

ui.canvasEditor = ui.Control.extend({
    init: function (o) {
        var me = this;
        this._super(o);
        this.element = $("<span>",{title:"Edit canvas"})
        .text('\uf040') // pencil icon
        .css({
            display:"inline-block",
            fontFamily:"FontAwesome",
            fontSize: "32px",
            lineHeight: "48px"
        })
        .click(function(){me.startEditor()});
    },    
    
    initEditor: function () {
        if (this.dialog) return;
        
        var me = this;
        this.canvasElement = document.createElement('canvas');
        
        this.dialog = ui.panel({margin:0});
        this.dialog.element.hide().appendTo(teacss.ui.layer);
        this.dialog.element.append(this.canvasElement);
        
        this.overlay = $("<div>").css({
            position: "absolute",
            left: 0, top: 0, right: 0, bottom: 0,zIndex: 999
        }).hide().appendTo("body");
        
        
        this.toolbar = ui.dialog({
            width: 200,
            height: 'auto',
            title: "Toolbar",
            resizable: false,
            minHeight: 0,
            closeOnEscape: false,
            dialogClass: 'canvas-editor-toolbar',
            position: {
                my: "right top",
                at: "left-10 top",
                of: this.dialog.element
            },
            close: function () {
                me.closeEditor();
            }
            
        });    
        this.toolbar.push(
            ui.panel({padding:10,margin:0,width:'100%'}).push(
                ui.label({template:"Create new",width:'100%',margin:"-5px 0 0 0"}),
                ui.button({
                    label:'Text',width:'49.0%',margin:"0 2% 0px 0",
                    icons: { primary: 'fa fa-font' }, click: function () {
                        me.canvas.add( 
                            new fabric.IText("New Text", 
                                { 
                                    left: 20, top: 20, fontSize: 30,
                                    strokeLineCap: 'round', strokeLineJoin: 'round'
                                }
                            )
                        );
                    }
                }),
                me.newImageCombo = ui.combo({
                    label:'Image',width:'49.0%',margin:"0 0 0px 0",
                    icons: { primary: 'fa fa-picture-o' },
                    comboWidth: 500, comboHeight: 1000, items: [
                        me.newImageManager = ui.fileManager({
                            margin:0,width:"100.0%",height:400,
                            change: function () {
                                var img = this.value;
                                me.newImageCombo.hide();
                                me.newImageManager.setValue(false);
                                
                                fabric.Image.fromURL(Component.app.options.upload_url+"/files/"+img,function(obj){
                                    me.canvas.add(obj);
                                });
                            }
                        })
                    ]
                }),

                me.withSelectedPanel = ui.panel({margin:0,width:'100%'}).push(
                    ui.label({template:"With selected",width:'100%',margin:"10px 0 0 0"}),
                    ui.button({
                        label:'Remove',width:'49%',margin:"0 2% 0 0",
                        icons: { primary: 'fa fa-times' },
                        click: function () { me.remove() }
                    }),
                    ui.button({
                        label:'Unscale',width:'49%',margin:"0 0 0 0",
                        icons: { primary: 'fa fa-arrows-alt' },
                        click: function () { me.unscale() }
                    })
                ),
                
                me.textOptionsPanel = ui.panel({margin:0,width:"100%"}).push(
                    ui.label({template:"Text options",width:'100%',margin:"10px 0 0 0"}),
                    me.fontCombo = ui.fontCombo({
                        falseItem: false,
                        width:"100%",margin:"0 0 5px",
                        change:function(){
                            var obj = me.canvas.getActiveObject();
                            var val = this.value;
                            if (this.value=='-') return me.restoreStyles();
                            
                            if (obj.isEditing) {
                                obj.setSelectionStyles({fontFamily:val});
                            } else {
                                obj.removeStyles.call(obj,"fontFamily");
                                obj.setFontFamily(val);
                            }
                            obj.setCoords();
                            me.canvas.renderAll();                              
                        }
                    }),
                    me.fillCombo = ui.canvasFillCombo({
                        width:"18.0%",margin:"0 2% 5px 0",value:'black',label:false,
                        change: function () {
                            var obj = me.canvas.getActiveObject();
                            var val = this.value;
                            if (this.value==false) return me.restoreStyles();
                            
                            var plain = teacss.functions.color(val).toString();
                            
                            if (obj.isEditing) {
                                obj.setSelectionStyles({fill:plain,fillValue:val});
                            } else {
                                obj.removeStyles.call(obj,"fill");
                                obj.removeStyles.call(obj,"fillValue");
                                obj.fillValue = val;
                                obj.fill = plain;
                            }
                            me.canvas.renderAll();                            
                        }
                    }),
                    me.fontSizeCombo = ui.lengthCombo({
                        label:'Font size',options:[16,24,32,48,64,100,120],
                        min:8,max:80,margin:"0 0 5px",width:"80.0%",value:'16px',
                        change: function () {
                            var obj = me.canvas.getActiveObject();
                            var val = parseFloat(this.value)||16;
                            if (this.value=='-') return me.restoreStyles();
                            
                            if (obj.isEditing) {
                                obj.setSelectionStyles({fontSize:val});
                            } else {
                                obj.removeStyles.call(obj,"fontSize");
                                obj.setFontSize(val);
                            }
                            obj.setCoords();
                            me.canvas.renderAll();
                        }
                    }),
                    me.lineHeightCombo = ui.lengthCombo({
                        label:'Line height',options:[0.5,1.0,1.3,1.5,2.0,2.5], units: false,
                        min:0.5,max:3,margin:"0 0 0",width:"100.0%",value:'1.3',
                        change: function () {
                            var obj = me.canvas.getActiveObject();
                            var val = parseFloat(this.value)||1.3;
                            obj.setLineHeight(val);
                            obj.setCoords();
                            me.canvas.renderAll();
                        }
                    })                   
                ),

                me.strokePanel = ui.panel({margin:0,width:"100%"}).push(
                    ui.label({template:"Stroke",width:'100%',margin:"10px 0 0 0"}),
                    me.strokeColorCombo = ui.canvasFillCombo({
                        width:"18.0%",margin:"0 2% 0px 0",label:false,
                        change: function () { 
                            var obj = me.canvas.getActiveObject();
                            obj.strokeValue = this.value;
                            obj.setStroke(
                                teacss.functions.color(this.value).toString()
                            );
                            me.canvas.renderAll();
                        }
                    }),
                    me.strokeWidthCombo = ui.lengthCombo({
                        label:'Width',options:[1,2,3,5,7,10,15],min:0,max:50,
                        margin:"0 0 0",width:"80.0%",value:"0px",
                        change: function () { 
                            var obj = me.canvas.getActiveObject();
                            obj.setStrokeWidth(parseFloat(this.value)||0);
                            me.canvas.renderAll();
                        }
                    })
                ),

                me.shadowPanel = ui.panel({margin:0,width:"100%"}).push(
                    ui.label({template:"Shadow",width:'100%',margin:"10px 0 0 0"}),
                    me.shadowXCombo = ui.lengthCombo({
                        label:'X',options:[1,2,3,5,7,10,15],min:0,max:50,
                        margin:"0 2% 5px 0",width:"49%",value:"2px",
                        change: function () {
                            me.updateShadow();
                        }
                    }),
                    me.shadowYCombo = ui.lengthCombo({
                        label:'Y',options:[1,2,3,5,7,10,15],min:0,max:50,
                        margin:"0 0 5px",width:"49%",value:"2px",
                        change: function () {
                            me.updateShadow();
                        }
                    }),
                    me.shadowBlurCombo = ui.lengthCombo({
                        label:'Blur',options:[1,2,3,5,7,10,15],min:0,max:50,
                        margin:"0 2% 0 0",width:"80.0%",value:"3px",
                        change: function () {
                            me.updateShadow();
                        }
                    }),
                    me.shadowColorCombo = ui.canvasFillCombo({
                        label:false,width:"18%",margin:"0 0 0px",value:"rgba(0,0,0,0.3)",
                        change: function () {
                            me.updateShadow();
                        }
                    })
                )
            )
        );
        
        this.canvas = new fabric.CustomCanvas(this.canvasElement);

        this.updateToolbar();
        this.canvas.on('object:selected',function(){ me.updateToolbar() });
        this.canvas.on('selection:created',function(){ me.updateToolbar() });
        this.canvas.on('selection:cleared',function(){ me.updateToolbar() });
        
        this.canvas.on("text:editing:entered",function(){ setTimeout(function(){ me.updateSelection() },1); });
        this.canvas.on("text:editing:entered",function(){ setTimeout(function(){ me.updateSelection() },1); });
        this.canvas.on('text:selection:changed',function(){ setTimeout(function(){ me.updateSelection() },1); });
        this.canvas.on('text:keydown',function(){ setTimeout(function(){ me.updateSelection() },1); });
        
        if (me.value) {
            me.setValue(me.value);
        }
    },
    
    updateShadow: function () {
        var me = this;
        
        var obj = this.canvas.getActiveObject();
        var sh = obj.shadowCopy;
        
        sh.colorValue = me.shadowColorCombo.getValue();
        sh.color = teacss.functions.color(sh.colorValue).toString();
        sh.blur =  parseFloat(me.shadowBlurCombo.getValue());
        sh.offsetX = parseFloat(me.shadowXCombo.getValue());
        sh.offsetY = parseFloat(me.shadowYCombo.getValue());
        
        if (sh.color) {
            obj.setShadow(sh);
        } else {
            obj.setShadow(null);
        }
        this.canvas.renderAll();
        obj.setCoords();
    },
    
    remove: function () {
        var obj = this.canvas.getActiveObject();
        if (obj) obj.remove();
    },
    
    unscale: function () {
        var obj = this.canvas.getActiveObject();
        obj.setScaleX(1);
        obj.setScaleY(1);
        obj.setCoords();
        this.canvas.renderAll();
    },
    
    updateSelection: function () {
        var me = this;
        var obj = this.canvas.getActiveObject();
        if (!obj) return;
        
        var def = {
            fill: obj.fill,
            fillValue: obj.fillValue,
            fontSize: obj.getFontSize(),
            fontFamily: obj.getFontFamily()
        };
        
        var start = 0;
        var end = obj.text.length - 1;
        if (obj.isEditing) {
            start = obj.selectionStart;
            end = obj.selectionEnd;
        }
        
        if (start>=end) end = start + 1;
        if (start>=obj.text.length) {
            start = obj.text.length - 1;
            end = obj.text.length;
        }
        
        var list = [];
        for (var i = start; i < end; i++) {
            var loc = obj.get2DCursorLocation(i);
            var styles = {};
            if (obj.styles[loc.lineIndex]) {
                styles = obj.styles[loc.lineIndex][loc.charIndex] || {};
            }
            var it = $.extend({},def,styles);
            it.fillValue = it.fillValue || it.fill;
            list.push(it);
        }
        
        var ret = {};
        $.each(["fill","fontFamily","fontSize","fillValue"],function(i,key){
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
        
        me.fontCombo.setValue(ret.fontFamily || "-");
        me.fillCombo.setValue(ret.fillValue);
        me.fontSizeCombo.setValue(ret.fontSize ? ret.fontSize+"px" : "-");
        
        if (obj.oldStart==start && obj.oldEnd==end) return;
        
        obj.oldStart = start;
        obj.oldEnd = end;
        
        me.stylesCopy = {
            def: def,
            styles: $.extend(true,[],obj.styles)
        }
    },
    
    restoreStyles: function () {
        var obj = this.canvas.getActiveObject();
        obj.styles = $.extend(true,[],this.stylesCopy.styles);
        for (var key in this.stylesCopy.def) obj[key] = this.stylesCopy.def[key];
        obj.setCoords();
        this.canvas.renderAll();
    },
    
    updateToolbar: function () {
        var me = this;
        var obj = this.canvas.getActiveObject();
        
        if (obj) {
            me.withSelectedPanel.element.show();
            if (obj instanceof fabric.IText) {
                me.textOptionsPanel.element.show();
                me.lineHeightCombo.setValue(obj.lineHeight);
                me.updateSelection();
            } else {
                me.textOptionsPanel.element.hide();
            }
            
            me.strokePanel.element.show();
            me.strokeColorCombo.setValue(obj.strokeValue || obj.stroke);
            me.strokeWidthCombo.setValue(obj.strokeWidth+"px");
            
            
            var sh = obj.shadowCopy || obj.getShadow();
            if (!sh) {
                sh = new fabric.Shadow();
                sh.color = false;
                sh.offsetX = 2;
                sh.offsetY = 2;
                sh.blur = 1;
            }
            obj.shadowCopy = sh;
            
            me.shadowPanel.element.show();
            me.shadowXCombo.setValue(sh.offsetX+"px");
            me.shadowYCombo.setValue(sh.offsetY+"px");
            me.shadowBlurCombo.setValue(sh.blur+"px");
            me.shadowColorCombo.setValue(sh.colorValue || sh.color);
            
        } else {
            me.withSelectedPanel.element.hide();
            me.textOptionsPanel.element.hide();
            me.strokePanel.element.hide();
            me.shadowPanel.element.hide();
        }
    },
    
    startEditor: function () {
        if (this.canvas) this.canvas.updateColors();
        this.initEditor();
        
        var el = this.options.cmp.componentHandle;
        var off = el.offset();
        var frame = Component.previewFrame.frame;
        var frameOff = frame.offset();
        var frameScroll = $(frame[0].contentWindow).scrollTop();
        var w = el.outerWidth();
        var h = el.outerHeight();
        
        if (frameScroll > off.top-10) {
            $(frame[0].contentWindow).scrollTop(off.top-10);
            frameScroll = $(frame[0].contentWindow).scrollTop();
        }
        
        var x = frameOff.left + off.left;
        var y = frameOff.top + off.top - frameScroll;
        
        this.overlay.show().empty();
        
        var xx = [0,x,x+w,this.overlay.width()];
        var yy = [0,y,y+h,this.overlay.height()];

        for (var i=0;i<3;i++) {
            var x1 = xx[i];
            var x2 = xx[i+1];
            for (var j=0;j<3;j++) {
                var y1 = yy[j];
                var y2 = yy[j+1];

                if (i==1 && j==1) continue;

                this.overlay.append($("<div>").css({
                    position: 'absolute',
                    left: x1, width: x2-x1,
                    top: y1, height: y2-y1,
                    background: 'black',
                    opacity: 0.3
                }));
            }
        };
        
        this.dialog.element.show().css({
            zIndex: 1000,
            position: 'absolute',
            width: w,
            height: h,
            left: x,
            top: y
        });
        
        this.canvas.setDimensions({width:w,height:h});
        $(this.canvasElement).attr("style","");
        
        this.toolbar.open();
        this.canvas.calcOffset();
        this.options.cmp.element.css("background","transparent");
    },
    
    closeEditor: function () {
        var me = this;
        
        var obj = this.canvas.getActiveObject();
        if (obj && obj.isEditing) {
            obj.exitEditing();
        }
        this.canvas.deactivateAll().renderAll();
                        
        me.trigger("change");
        me.dialog.element.hide();
        me.overlay.hide();
        this.options.cmp.element.css("background","");
    },
    
    getValue: function () {
        if (!this.canvas) return this.value;
        
        var json = this.canvas.toJSON(["fillValue","strokeValue"]);
        json = JSON.stringify(json);
        this.value = {
            json:json,
            width:this.canvas.getWidth(),
            height:this.canvas.getHeight()
        }
        return this.value;
    },
    
    setValue: function (val) {
        var me = this;
        this._super(val);

        if (this.canvas) {
            val = val || {};
            var json = val.json;
            if (json) json = $.parseJSON(json);
            if (json) {
                this.canvas.loadFromJSON(json,function(){
                    me.canvas.renderAll();
                });
            }
        }
    }
});