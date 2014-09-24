<?
    $project = 'demo';
    $template = 'test';
    
    if (isset($_GET['view'])) {
        include "view.php"; 
        return;
    }
?>
<!doctype html>
<html>
<head>
    <title>Templater Edit</title>
    <meta charset="utf-8" />
    <script src="lib/templater.js"></script>
    <script>
        templater({
            project: "<?=$project?>",
            template: "<?=$template?>"
        })
    </script>
</head>
<body>
</body>
</html>