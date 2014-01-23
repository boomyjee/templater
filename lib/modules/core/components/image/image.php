<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['image'] = array(
        'name' => 'Image',
        'description' => 'Simple image block',
        'category' => 'Content',
        'static' => true,
        'update' => function ($val) use ($api) {
            
            $src = @$val['src'];
            
            if ($src)
                $html = "<img src='".$api->uploadUrl."/files/".$src."'>";
            else
                $html = "<div class='empty-info'>Image placeholder</div>";
                
            return array(
                'form' => array('control' => 'ui.imageEditor'),
                'value' => $val,
                'html' => $html
            );
        }
    );
});