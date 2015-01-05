var templater_options = false;
function templater(options) {
    templater.options = options;
    
    var scripts = document.getElementsByTagName("script");
    for (var i=0;i<scripts.length;i++) {
        var script = scripts[i];
        if (script.src.indexOf("templater.js")!=-1) {
            var app_path = script.src.replace("templater.js","client/app.js")
            document.write('<script src="/~boomyjee/teacss/lib/teacss.js"></script>');
            document.write('<script src="/~boomyjee/teacss-ui/lib/teacss-ui.js"></script>');
            document.write('<link  href="/~boomyjee/teacss-ui/lib/teacss-ui.css" type="text/css" rel="stylesheet">');
            document.write('<script src="/~boomyjee/dayside/client/lib/require.js"></script>');
            document.write('<script src="/~boomyjee/dayside/client/lib/require.proxy.php"></script>');
            document.write("<script>templater_load('"+app_path+"')</script>");
            break;
        }
    }
}

function templater_load(app_path) {
    require(app_path,function (app) {
        app(teacss.jQuery.extend({
            ajax_url: "lib/server/demo.php",
            browse_url: "lib/server/browse.php",
            upload_url: "lib/server/upload"
        },templater.options));
    });
}