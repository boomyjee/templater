ui.logoFontCombo = ui.combo.extendOptions({  
    itemTpl:[
        "<div class='font-set-item combo-item'>",
        "{{if value}}",
            "<div style='font-family:${value};font-size:14px;'>${value}</div>",
        "{{/if}}",
        "</div>"
    ].join(''),    
    buttonClass: 'icon-button',
    selectedIndex: 0, preview: true,
    items: [
        {value: 'IM Fell DW Pica'},
        {value: 'Droid Sans'},
        {value: 'Lato'},
        {value: 'Gravitas One'},
        {value: 'Ubuntu'},
        {value: 'Josefin Slab'},
        {value: 'Cantarell'},
        {value: 'Abril Fatface'},
        {value: 'Hammersmith One'},
        {value: 'Cardo'},
        {value: 'Crimson Text'},
        {value: 'Vollkorn'},
        {value: 'Open Sans'},
        {value: 'Playfair Display SC'},
        {value: 'Jura'},
        {value: 'UnifrakturMaguntia'},
        
        {value: 'Verdana'},
        {value: 'Lucida Grande'},
        {value: 'Arial'},
        {value: 'Georgia'},
        {value: 'Times New Roman'},
        {value: 'Trebuchet MS'},
        {value: 'Palatino Linotype'},
        {value: 'Comic Sans MS'},
        {value: 'Century Gothic'}
    ]
});

ui.text = ui.text || ui.Control.extend({
    init: function (options) {
        this._super(options);
        
        this.element = $("<input>");
        this.element.css({
            verticalAlign:"middle",
            margin: this.options.margin,
            width: this.options.width || 'auto'
        });
        
        var me = this;
        this.element.change(function(){
            me.trigger("change");
        });
        
        this.element.keyup(function(){
            var val = me.getValue();
            if (val!=me.value) {
                me.value = val;
                me.trigger("change");
            }
        });
    },
    setValue: function (val) {
        this._super(val);
        this.element.val(val);
    },
    getValue: function (val) {
        return this.element.val();
    }
});

var assets = require.dir + "/../assets";

