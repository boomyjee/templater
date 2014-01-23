ui.paddingControl = ui.panel.extend({
    init: function (o) {
        this._super(o);
        if (this.options.width=="100%")
            this.element.css({width:"",display:"block"});
        this.element.css({position:'relative',height:60})
        
        this.element.append(
            $("<div>").css({border:'1px solid #ccc',background:"#eee",position:"absolute",top:10,bottom:10,left:25,right:25})
        );

        this.inputs = {
            left:   ui.text({width:50,left:0,top:"50%",margin:"-11px 0 0 0"}),
            right:  ui.text({width:50,right:0,top:"50%",margin:"-11px 0 0 0"}),
            top:    ui.text({width:50,top:0,left:"50%",margin:"0 0 0 -25px"}),
            bottom: ui.text({width:50,bottom:0,left:"50%",margin:"0 0 0 -25px"}),
            all:    ui.text({width:50,top:"50%",left:"50%",margin:"-9px 0 0 -25px"})
        };
        
        var me = this;
        for (var key in this.inputs) {
            var ctl = this.inputs[key];
            ctl.element.css(ctl.options);
            ctl.element.css({position:'absolute', fontSize:10});
            this.element.append(ctl.element);
            
            if (key=="all") {
                ctl.change(function(){
                    var val = (parseInt(this.getValue()) || 0).toString() + "px";
                    me.setValue(val);
                    me.trigger("change");
                });
            } else {
                ctl.change(function(){
                    me.setValue(me.getValue());
                    me.trigger("change");
                });
            }
        };
    },
    
    getValue: function () {
        var me = this;
        var list = [];
        $.each(["top","right","bottom","left"],function(){
            list.push((parseInt(me.inputs[this].getValue()) || 0).toString()+"px");
        });
        return list.join(" ");
    },
    setValue: function (value) {
        value = value || "0px";
        this._super(value);
        var v = value.split(" ");
        for (var i=0;i<v.length;i++)
            v[i] = parseFloat(v[i]) || 0;

        var equal = true;
        if (v.length<4) {
            if (v.length==2) {
                v = [v[0],v[1],v[0],v[1]];
            } else {
                v = [v[0],v[0],v[0],v[0]];
            }
        }
        for (var i=1;i<4;i++) if (v[i]!=v[0]) equal = false;
        
        this.inputs.all.setValue(equal ? v[0] : "");
        this.inputs.top.setValue(v[0]);
        this.inputs.right.setValue(v[1]);
        this.inputs.bottom.setValue(v[2]);
        this.inputs.left.setValue(v[3]);
    }    
});

ui.paddingControl2 = ui.combo.extend({
    init: function (options) {
        options = options || {};
        var min = options.min || 0;
        var max = options.max || 10;
        var label = options.label || 'Padding';
        delete options.label;
        
        this._super($.extend({
            comboWidth: 300,
            comboHeight: 300,
            labelTpl: label + ": <span class='button-label'>${value}</span>",
            min: min, max : max,
            value: "0px",
            items: [
                this.equalCheck = ui.check({label:"Equal values",width:'100%',margin:0}),
                this.topSlider = ui.slider({orientation:'vertical',height:100,margin:'10px auto 7px',min:min,max:max,value:min}),
                this.leftSlider = ui.slider({width:114,margin:'0 17px',min:-max,max:-min,value:-min}),
                this.rightSlider = ui.slider({width:114,margin:'0 0 0 17px',min:min,max:max,value:min}),
                this.bottomSlider = ui.slider({orientation:'vertical',height:100,margin:'12px auto 10px',min:-max,max:-min,value:-min})
            ]
        },options));
        
        var me = this;
        this.equalCheck.change(function(){
            if (this.value) 
                me.setValue(me.topSlider.getValue()+"px");
            me.trigger("change");
        });
        this.sliders = [this.topSlider,this.rightSlider,this.bottomSlider,this.leftSlider];
        for (var i=0;i<this.sliders.length;i++) {
            this.sliders[i].change(function(){
                if (me.equalCheck.getValue()) {
                    me.setValue(this.getValue()+"px");
                } else {
                    me.setValue(me.getValue());
                }
                me.trigger("change");
            })
        }
    },
    getValue: function () {
        var list = [];
        for (var i=0;i<this.sliders.length;i++) {
            list.push(this.sliders[i].getValue() * ( i>1 ? -1:1 ) +"px");
        }
        return list.join(" ");
    },
    setValue: function (value) {
        value = value || "0px";
        this._super(value);
        var v = value.split(" ");
        for (var i=0;i<v.length;i++)
            v[i] = parseFloat(v[i]) || 0;

        var equal = false;
        if (v.length<4) {
            equal = true;
            if (v.length==2) 
                v = [v[0],v[1],v[0],v[1]];
            else 
                v = [v[0],v[0],v[0],v[0]];
        }
        for (var i=1;i<4;i++) if (v[i]!=v[0]) equal = false;
        
        this.equalCheck.setValue(equal);
        this.topSlider.setValue(v[0]);
        this.rightSlider.setValue(v[1]);
        this.bottomSlider.setValue(-v[2]);
        this.leftSlider.setValue(-v[3]);
    }
})