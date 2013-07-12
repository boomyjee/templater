<?php

$components['container'] = array(
    'name' => 'Container',
    'description' => 'Styled container',
    'area' => ">.container",
    'category' => 'Common',
    'static' => true,
    'update' => function ($val) {
        return array(
            'html' => '<div><div class="container"><br class="component-area" /></div></div>'
        );
    }
);

$components['html'] = array(
    'name' => 'HTML',
    'description' => 'Custom HTML Block',
    'category' => 'Common',
    'static' => true,
    'update' => function ($val) {
        $html = @$val['html'] ? : "<p>Some <b>HTML</b> text</p>";
        return array(
            'form' => "<textarea name='html' rows='20' spellcheck='false'>".htmlspecialchars($html)."</textarea>",
            'value' => $val,
            'html' => '<div>'.$html."</div>"
        );
    }
);

$components['liquid'] = array(
    'name' => 'Template',
    'description' => 'Liquid template block',
    'category' => 'Common',
    'update' => function ($val,$dataSource,$api) {
        $template = @$val['template'] ?:"";
        return array(
            'form' => "<textarea name='template' rows='20' spellcheck='false'>".htmlspecialchars($template)."</textarea>",
            'value' => $val,
            'html' => '<div>'.$api->liquid($template,$dataSource)."</div>"
        );
    }
);
