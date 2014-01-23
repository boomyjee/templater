teacss.cache = function (data) {
    if (teacss.building) return false;
    var me = teacss.cache;
    var json = JSON.stringify(data);
    var selector = tea.Style.current.getSelector();
    
    if (me[selector] &&
        json==me[selector].json &&
        teacss.tea.document==me[selector].document &&
        !teacss.image.deferredUpdate
    ) {
        var id = selector.replace(/[^A-Za-z_0-9-]/g,"_")+"_canvas";
        tea.rule('background-image','-moz-element(#'+id+')');
        return true;
    }
    me[selector] = {json:json,document:teacss.tea.document};
    return false;
}
    
teacss.functions.extend = function(obj1, obj2) {
    for (var p in obj2) {
        try {
            if ( obj2[p] && obj2[p].constructor==Object) {
                if (obj1) obj1[p] = teacss.functions.extend(obj1[p] || {}, obj2[p]);
            } else {
                if (obj1) obj1[p] = obj2[p];
            }
        } catch(e) {
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}    

teacss.functions.widgets = {};
teacss.functions.pages = {};
teacss.functions.global = teacss.functions;
teacss.functions.type_mixin = function (sel) {
    var mixin = function (args) {
        // if run w/out selector and we have default
        if (!this.selector && sel) {
            return tea.rule(sel,function(){ 
                mixin.call(this,args) 
            });
        }
        // search for type function
        var type = args ? args.type : false;
        var f = mixin[type];
        // else call default one
        if (!f) f = mixin.default;
        if (f && f.call) return f.apply(this,arguments);
    };
    return mixin;
}