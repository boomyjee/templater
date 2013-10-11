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
        $html = @$val['html'] ? : ""
            ."<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>"
            ."<p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</p>"
            ."<p>In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a,</p>"
        ;
            
        return array(
            'form' => "<textarea class='visual' name='html' rows='20' spellcheck='false'>".htmlspecialchars($html)."</textarea>",
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
        $template = @$val['liquid'] ?:"";
        return array(
            'form' => "<textarea name='liquid' rows='20' spellcheck='false'>".htmlspecialchars($template)."</textarea>",
            'value' => $val,
            'html' => '<div>'.$api->liquid($template,$dataSource)."</div>"
        );
    }
);