ui.logoDialog = ui.dialog.extend({
    init: function (options) {
        var me = this;
        this._super($.extend({
            title: "Create logo",
            width:850,height:600,
            modal: true,
            resizable: false,
            draggable: false,
            buttons: {
                "Save into collection": function () {
                    me.tabs.element.tabs("select",1);
                    if (me.options.callback) me.options.callback();
                    $(this).dialog("close");
                },
                "Save as PNG": function () {
                    var div = me.designPanel.element;
                    me.tabs.element.tabs("select",1);
                    
                    var clone = me.canvas.clone();
                    clone.attr({width:div.width(),height:div.height()});
                    
                    var svg = (new XMLSerializer).serializeToString(clone[0]);
                    var bbox = me.canvas[0].getBBox();
                    
                    var cropped = document.createElement("canvas");
                    cropped.width = bbox.width;
                    cropped.height = bbox.height;
                    cropped.getContext('2d').drawSvg(svg,-bbox.x,-bbox.y);
                    
                    var img = cropped.toDataURL();
                    window.open(img);
                },
                "Cancel": function () {
                    $(this).dialog("close");
                }
            }            
        },options));
        
        var tabs = me.tabs = ui.tabPanel({width:"100%",height:"100%",margin:0});
        tabs.element.css({"-webkit-box-sizing":"border-box"});
        this.push(tabs);
        
        var choosePanel = ui.panel("Choose");
        choosePanel.element.css({overflow:'auto'});
        
        var layoutPanel = ui.panel("Layout");
        
        tabs.push(choosePanel);
        tabs.push(layoutPanel);
        
        $.ajax({
            dataType: "json",
            url: assets + "/logoMaker/symbols.json", 
            success: function(json) {
                for (var key in json) {
                    var list = json[key];
                    var thumb = $("<div>").addClass("thumb");
                    thumb.appendTo(choosePanel.element);
                    
                    for (var i=0;i<list.length;i++) {
                        var svg = $(list[i]);
                        thumb.append(svg);
                        svg.find("rect").remove();
                    }
                    
                    thumb.click(function(){
                        var el = me.el("symbol")[0];
                        while (el.firstChild) el.removeChild(el.firstChild);
            
                        for (var key in me.colors)
                            if (key!="slogan" && key!="heading") delete me.colors[key];
            
                        var clone = $(this).clone();
                        clone.find("> svg").each(function(N){
                            var g = document.createElementNS(svgns,'g');
                            g.setAttribute("class","symbol_"+N);
                            el.appendChild(g);
                            $(this).children().each(function(){
                                g.appendChild(this);
                            });
                        });
                        tabs.selectTab(layoutPanel);
                        me.initSymbolColors();
                    });                
                }
            }
        });        
        
        var svgns = "http://www.w3.org/2000/svg";
        var configPanel = ui.panel({margin:0});
        configPanel.element.css({background:"#eee",position:'absolute',left:0,top:1,bottom:0,width:200});
        
        this.designPanel = ui.panel({margin:0});
        this.designPanel.element.css({position:'absolute',left:200,top:1,bottom:0,right:0});
        layoutPanel.push(configPanel,this.designPanel);
        
        me.controls = {};
        
        function textControls(name) {
            var tx,cl,sz,fn;
            me.controls[name] = [
                tx = ui.text({margin:"0px 5px"}),
                cl = ui.fillCombo({width:20,label:" ",height:18}),
                sz = ui.slider({margin:"5px 15px 0px",min:8,max:60}),
                fn = ui.logoFontCombo({margin:"5px 0 5px 5px",width:182})
            ];
            
            tx.change(function(){ 
                me.el(name)[0].textContent = this.getValue(); 
            });
            cl.change(function(){
                var col = this.getValue();
                me.el(name).attr("fill",teacss.functions.color(col));
                me.colors[name] = col;
            });
            sz.change(function(){ 
                me.el(name).attr("font-size",this.getValue());
            });
            fn.change(function(){
                me.el(name).attr("font-family",this.getValue());
            });
            
            return [tx,cl,"<br>",fn,"<br>",sz,"<br>"];
        }
        
        configPanel.push(
            ui.label("Heading text:"),"<br>",
            
            textControls("heading"),
            
            ui.label("Slogan text:"),"<br>",
            
            textControls("slogan"),
            
            ui.label("Symbol size:"),"<br>",
            me.symbolSize = ui.slider({margin:"5px 15px 0px",min:20,max:500}),"<br>",
            ui.label("Symbol colors:"),
            this.colorsPanel = ui.panel({width:200,margin:"0 0 0 5px"})
        );
        
        me.symbolSize.change(function(){
            var s = this.getValue()/100;
            me.el("symbol")[0].transform.baseVal.getItem(1).setScale(s,s);
        });
    },
    
    el: function (name) {
        return this.canvas.find("."+name);
    },
    
    initSymbolColors: function () {
        var me = this;
        me.colorsPanel.element.html("");
        
        me.el("symbol").find("> g").each(function(N){
            var group = this;
            var cp = ui.fillCombo({label:" ",width:20});
            cp.setValue(me.colors['symbol_'+N] || $(group).find("path").last().attr("fill"));
            me.colorsPanel.push(cp);
            cp.change(function(){
                var col = this.getValue();
                me.colors['symbol_'+N] = col;
                $(group).find("path").attr("fill",teacss.functions.color(col));
            });
        });        
    },
    
    setTextValue: function (name) {
        var el = this.canvas.find("."+name);
        this.controls[name][0].setValue(el[0].textContent);
        this.controls[name][1].setValue(this.colors[name]);
        this.controls[name][2].setValue(el.attr("font-size"));
        this.controls[name][3].setValue(el.attr("font-family"));
    },
    
    setValue: function (val) {
        if (!val) {
            val = {
                colors: {
                    heading: "#000",
                    slogan: "#000"
                },
                svg: [
                    "<svg>",
                        "<g class='symbol' transform='translate(260,120) scale(1)'></g>",
                        "<text class='heading' transform='translate(200,250)' font-size='30' font-family='Verdana'>Company name</text>",
                        "<text class='slogan' transform='translate(235,280)' font-size='20' font-family='Verdana'>company slogan</text>",
                    "</svg>"
                ].join('')
            }
        }
        
        this.colors = val.colors;
        this.canvas = $(val.svg).attr({width:"100%",height:"100%"});
        this.designPanel.element.html("").append(this.canvas);
        
        this.setTextValue("heading");
        this.setTextValue("slogan");
        this.symbolSize.setValue(this.el("symbol")[0].transform.baseVal.getItem(1).matrix.a*100);
        
        this.initSymbolColors();
        
        for (var key in this.colors)
            this.canvas.find("."+key).find("path").andSelf().attr("fill",teacss.functions.color(this.colors[key]));
        
        this.el("symbol,.heading,.slogan")
        .mousedown(function(){
            var m = this.transform.baseVal.getItem(0).matrix;
            $(this).css({left:m.e,top:m.f});
        })
        .draggable({
            cursor: "move",
            drag: function (e,ui) {
                this.transform.baseVal.getItem(0).setTranslate(ui.position.left,ui.position.top);
            }
        })
    },
    
    getValue: function () {
        var bbox = this.canvas[0].getBBox();
        return {
            colors: this.colors,
            svg: (new XMLSerializer).serializeToString(this.canvas.removeAttr("width").removeAttr("height")[0]),
            bbox: {
                x: Math.floor(bbox.x),
                y: Math.floor(bbox.y),
                width: Math.ceil(bbox.width),
                height: Math.ceil(bbox.height)
            }
        }
    }
});

