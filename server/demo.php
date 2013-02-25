<?php

if (!isset($_REQUEST['action'])) return;
    
require "api.php";

class DemoTemplaterApi extends TemplaterApi {}
$api = new DemoTemplaterApi;