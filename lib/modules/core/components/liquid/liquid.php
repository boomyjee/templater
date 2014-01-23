<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['liquid'] = array(
        'name' => 'Template',
        'description' => 'Liquid template block',
        'category' => 'Common',
        'update' => function ($val,$dataSource,$api) {
            $template = @$val['liquid'] ?:"";
            return array(
                'form' => "<textarea name='liquid' rows='20' spellcheck='false'>".htmlspecialchars($template)."</textarea>",
                'value' => $val,
                'html' => '<div>'.$api->liquid($template,$dataSource)."</div>"
            );
        }
    );
});