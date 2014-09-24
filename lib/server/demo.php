<?php

if (!isset($_REQUEST['_type'])) return;
    
require "api.php";

class DemoTemplaterApi extends TemplaterApi {
}
$api = new DemoTemplaterApi;

$project = @$_REQUEST['_project'];
if (!$project) $project = 'demo';

$api->settingsPath = __DIR__."/projects/$project/$project.json";
$api->templatePath = __DIR__."/projects/$project/view";
$api->run();