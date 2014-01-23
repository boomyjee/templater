ui.lengthCombo = ui.combo.extend({
    init: function (options) {
        options = $.extend({},options);
        var label = options.label;
        delete options.label;
        var me = this;
        this._super($.extend({
            preview: true, 
            min: 0, max: 100, units: 'px',
            options: [0,30,50,70,100],
            icons: { secondary: 'ui-icon-triangle-1-s' },
            labelTpl: function () {
                var val = me.value || false;
                var txt = val;
                $.each(me.options.options,function(){
                    if (this.value==val && this.label)
                        txt = this.label;
                });
                return label + ": <span class='button-label' style='margin-right:4px'>"+txt+"</span>";
            },
            items: function() {
                var items = [];
            
                items.push({group:'Manual',disabled:true});
            
                var text = ui.text({width:'100%',margin:"10px 10px"})
                items.push(text);
            
                var slider = ui.slider({min:this.options.min,max:this.options.max,margin:"5px 10px",step:this.options.step})
                items.push(slider);
                
                items.push({group:'Predefined',disabled:true});
                for (var i=0;i<this.options.options.length;i++) {
                    var val = this.options.options[i];
                    if (!isNaN(val)) {
                        val += this.options.units;
                        items.push({value:val,label:val});
                    } else {
                        items.push(val);
                    }
                }
        
                var me = this;
                slider.change(function(){ me.setValue(this.value+me.options.units); me.trigger("change"); });
                function updateSlider() { slider.setValue(parseFloat(this.value)||me.options.min); }
                this.bind("change",updateSlider);
                this.bind("setValue",updateSlider);
                updateSlider.call(this);
        
                text.change(function() { 
                    var val = parseFloat(this.getValue()) || 0;
                    me.setValue(val+me.options.units);
                    me.trigger("change"); 
                });
                function updateText() { 
                    var val = parseFloat(this.value);
                    if (!text.input.is(":focus") || text.getValue() || val)
                        text.setValue(isNaN(val) ? '':val);
                }
                this.bind("change",updateText);
                this.bind("setValue",updateText);
                updateText.call(this);
        
                this.bind("open",function(){
                    setTimeout(function(){
                        text.input.focus().select();
                    },1);
                });
                return items;
            }            
        },options));
    },
    setValue: function (val) {
        return this._super(val || false);
    }
});

ui.marginCombo = ui.lengthCombo.extendOptions({
    label: "Margin", min:-50,max:50,options:[{value:false,label:'No outline'},-10,0,10,20,30] 
})

ui.overflowCombo = ui.lengthCombo.extendOptions({
    label: "Oveflow", min:0,max:100,options:[{value:false,label:'No overflow'},10,20,30,40,50] 
})
    
ui.paddingCombo = ui.lengthCombo.extendOptions({
    label: "Padding", min:0,max:50,options:[0,5,10,20,30,40,50] 
})

ui.layoutWidthCombo = function (options) {
    var label = options.label || 'Width'; delete options.label;
    return ui.combo($.extend({
        labelTpl: label + ": <span class='button-label'>${value}</span>",
        comboDirection: 'bottom',
        preview: true,
        items: [
            {value:'page',label:'Page width'},
            {value:'sheet',label:'Sheet width'}
        ]
    },options));
}