// If this file exists in theme directory, it will be loaded in <head> section

var imgLoading = new Image();
// imgLoading.src = 'themes/oxygen/img/loading.gif';


var frame = $('iframe[name="' + window.name + '"]', window.parent.document);
var ctl = window.parent.teacss.jQuery(frame[0]).data("control");

ctl.frameSetValue = function (val) {
    $('.file').removeClass('selected');
    $("#files .file").each(function(){
        var file = $(this);
        var data = file.data();
        if (data.name==val) {
            browser.selectFile(file);
            return false;
        }
    });
}

old_initFiles = browser.initFiles;
browser.initFiles = function () {
    old_initFiles.apply(this,arguments);
    ctl.frameSetValue(ctl.getValue());
};

browser.selectFile = function(file, e) {
    var data = file.data();
    $('.file').removeClass('selected');
    file.addClass('selected');
    $('#fileinfo').html(data.name + ' (' + this.humanSize(data.size) + ', ' + data.date + ')');
    
    ctl.setValue(data.name,true);
    ctl.trigger("change");
};