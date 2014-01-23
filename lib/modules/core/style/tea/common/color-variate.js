if (teacss.functions.variate) return;

var variations_cache = {};

teacss.functions.variate = function(color,n,brightness,saturation) {
    var variations = color_variations(color,brightness,saturation);
    return variations[n];
}
    
teacss.functions.color1 = 'red';
teacss.functions.color2 = 'green';
teacss.functions.color3 = 'blue';
teacss.functions.color4 = false;
teacss.functions.color5 = false;
teacss.functions.color6 = false;
teacss.functions.color7 = false;
teacss.functions.color8 = false;
teacss.functions.color9 = false;
    
teacss.functions.color = function(color,c2) {
    if (color && color.constructor==Array) {
        if (color.length<2) color = [1,1];
        color = teacss.functions.variate(teacss.functions["color"+color[0]],color[1]-1);
    }
    if (color && c2)
        color = teacss.functions.variate(teacss.functions["color"+color],c2-1);
    return color;
}
    
function color_variations(color,brightness,saturation) {
    if (!color) color = 'white';
    var hash = color.toString()+"_"+brightness+"_"+saturation;
    if (variations_cache[hash]) return variations_cache[hash];
    
    var base_hsl = color.toHSL();
    var h = base_hsl.h;
    var s = base_hsl.s;
    var l = base_hsl.l;
    
    var res = [];
    for (var i=0;i<14;i++) {
        var delta = Math.abs(i * (i-13))/ 42.0 * (l-50)/50.0*20.0;
        var part = teacss.Color.functions.hsl(h,s,(i+1)*100.0/15.0+delta);
        res[i] = part;
    }
    variations_cache[hash] = res;
    return res;
}