ui.countdownEditor = ui.composite.extendOptions({
    items: [
        "Finish date (like 2015/12/27 10:00:00 UTC)",
        { type: "text" , name: "time" }
    ]
});

ui.countdown = ui.presetSwitcherCombo.extendOptions({
    width: "100%",margin: "0 0 0 0",
    inlineEditor: true, comboWidth: 200, editorWidth: 200,
    panelClass: false,
    presetName: "counter"
});

ui.countdown.default = ui.composite.extendOptions({
    switcherLabel: function (value) {
        var val = $.extend({},value);
        val.fontSize = 30;
        return teaSwitcherLabel(
            $("<div>").css({margin:0,lineHeight:0,padding:3}).append(
                value.days ? '<span class="county-days"><span>23</span></span>':'',
                '<span class="county-hours separator-left"><span>17</span></span>',
                '<span class="county-minutes separator-left"><span>55</span></span>',
                '<span class="county-seconds separator-left"><span>46</span></span>'
            ),
            teacss.functions.countdown,
            val
        );
    }
},{
    label: "County", padding: 10, skipForm: true,
    items: [
        "Colors:",
        { type: "fillCombo", label: "Top", name: "color1" },
        { type: "fillCombo", label: "Bottom", name: "color2" },
        "Animation:",
        { type: "select", items: { false: "none", scroll: "scroll", fade: "fade" }, name:"animation" }
    ]
});