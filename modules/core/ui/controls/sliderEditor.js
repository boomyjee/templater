ui.composite = ui.panel.extend({
},{
    init: function (o) {
        this._super($.extend({
            width: 'auto'
        },o));
        
        this.element.css({width:'auto',display:'block'});
        
        var me = this;
        this.innerForm = new teacss.ui.form(function(){
            $.each(me.options.items,function(){
                var cls = ui[this.type];
                if (cls) {
                    var ctl = new cls($.extend({width:"100%",margin:"0 0 10px 0"},this));
                    if (this.label) {
                        me.push(
                            ui.label({value:this.label,width:"100%"})
                        );
                    }
                    me.push(ctl);
                }
            });
        });
        this.innerForm.bind("change",function(){
            me.trigger("change");
        });
    },
    
    getValue: function () {
        return this.innerForm.getValue();
    },
    
    setValue: function (value) {
        value = teacss.jQuery.isPlainObject(value) ? value : {};
        this.innerForm.setValue(value);
    }
});

ui.repeater = ui.panel.extend({
    init: function (o) {
        var me = this;
        this._super($.extend({
            width: '100%'
        },o));
        
        this.addButton = ui.button({
            label: 'Add Element',
            margin: "0 0 5px 0",
            width: 100,
            click: function () {
                me.addElement();
            }
        });
        
        this.pagination = $("<div>").addClass("pagination");
        this.container = $("<div>");
        
        this.element.append(this.addButton.element, this.pagination, this.container);
    },
    
    push: function (el) {
        if (!(el instanceof teacss.ui.Control)) return;
        
        var me = this;
        this.container.append(el.element);
        var count = this.container.children().length;
        el.page = $("<a href='#'>").text(count);
        el.select = el.page.select = function (e) {
            if (e) e.preventDefault();
            me.pagination.find(".selected").removeClass("selected");
            el.page.addClass("selected");
            
            me.container.children().hide();
            el.element.show();
        }
        el.page.click(el.page.select);
        el.page.data("element",el);
        
        this.pagination.append(el.page);
        el.page.select();
    },
    
    addElement: function (val) {
        val = val || {};
        var el = ui.composite({items:this.options.items});
        el.setValue(val);
        var me = this;
        el.bind("change",function(){
            me.trigger("change");
        });
        this.push(el);
        if (Component.currentDialog && Component.currentDialog.reposition)
            Component.currentDialog.reposition();
    },
    
    getValue: function () {
        var val = [];
        this.pagination.children().each(function(){
            var el = $(this).data("element");
            val.push(el.getValue());
        });
        return val;
    },
    
    setValue: function (val) {
        this.pagination.empty();
        this.container.empty();
        val = val || [];
        var me = this;
        $.each(val,function(){
            me.addElement(this);
        });
    }
})

ui.htmlEditor = ui.composite.extendOptions({
    height: 400,
    items: [{type:'wysiwyg',name:'html',width:"100%",height:"100%"}]
});

ui.slideEditor = ui.switcherCombo.extendOptions({
    inline: true, width: "100%", height: 300,
    types: ["image","html"]
});

ui.slideEditor.image = ui.panel.extend({
    init: function (o) {
        this._super($.extend({label:"Image"},o));
        this.push(
            ui.imageCombo({
                width:"100%",height:"100%",inline:true,margin:0,name:"image",presetName:"presets.sliderImage",
                uploadDir: "slides"
            })
        );
    }
})
    
ui.slideEditor.html = ui.panel.extend({
    init: function (o) {
        this._super($.extend({label:"HTML"},o));
        this.push(
            ui.wysiwyg({width:"100%",height:"100%",margin:0,name:"html"})
        );
    }
})

ui.sliderEditor = ui.composite.extendOptions({
    items: [{ 
        type: 'text', name: 'title', label: 'Title'
    },{ 
        type: 'repeater', name: 'slides',
        items: [
            {type: 'slideEditor', name: 'slide'}
        ]
    }]
})