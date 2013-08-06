ui.repeaterCombo = ui.combo.extend({
    init: function (options) {
        var me = this;

        this.table = ui.html({html:"<table>"});
        this.table.element.css({width:"100%"});
        
        this.controls = [];
        this._super($.extend({
            label: "Effects",
            items: [this.table],
            comboDirection: "right"
        },options));        
        
        me.options.repository = me.options.repository || this.Class;
        if (!me.options.types) {
            me.options.types = [];
            for (var key in me.options.repository) me.options.types.push(key);
        }
            
        var type_options = {};
        for (var i=0;i<this.options.types.length;i++) {
            var type = this.options.types[i];
            var cls = type;
            if (cls && cls.extend) {
                type_options[type] = type;
            }
        }
        
        this.select = ui.select({
            items: type_options,
            width: "100.0%",
            margin: "2px 0 2px 2px"
        });
        this.button = ui.button({
            label: "+",
            width: 50,
            margin: "2px 2px 2px 4px",
            click: function () {
                me.addEffect(me.select.getValue());
                me.trigger("change");
            }
        });        
        
        this.sizingCss = {"-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box"};
        this.select.element.add(this.button.element).css(this.sizingCss);
        this.button.element.find(".ui-button-text").css("padding","2px");
        this.table.element.append(
            $("<tr>").append( 
                $("<td width='100%'>").append(this.select.element), 
                $("<td>").append(this.button.element)
            )
        );        
    },
    
    setValue: function (val) {
        this._super(val);
        this.table.element.find("tr:not(:first)").remove();
        this.controls = [];
        if (val) for (var i=0;i<val.length;i++) {
            var one = val[i];
            var cls = this.options.repository[one.type];
            if (cls) {
                var ctl = this.addEffect(one.type);
                ctl.setValue(one.value);
            }
        }
    },
    
    getValue: function () {
        var value = [];
        for (var i=0;i<this.controls.length;i++) {
            value.push({
                type: this.controls[i].type,
                value: this.controls[i].control.getValue()
            });
        }
        return value;
    },
    
    addEffect: function (type) {
        var cls = this.options.repository[type];
        if (!cls) return;
        var ctl = cls({width:"100.0%",margin:"2px 0 2px 2px"});
        var me = this;
        ctl.element.css(this.sizingCss);
        ctl.bind("change",function(){
            me.trigger("change");
        });
        this.controls.push({type:type,control:ctl});
        
        var btn = ui.button({
            label: "-",
            width: 50,
            margin: "2px 2px 2px 4px",
            click: function () {
                $(this.element).parents("tr").eq(0).remove();
                for (var i=0;i<me.controls.length;i++) {
                    if (me.controls[i].control==ctl) {
                        me.controls.splice(i,1);
                        break;
                    }
                }
                me.trigger("change");
            }
        });
        
        this.table.element.append(
            $("<tr>").append( 
                $("<td>").append(ctl.element),
                $("<td>").append(btn.element)
            )
        );
        return ctl;
    }
    
});