// lib
require("./style/tea/common/color-variate.js");
require("./ui/lib/rgbcolor.js");
require("./ui/lib/canvg.js");
require("./ui/lib/fontdetect.js");
require("./ui/lib/randomize.js");
require("./ui/lib/fabric.js");
require("./ui/lib/fabric.fixes.js");

// controls
require("./ui/controls/presetCombo.js");
require("./ui/controls/imageCombo.js");
require("./ui/controls/lengthCombo.js");
require("./ui/controls/layoutCombo.js");
require("./ui/controls/layoutResizer.js");
require("./ui/controls/paddingControl.js");
require("./ui/controls/typography.js");
require("./ui/controls/backgroundCombo.js");
require("./ui/controls/backgroundMaskCombo.js");
require("./ui/controls/fillCombo.js");
require("./ui/controls/paletteColorPicker.js");
require("./ui/controls/fontCombo.js");
require("./ui/controls/fileManager.js");
require("./ui/controls/fileCombo.js");
require("./ui/controls/buttonCombo.js");
require("./ui/controls/colorThemeCombo.js");
require("./ui/controls/borderControl.js");
require("./ui/controls/smartText.js");
require("./ui/controls/smartImage.js");
require("./ui/controls/shadowCombo.js");
require("./ui/controls/validationCombo.js");

// component editors
require("./components/menu/menu.js");
require("./components/list/list.js");
require("./components/image/image.js");
require("./components/logo/logoCombo.js");
require("./components/logo/logo.js");
require("./components/wysiwyg/wysiwyg.js");
require("./components/wysiwyg/htmlEditor.js");
require("./components/slider/slider.js");
require("./components/form/form.js");
require("./components/form_select/form_select.js");
require("./components/testimonial/testimonial.js");
require("./components/countdown/countdown.js");

// fontAwesome
require("./core.css");

var smartReplaceShaderString = function(){/*
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

uniform sampler2D texture;

uniform vec4 replace1;
uniform vec4 replace2;
uniform vec4 replace3;

varying vec2 texCoord;
void main() {
    vec4 color = texture2D(texture, texCoord);
    vec3 hsv = rgb2hsv(color.xyz);
    
    if (abs(hsv.x-replace1.x)<replace1.z) {
        hsv.x = fract(hsv.x - replace1.x + replace1.y + 1.0);
        hsv.y = clamp(hsv.y + replace1.w, 0.0, 1.0);
        color.xyz = hsv2rgb(hsv);
    }
    else if (abs(hsv.x-replace2.x)<replace2.z) {
        hsv.x = fract(hsv.x - replace2.x + replace2.y + 1.0);
        hsv.y = clamp(hsv.y + replace2.w, 0.0, 1.0);
        color.xyz = hsv2rgb(hsv);
    }
    else if (abs(hsv.x-replace3.x)<replace3.z) {
        hsv.x = fract(hsv.x - replace3.x + replace3.y + 1.0);
        hsv.y = clamp(hsv.y + replace3.w, 0.0, 1.0);
        color.xyz = hsv2rgb(hsv);
    }
    gl_FragColor = color;
}


*/}.toString().slice(14,-3)

teacss.Canvas.effects.smartReplace = function(params) {
    var gl = this.gl;
    gl.smartReplaceShader = gl.smartReplaceShader || new Shader(gl,null,smartReplaceShaderString);
    this.draw3D(gl.smartReplaceShader,{texture:this.getTexture()},params);
    this.setState('texture');
    return this;
}


var item_index = 0;
window.teaSwitcherLabel = function(el,mixin,val) {
    var el = $(el);
    var id = "tea_item_"+(item_index++);
    el.attr("id",id);
    
    teacss.tea.Style.start();
    teacss.tea.Style.rule("#"+id,function(){
        if (mixin) mixin.call(this,val||{});
    });
    var output = "";
    var rules = teacss.tea.Style.rules;
    for (var i=0;i<rules.length;i++) output += rules[i].getOutput();
    el.append("<style>"+output+"</style>");
    return el;
}


Component.app.settings.theme = $.extend(
    true,
    { 
        color1: 'blue',
        color2: 'green',
        color3: 'yellow',
        
        sheet: { 
            width: "940px"
        },
        
        cmp: {},
        presets: {}
    },
    Component.app.settings.theme
);

require("./ui/ui.js");
Component.app.styles.push(
    require.dir + "/style/style.tea"
);