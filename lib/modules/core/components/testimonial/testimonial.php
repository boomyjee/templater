<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['testimonial'] = array(
        'name' => 'Testimonial',
        'description' => 'To raise page trust',
        'category' => 'Landing page',
        'static' => true,
        'update' => function ($val,$dataSource) use ($me,$api) {
    
            if (!$val) $val = array();
            $val['name'] = @$val['name'] ?: "Customer name";
            $val['position'] = @$val['position'];
            $val['link'] = @$val['link'] ?: '';
            $val['pic'] = @$val['pic'] ?: '';
            $val['text'] = @$val['text'] ?: 'A review text from customer';
            
            $cls = $val['pic'] ? '' : 'no-avatar';
            
            ob_start();
            ?>
                <div class='testimonial'>
                    <blockquote><?= $val['text'] ?></blockquote>
                    <div class="person <?=$cls?>">
                        <? if ($val['pic']): ?>
                            <img class='avatar' src="<?=$api->uploadUrl?>/files/<?=$val['pic']?>">
                        <? endif ?>
                        <div class="person-text">
                            <span class='name'><?= $val['name'] ?></span>
                            <? if ($val['position']): ?>
                                <span class='position'><?= $val['position'] ?></span>
                            <? endif ?>
                        </div>
                    </div>
                </div>
            <?
            $html = ob_get_clean();
            
            return array(
                'form' => array('control' => 'ui.testimonialEditor'),
                'value' => $val,
                'html' => $html
            );        
            
        }
    );
});