ui.switcher = ui.control.extend({
    init: function (options) {
        var me = this;
        this._super(options);
        
        this.innerForm = new teacss.ui.form(function(){
            me.tabPanel = teacss.ui.tabPanel({
                name:"type",
                width: me.options.width,
                height: me.options.height,
                margin: me.options.margin
            });
            me.tabPanel.bind("select",function(b,tab){
                if (me.setting) return;
                this.value = tab.type;
                this.trigger("change");
            });
            me.tabPanel.setValue = function (value) {
                var tab = me.panels[value];
                if (tab) {
                    me.setting = true;
                    this.selectTab(tab);
                    me.setting = false;
                }                
            }
            me.options.repository = me.options.repository || this.Class;
            if (!me.options.types) {
                me.options.types = [];
                for (var key in me.options.repository) {
                    if (me.options.repository.hasOwnProperty(key) && key!="shortName") {
                        me.options.types.push(key);
                    }
                }
            }
            me.panels = {};
            for (var i=0;i<me.options.types.length;i++) {
                var type = me.options.types[i];
                var cls = me.options.repository[type];
                if (cls && (typeof(cls)=="string" || cls.extend)) {
                    var panel = cls.call ? new cls({}) : teacss.ui.panel(cls);
                    panel.type = type;
                    me.tabPanel.push(panel);
                    me.panels[type] = panel;
                }
            }
            if (me.options.types.length==1) me.tabPanel.showNavigation(false);
        });
        
        this.innerForm.bind("change",function(){
            me.trigger("change");
        });
        
        me.element = me.tabPanel.element;
    },
    getValue: function () {
        var val = this.innerForm.getValue();
        var type;
        if (val) type = val.type;
        if (!type && this.options.types.length) type = this.options.types[0];
        return teacss.jQuery.extend({type:type},val);
    },
    setValue: function (value) {
        value = teacss.jQuery.isPlainObject(value) ? value : {};
        this.innerForm.setValue(value);
    }
})
    
ui.switcherCombo = ui.combo.extend({
    init: function (options) {
        var label = options.label;
        delete options.label;
        
        if (options && options.inline && options.height) options.comboHeight = options.height;
        this._super($.extend({
            types: false,
            repository: false,
            labelPlain: label,
            labelTpl: label + ": <span class='button-label'>${value?value.type:''}</span>",
            items: function () {
                var switcher = this.switcher = ui.switcher({
                    types:this.options.types,
                    repository: this.options.repository,
                    width: '100%', height: this.options.comboHeight,
                    margin: 0
                });
                var me = this;
                this.switcher.setValue(this.value);
                this.switcher.change(function(){
                    me.trigger("change");
                    this.getValue();
                    ui.combo.prototype.setValue.call(me,this.getValue());
                });
                this.switcher.element.css("box-sizing","border-box");
                return [switcher];
            },
            comboWidth: 400,
            comboHeight: 400
        },options));
        
        this.panel.children().eq(0).css("overflow-y","hidden");
        this.options.repository = this.options.repository || this.Class;
    },
    getValue: function () {
        if (this.switcher) 
            this.value = this.switcher.getValue();
        return this.value;
    },
    setValue: function (val) {
        if (this.switcher)
            this.switcher.setValue(val);
        this._super(val);
    },
    getLabel: function() {
        this.options.repository = this.options.repository || this.Class;
        if (this.value && this.value.type 
            && this.options.repository[this.value.type] 
            && this.options.repository[this.value.type].switcherLabel) 
        {
            return this.options.labelPlain + ": " +
                this.options.repository[this.value.type].switcherLabel(this.value,this);
        }
        return this._super();
    },
    updateLabel: function () {
        this.element.button("option",{label:this.getLabel()});
    }
})