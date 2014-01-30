ui.borderControl = ui.panel.extend({
    sides: ["left","right","bottom","top"]
},{
    init: function (o) {
        this._super($.extend({
            height: 80
        },o));
        if (this.options.width=="100%")
            this.element.css({width:"",display:"block"});
        
        var me = this;
        this.element.css({position:'relative',lineHeight:me.options.height+"px",textAlign:"center",background:"#eee",overflow:'hidden'});
        
        this.indicator = $("<div>")
            .css({position: "absolute", left: 0, right: 0, top: 0, bottom: 0})
            .appendTo(this.element);
        
        var config = me.checkboxConfig = {
            left: {left:0,top:"50%",marginTop:-6},
            right: {right:0,top:"50%",marginTop:-6},
            top: {top:0,left:"50%",marginLeft:-6},
            bottom: {bottom:0,left:"50%",marginLeft:-6}
        }
        
        for (var key in config) {
            var el = $("<input>",{type:"checkbox",name:key}).css({position:'absolute'}).css(config[key]);
            el.appendTo(this.element);
            el.change(function(){
                me.value[$(this).attr("name")] = this.checked;
                me.trigger("change");
            });
            config[key].el = el;
        };
        
        this.fillCombo = ui.fillCombo({
            label:'Color',width:110,margin:"0 5px 0 0",
            change: function () {
                me.value.color = this.getValue();
                me.trigger("change");
            }
        });
        this.widthCombo = ui.lengthCombo({
            width: 110, margin: 0,
            options:[{value:false,label:'No border'},1,2,3,5,10],
            change: function () {
                me.value.width = this.getValue();
                me.trigger("change");
            }
        });
        
        this.push(this.fillCombo);
        this.push(this.widthCombo);
        
        this.fillCombo.element.add(this.widthCombo.element).css({verticalAlign:"middle"});
        
        ui.paletteColorPicker.events.bind("paletteChange",function(){    
            me.updateBorder();
        });
        me.change(me.updateBorder);
        me.value = me.value || {};
    },
    
    setValue: function (val) {
        val = val || {};
        this._super(val);
        
        $.each(this.checkboxConfig,function(key,conf){
            conf.el[0].checked = val[key];
        });
        this.fillCombo.setValue(val.color);
        this.widthCombo.setValue(val.width);
        
        this.updateBorder();
    },
    
    updateBorder: function () {
        var val = this.value || {};
        var cl = ui.fillCombo.prototype.variate(val.color);
        var width = val.width || "0px";
        var border = width+" solid "+(cl || 'transparent');
        var me = this;
        
        $.each(["left","right","top","bottom"],function(i,what){
            me.indicator.css("border-"+what,val[what] ? border : "none");
        });
    }
});