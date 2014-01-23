ui.testimonialEditor = ui.composite.extendOptions({
    items: [
        "Name",
        { type: "text", name: "name" },
        "Position",
        { type: "text", name: "position" },
        "Picture",
        { type: 'text', name: 'pic' },
        { type: 'fileManager', name: 'pic' },
        "Link",
        { type: "text", name: "link" },
        "Text",
        { type: "textarea", name: "text" }
    ]
});

ui.testimonial = ui.presetSwitcherCombo.extendOptions({
    height: 200,
    panelClass: false,
    inlineEditor: true,
    presetName: "presets.testimonials"
});

ui.testimonial.default = ui.composite.extendOptions({
    label: "Default",
    items: []
});

ui.testimonial.balloon = ui.composite.extendOptions({
    label: "Balloon",
    items: []
});