ui.logoCombo = ui.combo.extend({
    init: function (options) {
        var me = this;
        this._super($.extend({
            label:"Logo",
            margin:0,
            comboWidth: 460,
            comboHeight: 500
        },options));
        
        this.button = ui.html({
            html:"<a href='#' style='display:block;text-align:right;padding:5px'>New logo</a>",
        });
        this.button.element.click(function (e) {
            e.preventDefault();
            me.itemDialog(function () {
                var item = me.dialog.getValue();
                me.value.items.push(item);
                me.itemPanel.append(me.itemElement(item));
                me.trigger("change");
            });
            me.dialog.setValue(false);
            me.dialog.open();
            me.dialog.tabs.element.tabs("select",0);
            for(var c=0;c<ui.combo.list.length;c++) ui.combo.list[c].hide();
        });
        this.setValue({items:[],selected:-1});
    },
    setValue: function (val) {
        if (!val) return;
        this.value = val;
        
        this.itemPanel.children().detach();
        this.itemPanel.append(this.button.element);
        for (var i=0;i<this.value.items.length;i++) {
            var item = this.value.items[i];
            this.itemPanel.append(this.itemElement(item));
        }
        this.setSelected();
    },
    setSelected: function () {
        var sel = this.value.selected;
        if (sel>=0)
            this.itemPanel.find(".combo-item").removeClass("selected").eq(sel).addClass("selected");
    },
    getValue: function () {
        return this.value;
    },
    itemDialog: function (callback) {
        var me = this;
        if (!me.dialog) me.dialog = ui.logoDialog();
        me.dialog.options.callback = callback;
    },
    itemElement: function (item) {
        var me = this;
        var bbox = item.bbox;
        var svg = $(item.svg);
        var x,y,w,h;
        if (bbox.width > bbox.height) {
            x = bbox.x; h = w = bbox.width;
            y = bbox.y + bbox.height * 0.5 - bbox.width * 0.5;
        } else {
            y = bbox.y; h = w = bbox.height;
            x = bbox.x + bbox.width * 0.5 - bbox.height * 0.5;
        }
        svg[0].setAttribute("viewBox",x+" "+y+" "+w+" "+h);
        var element = $("<div class='combo-item'>")
            .css({ width:100, height:120, display:'inline-block' })
            .append(
                svg
                ,
                $("<div style='text-align:center'>").append(
                    $("<span>").addClass("ui-icon ui-icon-folder-open").css("display","inline-block").click(function(e){
                        me.itemDialog(function () {
                            var val = me.dialog.getValue();
                            item.svg = val.svg;
                            item.bbox = val.bbox;
                            item.colors = val.colors;
                            element.html("").append(me.itemElement(item).children());
                            me.trigger("change");
                        });
                        me.dialog.setValue(item);
                        me.dialog.open();
                        me.dialog.tabs.element.tabs("select",1);
                        for(var c=0;c<ui.combo.list.length;c++) ui.combo.list[c].hide();
                        return false;
                    })
                    ,
                    $("<span>").addClass("ui-icon ui-icon-trash").css("display","inline-block").click(function(e){
                        var sel_item = me.value.items[me.value.selected];
                        
                        $(this).parents(".combo-item").eq(0).remove();
                        me.value.items.splice( me.value.items.indexOf(item), 1 );
                        me.value.selected = me.value.items.indexOf(sel_item);
                        me.setSelected();
                        
                        me.trigger("change");
                        return false;
                    })
                )
            ).click(function(){
                me.value.selected = me.value.items.indexOf(item);
                me.setSelected();
                me.trigger("change");
            })
        for (var key in item.colors)
            element.find("."+key).andSelf().attr("fill",teacss.functions.color(item.colors[key]));
        
        element.data("item",item);
        return element;
    }
});