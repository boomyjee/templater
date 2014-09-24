ui.shadowCombo = ui.combo.extendOptions({
    label: 'Shadow',
    icons: {primary: 'fa fa-cloud'},
    comboHeight: 1000,
    comboWidth: 220,
    preview: false,
    closeOnSelect: false,
    panelClass: 'only-icons',
    itemTpl:[
        "{{if group}}",
          "<div class='combo-group'>${group}</div>",
        "{{else}}",
          "<div class='combo-item'>",
            "<div style='width:59px;height:47px;background:#fff;",
                "border: 1px solid #aaa;",
                "box-shadow:${value.x}px ${value.y}px ${value.blur}px ${value.color};'>",
            "</div>",
          "</div>",
        "{{/if}}"
    ],
    items: function () { 
        var me = this;
        var items = [
            {group:'Manual',disabled:true},
            me.manual = ui.composite({
                width: "100.0%", margin: 0, layout: {},
                items: [
                    {type:'slider',min:-10,max:10,nested:true,margin:"10px 10px",name:"x",width:"auto"},
                    {type:'slider',min:-10,max:10,nested:true,margin:"10px 10px",name:"y",width:"auto"},
                    {type:'slider',min:0,max:20,nested:true,margin:"10px 10px",name:"blur",width:"auto"},
                    {type:'fillCombo',name:"color",width:'100%',margin:5}
                ]
            }),
            {group:'No shadow',disabled:true},
            {value:false},
            {group:'Glow',disabled:true},
            {value:{x:0,y:0,blur:1,color:'#ff0'}},
            {value:{x:0,y:0,blur:2,color:'#ff0'}},
            {value:{x:0,y:0,blur:4,color:'#ff0'}},
            {value:{x:0,y:0,blur:6,color:'#ff0'}},
            {value:{x:0,y:0,blur:8,color:'#ff0'}},
            {value:{x:0,y:0,blur:10,color:'#ff0'}},
            {group:'Shadow',disabled:true},
            {value:{x:1,y:1,blur:2,color:'rgba(0,0,0,0.5)'}},
            {value:{x:2,y:2,blur:2,color:'rgba(0,0,0,0.5)'}},
            {value:{x:3,y:3,blur:2,color:'rgba(0,0,0,0.5)'}},
            {value:{x:4,y:4,blur:2,color:'rgba(0,0,0,0.5)'}},
            {value:{x:5,y:5,blur:2,color:'rgba(0,0,0,0.5)'}},
            {value:{x:6,y:6,blur:2,color:'rgba(0,0,0,0.5)'}}
        ];
        
        me.manual.change(function(){
            me.changing = true;
            me.setValue(this.getValue());
            me.trigger("change");
            me.changing = false;
        });
        
        function changed() {
            if (!me.changing) me.manual.setValue(this.getValue());
        }
        
        me.bind("change",changed);
        me.bind("setValue",changed);
        changed.call(this);
        return items;
    }
});
