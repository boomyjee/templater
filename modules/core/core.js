// lib
require("./ui/lib/rgbcolor.js");
require("./ui/lib/canvg.js");
require("./ui/lib/fontdetect.js");
require("./ui/lib/color-variate.js");

// ui
require("./ui/controls/switcher.js");
require("./ui/controls/presetCombo.js");
require("./ui/controls/backgroundCombo.js");
require("./ui/controls/paletteColorPicker.js");
require("./ui/controls/fillCombo.js");
require("./ui/controls/lengthCombo.js");
require("./ui/controls/fontsCombo.js");
require("./ui/controls/fontCombo.js");
require("./ui/controls/headerStyle.js");
require("./ui/controls/multiCombo.js");
require("./ui/controls/select.js");
require("./ui/controls/textureCombo.js");
require("./ui/controls/paddingControl.js");
require("./ui/controls/repeater.js");
require("./ui/controls/text.js");
require("./ui/controls/typography.js");
require("./ui/controls/imageCombo.js");
require("./ui/controls/logoCombo.js");
require("./ui/controls/logo.js");
require("./ui/controls/menu.js");

var old_push = ui.panel.prototype.push;
ui.panel.prototype.push = function (what) {
    if (this.options.layout && what instanceof ui.Control) {
        what.element.css(this.options.layout);
    }
    return old_push.apply(this,arguments);
}

var old_addTab = ui.tabPanel.prototype.addTab;
ui.tabPanel.prototype.addTab = function (tab) {
    var ret = old_addTab.apply(this,arguments);
    tab.element.css({overflow:'auto'});
    return ret;
}
    
$.each_deep = function (parent,f) {
    if (parent && parent.children) $.each(parent.children,function(i){
        f.call(this,i,parent);
        if (this && this.children) $.each_deep(this,f);
    });
}

Component.app.ui.push(
    require("./ui/ui.js")
);
Component.app.styles.push(
    require.dir + "/style/style.tea"
);