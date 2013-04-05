ui.lengthCombo = ui.combo.extend({
    init: function (options) {
        options = $.extend({},options);
        var label = options.label;
        delete options.label;
        this._super($.extend({
            preview: true, 
            min: 0, max: 100, units: 'px',
            options: [0,30,50,70,100],
            labelTpl: label + ": <span class='button-label'>${value}</span>",
            items: function() {
                var items = [];
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
                
                var slider = ui.slider({min:this.options.min,max:this.options.max,margin:"5px 10px",step:this.options.step})
                items.push({group:'Manual',disabled:true});
                items.push(slider);
                
                var me = this;
                slider.change(function(){ me.setValue(this.value+me.options.units); me.trigger("change"); });
                
                function updateSlider() { slider.setValue(parseFloat(this.value)||me.options.min); }
                this.bind("change",updateSlider);
                this.bind("setValue",updateSlider);
                updateSlider.call(this);
                return items;
            }            
        },options));
    },
    multiLabel: function (parent) {
        return "<span class='button-label' style='margin-right:4px'>"+this.value+"</span>";
    }      
})
    
ui.marginCombo = ui.lengthCombo.extendOptions({
    label: "Margin", min:-50,max:50,options:[{value:false,label:'No outline'},-10,0,10,20,30] 
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