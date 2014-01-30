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
                    me.setValue(me.getValue(),this);
                    me.trigger("change");
                });
                ctl.input.blur(function(){
                    me.setValue(me.getValue());
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
    setValue: function (value,ctl) {
        value = value || "0px";
        this._super(value);
        var v = value.split(" ");
        for (var i=0;i<v.length;i++) {
            v[i] = parseFloat(v[i]) || 0;
            if (v[i]<0) v[i] = 0;
        }

        var equal = true;
        if (v.length<4) {
            if (v.length==2) {
                v = [v[0],v[1],v[0],v[1]];
            } else {
                v = [v[0],v[0],v[0],v[0]];
            }
        }
        for (var i=1;i<4;i++) if (v[i]!=v[0]) equal = false;
            
        function setv(c,v) {
            if (c!=ctl) c.setValue(v);
        }
        
        setv(this.inputs.all,equal ? v[0] : "");
        setv(this.inputs.top,v[0]);
        setv(this.inputs.right,v[1]);
        setv(this.inputs.bottom,v[2]);
        setv(this.inputs.left,v[3]);
    }    
});