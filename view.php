<?
    require __DIR__."/lib/server/api.php";

    class ViewTemplaterApi extends TemplaterApi {}
    $api = new ViewTemplaterApi;
    
    $api->settingsPath = __DIR__."/lib/server/projects/".$project.".json";
    $api->templatePath = __DIR__."/lib/server/projects/$project/view";
    $api->uploadUrl = 'lib/server/upload';

    $assets = "lib/server/projects/$project/publish";
?>
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>Templater View</title>
        <script>var base_url = ""</script>
        <link rel="stylesheet" type="text/css" href="<?=$assets.'/default.css'?>">
        <script src="<?=$assets.'/default.js'?>"> </script>
    </head>           
    <? 
        $api->includeModules(array("core"));
        $api->view($template,false,false) 
    ?>
    </html>
<?