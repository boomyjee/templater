<?php

$components = array(
    'container' => array(
        'name' => 'Container',
        'description' => 'Styled container',
        'area' => ">.container",
        'category' => 'Layout',
        'update' => function ($val) {
            // $id = @$val['nice_id'] ? : $val['id'];
            $id = $val['id'];
            return array(
                'form' => 
                    "<label>Title</label><input name='title' value='".htmlentities("".@$val['title'])."'>"
                    ."<label>Id</label><input name='nice_id' value='".htmlentities("".@$val['nice_id'])."'>"
                ,
                'value' => $val,
                'html' => '<div id="'.$id.'"><div class="container"></div></div>'
            );
        }
    ),
    'logo' => array(
        'name' => 'Site logo',
        'description' => 'Website logo',
        'category' => 'Layout',
        'html' => '<div class="logo"></div>'
    ),
    'menu' => array(
        'name' => 'Vertical menu',
        'description' => 'Website configurable menu',
        'category' => 'Layout',
        'update' => function ($val) {
            return array(
                'html' => '
                    <div class="menu top_menu"><ul class="container" id="top_menu-list">
                        <li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-2 current_page_item menu-item-28" id="menu-item-28"><a href="http://uxcandy.com/~wp/candy/">Home</a></li>
                        <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-127" id="menu-item-127"><a href="http://uxcandy.com/~wp/candy/shortcodes/">Shortcodes</a>
                            <ul class="sub-menu">
                                <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-150" id="menu-item-150"><a href="http://uxcandy.com/~wp/candy/shortcodes/">Elements</a></li>
                                <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-56" id="menu-item-56"><a href="http://uxcandy.com/~wp/candy/shortcodes/typography/">Typography</a></li>
                                <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-163" id="menu-item-163"><a href="http://uxcandy.com/~wp/candy/shortcodes/media/">Media</a></li>
                            </ul>
                        </li>
                        <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-52" id="menu-item-52"><a href="http://uxcandy.com/~wp/candy/portfolio/">Portfolio</a></li>
                        <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-65" id="menu-item-65"><a href="http://uxcandy.com/~wp/candy/prices/">Prices</a></li>
                        <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-64" id="menu-item-64"><a href="http://uxcandy.com/~wp/candy/blog/">Blog</a></li>
                        <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-63" id="menu-item-63"><a href="http://uxcandy.com/~wp/candy/contacts/">Contacts</a></li>
                    </ul></div>
                '
            );
        }
    ),
    'html' => array(
        'name' => 'HTML',
        'description' => 'Custom HTML Block',
        'category' => 'Blocks',
        'update' => function ($val) {
            $html = @$val['html'] ? : "<p>Some <b>HTML</b> text</p>";
            return array(
                'form' => "<textarea name='html' rows='20' spellcheck='false'>".htmlentities($html)."</textarea>",
                'value' => $val,
                'html' => '<div>'.$html."</div>"
            );
        }
    )
);