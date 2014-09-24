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
                
                var donut = "bake.tea";
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

                var js = "// bake minified ";
                for (var i=0;i<imports.length;i++) {
                    var im = imports[i];
                    js += "\n"+"teacss.parsed["+JSON.stringify(im)+"] = ";
                    js += "{func:"+teacss.parsed[im].js+"\n};";
                }

                js += "teacss.parsed["+JSON.stringify(imports[0])+"].func();";

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