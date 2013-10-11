// lib
require("./ui/lib/rgbcolor.js");
require("./ui/lib/canvg.js");
require("./ui/lib/fontdetect.js");
require("./ui/lib/color-variate.js");

// ui
require("./ui/controls/presetCombo.js");
require("./ui/controls/backgroundCombo.js");
require("./ui/controls/paletteColorPicker.js");
require("./ui/controls/fillCombo.js");
require("./ui/controls/lengthCombo.js");
require("./ui/controls/fontsCombo.js");
require("./ui/controls/fontCombo.js");
require("./ui/controls/headerStyle.js");
require("./ui/controls/multiCombo.js");
require("./ui/controls/textureCombo.js");
require("./ui/controls/paddingControl.js");
require("./ui/controls/typography.js");
require("./ui/controls/imageCombo.js");
require("./ui/controls/menu.js");

require("./components/logo/logoCombo.js");
require("./components/logo/logo.js");
require("./components/wysiwyg/wysiwyg.js");
require("./components/wysiwyg/htmlEditor.js");
require("./components/slider/slider.js");


var $ = teacss.jQuery;
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

Component.app.settings.theme = $.extend(
    true,
    { sheet: { width: "940px" },forms: {} },
    Component.app.settings.theme
);

require("./ui/ui.js")
Component.app.styles.push(
    require.dir + "/style/style.tea"
);