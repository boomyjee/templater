<?php

if (!isset($_REQUEST['_type'])) return;
    
require "api.php";

class DemoTemplaterApi extends TemplaterApi {}
$api = new DemoTemplaterApi;
$api->run();