<?php

$components['post_title'] = array(
    'name' => 'Post Title',
    'description' => 'Post or page title',
    'category' => 'Content',
    'update' => function ($val,$dataSource) use ($me) {
        return array(
            'html' => '<div>'.$me->liquid('<h2 class="page-title">{{ post.title }}</h2>',$dataSource)."</div>"
        );
    }
);

$components['post_content'] = array(
    'name' => 'Post Content',
    'description' => 'Post or page content',
    'category' => 'Content',
    'update' => function ($val,$dataSource,$api) {
        return array(
            'html' => '<div class="post-content">'.$api->liquid('{{ post.content }}',$dataSource)."</div>"
        );
    }
);        

$components['post_comments'] = array(
    'name' => 'Post Comments',
    'description' => 'Post comments and comment form',
    'category' => 'Content',
    'update' => function ($val,$dataSource,$api) {
        $template = '
            <div class="comments">
            {% for comment in post.comments %}
                <div class="comment" id="comment-{{ comment.id }}">
                    {% if comment.type=="pingback" or comment.type=="trackback" %}
                    {% else %}
                        {{ comment.author }} says on {{ comment.date }}:
                        {% if not comment.approved %}
                            <em class="comment-awaiting-moderation">Your comment is awaiting moderation.</em>
                        {% endif %}
                    
                        <div class="comment-body">
                            {{ comment.content }}
                        </div>
                    
                    {% endif %}
                </div>
            {% endfor %}
            </div>                
            {{ post.comment_form | raw }}
        ';
        return array(
            'html' => '<div>'.$api->liquid($template,$dataSource)."</div>"
        );
    }            
);

$components['blog_posts'] = array(
    'name' => 'Blog Posts',
    'description' => 'Latest posts',
    'category' => 'Content',
    'update' => function ($val,$dataSource,$api) {
        $template = '
            {% assign posts = "post_type=post&post_count=10&post_status=publish" | posts %}
            {% for post in posts %}
                <article class="post">
                    <div class="post-header">
                        <h3 class="post-title"><a href="{{ post.permalink }}">{{ post.title }}</a></h3>
                        <span class="date">Posted on {{ post.date }}</span>
                    </div>
                    <div class="post-content">
                        {{ post.excerpt }}
                    </div>
                    <div class="post-footer">
                        <span class="author">
                            <i class="icon icon-user"></i>
                            Written by <span class="author-name">{{ post.author }}</span>
                        </span>
                        <span class="comments">
                            <i class="icon icon-comments"></i>
                            <a href="{{ post.permalink }}#comments">
                                {{ post.comment_count }} 
                                {% if post.comment_count == 1 %}
                                    comment
                                {% else %}
                                    comments 
                                {% endif %}
                            </a>
                        </span>
                    </div>
                </article>
            {% endfor %}
        ';
        return array(
            'html' => '<div>'.$api->liquid($template,$dataSource)."</div>"
        );
    }
);

$components['portfolio_list'] = array(
    'name' => 'Portfolio list',
    'description' => 'Portfolio works with tags',
    'category' => 'Content',
    'update' => function ($val,$dataSource) use ($me) {
        
        $columns = (int)$val['columns'];
        if (!$columns) $columns = 4;
        
        $settings = $me->getSettings();
        $width = ((int)$settings['theme']['sheet']['width']);
        $thumbWidth = (int)(($width - 10*($columns-1)) / $columns);
        
        $template = '
            <div class="tag-filter">
                <a href="#" class="tag-all active">All tags</a>
                {% assign tags = "portfolio" | tags %}
                {% for tag in tags %}
                    <a href="#" class="tag-{{ tag }}">{{ tag }}</a>
                {% endfor %}
            </div>
            {% assign posts = "post_type=portfolio" | posts %}
            <div class="portfolio">
                {% for work in posts %}
                    <div style="width:'.$thumbWidth.'px;height:'.$thumbWidth.'px" class="work tag-all{% for tag in work.tags %} tag-{{ tag }}{% endfor %}">
                    <img src="{{ work.preview_image | image_url: \''.$thumbWidth."x".$thumbWidth.'\' }}">
                    <a class="enlarge" href="{{ work.permalink }}">Enlarge</a>
                    <a class="visit" href="{{ work.url }}" target="_blank">Visit website</a>
                    <h3>{{ work.title }}</h3>
                    <p>{{ work.excerpt | truncatewords: 10 }}</p>
                </div>
                {% endfor %}
            </div>
        ';
        return array(
            'form' => '
                <label>Number of columns</label>
                <input name="columns" value="'.$columns.'">
            ',
            'html' => '<div>'.$me->liquid($template,$dataSource)."</div>",
            'value' => $val
        );
    }
);

$components['slider'] = array(
    'name' => 'Slider',
    'description' => 'Slider based on user data',
    'category' => 'Content',
    'update' => function ($val,$dataSource,$api) {
        
        $source = @$val['source'];
        if (!$source) $source = "post.images";
        
        
        $template = '
            <div class="flexslider">
                {% assign slides = post.slider.slides %}
                {% if slides.size == 0 %}
                    
                {% else %}
                    {% for one in slides %}
                    <div>
                        {{ one.content }}
                    </div>
                    {% endfor %}
                {% endif %}
            </div>
        ';
        
        return array(
            'html' => '<div>'.$api->liquid($template,$dataSource)."</div>",
            'form' => '<label>Source</label><input name="source">',
            'value' => $val
        );
    }
);

$components['google_map'] = array(
    'name' => 'Google map',
    'description' => 'Map for certain location',
    'category' => 'Content',
    'update' => function ($val,$dataSource) use ($me) {
        $id = $val['id'];
        $map_id = $id."_map";
        
        $template = '
            <div>
                <div id="'.$map_id.'" style="width:100%;height:400px"></div>
                <script type="text/javascript" src="https://www.google.com/jsapi"></script>
                <script>
                    google.load("maps","3",{
                        other_params: "sensor=false",
                        callback: function(){
                            $(function(){
                                var mapOptions = {
                                    zoom: {{ post.map_zoom }},
                                    center: new google.maps.LatLng({{ post.map_location.coordinates }}),
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                };
                                var map = new google.maps.Map(document.getElementById("'.$map_id.'"),mapOptions);
                            });
                        }
                    });
                </script>    
            </div>
        ';
        
        return array(
            'html' => '<div>'.$me->liquid($template,$dataSource)."</div>"
        );
    }
);