// lib
require("./lib/rgbcolor.js");
require("./lib/canvg.js");
require("./lib/fontdetect.js");

// controls
require("./color-variate.js");
require("./controls/switcher.js");
require("./controls/presetCombo.js");

require("./controls/backgroundCombo.js");
require("./controls/paletteColorPicker.js");
require("./controls/fillCombo.js");
require("./controls/lengthCombo.js");
require("./controls/fontsCombo.js");
require("./controls/fontCombo.js");
require("./controls/headerStyle.js");
require("./controls/multiCombo.js");
require("./controls/select.js");
require("./controls/textureCombo.js");
require("./controls/paddingControl.js");
require("./controls/repeater.js");
require("./controls/text.js");
require("./controls/typography.js");
require("./controls/imageCombo.js");
require("./controls/logoCombo.js");
require("./controls/logo.js");
require("./controls/menu.js");


var old_push = ui.panel.prototype.push;
ui.panel.prototype.push = function (what) {
    if (this.options.layout && what instanceof ui.Control) {
        what.element.css(this.options.layout);
    }
    return old_push.apply(this,arguments);
}
    
$.each_deep = function (parent,f) {
    $.each(parent.children,function(i){
        f.call(this,i,parent);
        if (this && this.children) $.each_deep(this,f);
    });
}
