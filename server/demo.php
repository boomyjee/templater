<?php

if (!isset($_REQUEST['_type'])) return;
    
require "api.php";

class DemoTemplaterApi extends TemplaterApi {}
$api = new DemoTemplaterApi;

$project = @$_GET['project'];
if (!$project) $project = 'demo';

$api->settingsPath = __DIR__."/projects/".$project.".json";

$api->run();