<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['slider'] = array(
        'name' => 'Slider',
        'description' => 'Slider based on user data',
        'category' => 'Content',
        'static' => true,    
        'update' => function ($val,$dataSource,$api) {
            
            $slides = @$val['slides'] ? : array();
            
            ob_start();
            ?>
                <? if (count($slides)): ?>
                    <div class="slider">
                        <? foreach ($slides as $one): ?>
                            <? $slide = $one['slide'] ?>
                            <div>
                                <? if ($slide['type']=='html'): ?>
                                    <?= $slide['html'] ?>
                                <? elseif ($slide['type']=='image'): ?>
                                    <img src="<?= $slide['image'] ?>">
                                <? endif ?>
                            </div>
                        <? endforeach ?>
                    </div>
                <? else: ?>
                    <div class="empty-info">
                        Please, add slides to slider through edit menu
                    </div>
                <? endif ?>
            <?
            $html = ob_get_clean();
            
            return array(
                'html' => $html,
                'form' => array('control'=>'ui.sliderEditor'),
                'value' => $val
            );
        }
    );
});