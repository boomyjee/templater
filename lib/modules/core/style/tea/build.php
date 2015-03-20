<?
    if (isset($_POST['files'])) {
        file_put_contents(__DIR__."/bake.min.js",$_POST['files']['/bake.min.js']);
        return;
    }
?>
<html>
    <head>
        <title>bake library</title>
        <meta charset="utf-8">
        
        <link tea="bake.tea">
        <script src="http://code.jquery.com/jquery-1.7.2.js"></script>
        
        <script src="/~boomyjee/teacss/lib/teacss.js"></script>
        <script>teacss.update()</script>
    </head>
    <body>
        <h1>Build page for bake library</h1>
        <script>
            teacss.buildCallback = function (files) {
                
                var donut = teacss.path.absolute("bake.tea");
                var imports = [];
                function getImports(path) {
                    var parsed = teacss.parsed[path];
                    if (parsed) {
                        imports.push(path);
                        for (var i=0;i<parsed.imports.length;i++) {
                            getImports(parsed.imports[i]);
                        }
                    }
                }
                getImports(donut);
                
                var js = "// bake minified \n";
                var js = "var _root_ = tea.dir;"
                var _root_ = teacss.path.dir(imports[0]);
                var path_s_0 = "";
                for (var i=0;i<imports.length;i++) {
                    var im = imports[i];
                    var rel = teacss.path.relative(im,_root_);
                    var one_js = teacss.parsed[im].js; //.split('tea.import("'+).join('tea.import(_root_+"/');
                    one_js = one_js.replace(/tea\.import\((.*?)\);/g,function(match,path_s){
                        var path = JSON.parse(path_s);
                        var rel = teacss.path.relative(path,_root_);
                        var path_s = "_root_+"+JSON.stringify(rel);
                        return 'tea.import('+path_s+');';
                    });
                    var path_s = "_root_+"+JSON.stringify(rel);
                    if (i==0) path_s_0 = path_s;
                    js += "\n"+"teacss.parsed["+path_s+"] = ";
                    js += "{func:"+one_js+"\n};";
                }

                js += "teacss.parsed["+path_s_0+"].func();";

                files['/bake.min.js'] = js;

                $.post(
                    location.href,
                    {
                        files:files
                    },
                    function () {
                        alert('Success!');
                    }
                ); 
            }
        </script>
    </body>
</html>