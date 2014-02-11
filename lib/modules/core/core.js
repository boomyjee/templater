// lib
require("./style/tea/common/color-variate.js");
require("./ui/lib/rgbcolor.js");
require("./ui/lib/canvg.js");
require("./ui/lib/fontdetect.js");
require("./ui/lib/randomize.js");

// controls
require("./ui/controls/presetCombo.js");
require("./ui/controls/imageCombo.js");
require("./ui/controls/lengthCombo.js");
require("./ui/controls/layoutCombo.js");
require("./ui/controls/layoutResizer.js");
require("./ui/controls/paddingControl.js");
require("./ui/controls/typography.js");
require("./ui/controls/backgroundCombo.js");
require("./ui/controls/fillCombo.js");
require("./ui/controls/paletteColorPicker.js");
require("./ui/controls/fontCombo.js");
require("./ui/controls/fileManager.js");
require("./ui/controls/buttonCombo.js");
require("./ui/controls/colorThemeCombo.js");
require("./ui/controls/borderControl.js");

// component editors
require("./components/list/list.js");
require("./components/image/image.js");
require("./components/logo/logoCombo.js");
require("./components/logo/logo.js");
require("./components/wysiwyg/wysiwyg.js");
require("./components/wysiwyg/htmlEditor.js");
require("./components/slider/slider.js");
require("./components/form/form.js");
require("./components/testimonial/testimonial.js");

// fontAwesome
require("./core.css");

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
        }
    },
    Component.app.settings.theme
);

require("./ui/ui.js");
Component.app.styles.push(
    require.dir + "/style/style.tea"
);