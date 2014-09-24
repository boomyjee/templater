<?php

TemplaterApi::addAction('getComponents',function($api,&$components) {
    $components['menu'] = array(
        'name' => 'Navigation menu',
        'description' => 'Horizontal menu bar',
        'category' => 'Website',
        'static' => true,
        'update' => function ($val,$dataSource,$api,$for_editor) {
            $items = @$val['items'] ? : array(
                array(
                    'label' => 'Menu Item 1',
                    'sublabel' => 'Sublabel 1',
                    'link' => 'link-1'
                ),
                array(
                    'label' => 'Menu Item 2',
                    'sublabel' => 'Sublabel 2',
                    'link' => 'link-2'
                ),
                array(
                    'label' => 'Menu Item 3',
                    'sublabel' => 'Sublabel 3',
                    'link' => 'link-3'
                )
            );
            $val['items'] = $items = array_values($items);
            ob_start();
            ?>
                <div class="menu top_menu">
                    <ul class="container">
                        <? foreach ($items as $i=>$item): ?>
                            <?
                                $selected = false;
                                if ($for_editor && $i==1) $selected = true;
                            ?>
                            <li class='menu-item <?=($selected ? "current-menu-item":"") ?>'>
                                <a href="<?=$item['link']?>">
                                    <?=$item['label']?>
                                    <? if (@$item['sublabel']): ?>
                                        <small><?=$item['sublabel']?></small>
                                    <? endif ?>
                                </a>
                            </li>
                        <? endforeach ?>
                    </ul>
                </div>
            <?
            $html = ob_get_clean();
            return array(
                'form' => '
                    <table>
                        <tr>
                            <th>label</th>
                            <th>sublabel</th>
                            <th>link</th>
                        </tr>
                        <tr data-value="'.htmlspecialchars(json_encode($items)).'" data-name="items">
                            <td><input name="label"></td>
                            <td><input name="sublabel"></td>
                            <td><input name="link"></td>
                            <td><a class="remove" href="#">remove item</a></td>
                        </tr>
                    </table>
                    <br>
                    <a class="add" href="#" data-name="items">add menu item</a>
                ',
                'value' => $val,
                'html' => $html
            );            
        }
    );
});