<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['logo'] = array(
        'name' => 'Site logo',
        'description' => 'Website logo',
        'category' => 'Website',
        'static' => true,
        'html' => '<div class="logo"></div>'
    );
});

TemplaterApi::addAction('run',function($api,$action){
    
    if ($action=='logoData') {
        $key = $_REQUEST['key'];
        
        $data = file_get_contents(__DIR__."/symbols.json");
        $data = json_decode($data);
        
        echo json_encode($data->$key);
        return false;
    }
    
    if ($action=='logoLibrary') {
        
        $data = file_get_contents(__DIR__."/symbols.json");
        $data = (array)json_decode($data);

        echo json_encode(array_keys($data));
        return false;
    }
});