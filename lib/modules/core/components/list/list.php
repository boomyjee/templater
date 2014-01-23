<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['list'] = array(
        'name' => 'List',
        'description' => 'Bulleted list',
        'category' => 'Content',
        'static' => true,
        'update' => function ($val) {
            
            $items = @$val['items'] ? : array();
            
            if (count($items)) {
                ob_start();
                ?>
                    <div class="list"><ul>
                    <? foreach ($items as $item): ?>
                        <li>
                            <?=$item['text']?>
                        </li>
                    <? endforeach ?>
                    </ul></div>
                <?
                $html = ob_get_clean();
            } else {
                $html = '<div class="empty-info">Empty list</div>';
            }
            
            return array(
                'value' => $val,
                'form' => array('control' => 'ui.listEditor'),
                'html' => $html
            );
        }
    );
});