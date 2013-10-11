<?php

if (!class_exists('Liquid')) require_once __DIR__."/lib/Liquid/Liquid.class.php";

class TemplaterApi {
    
    static $actions = array();
    
    static function addAction($token,$f) {
        if (!isset(self::$actions[$token]))
            self::$actions[$token] = array();
        self::$actions[$token][] = $f;
    }
    
    static function runAction($token,$args) {
        if (!isset(self::$actions[$token])) return;
        foreach (self::$actions[$token] as $f) {
            $res = call_user_func_array($f,$args);
            if ($res===false) return false;
        }
    }
    
    function __construct($lock=true) {
        if (file_exists(__DIR__."/lock")) {
            echo "Please remove file named 'lock' from server directory to allow demo api to work";
            die();
        }
        
        $this->modules = $_REQUEST['_modules'] ? : array();
        
        $this->uploadDir = __DIR__."/upload";
        $this->settingsPath = __DIR__."/settings.json";
        
        $this->base_url = dirname(dirname($_SERVER['SCRIPT_URL']));
        $this->base_dir = dirname(__DIR__);
        
        $this->includeModules($this->modules);
    }    
    
    function includeModules($modules) {
        foreach ($modules as $module) {
            if ($module[0]!="/")
                include __DIR__."/../modules/$module/$module.php";
        }
    }
    
    function compress($out) {
        if (ini_get('zlib.output_compression') && 'ob_gzhandler' != ini_get('output_handler') && isset($_SERVER['HTTP_ACCEPT_ENCODING'])) {
            header('Vary: Accept-Encoding');
            if ( false !== stripos($_SERVER['HTTP_ACCEPT_ENCODING'], 'deflate') && function_exists('gzdeflate')) {
                header('Content-Encoding: deflate');
                $out = gzdeflate( $out, 3 );
            } elseif ( false !== stripos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') && function_exists('gzencode') ) {
                header('Content-Encoding: gzip');
                $out = gzencode( $out, 3 );
            }
        }
        echo $out;
        exit;
    }
    
    function run() {
        $action = $_REQUEST['_type'];
        $res = self::runAction('run',array($this,$action));
        if ($res!==false) {
            if (method_exists($this,$action)) {
                $this->$action();
            } else {
                echo 'No handler for this method';
            }
        }
        die();                
    }
    
    function getComponents() {
        $components = array();
        self::runAction('getComponents',array($this,&$components));
        return $components;
    }
    
    function getDataSources() {
        return array();
    }
    
    function component($values = false,$ret = false) {
        if (!$values) $values = $_REQUEST['values'];
        $components = $this->getComponents();
        $res = array();
        foreach ($values as $val) {
            $upd = array('html'=>'');
            $type = $val['type'];
            if (@$components[$type]) {
                if (isset($components[$type]['html'])) {
                    $upd['html'] = $components[$type]['html'];
                } else {
                    $upd = $components[$type]['update']($val,@$_REQUEST['dataSource'],$this,true);
                }
            }
            $res[] = $upd;
        }
        if ($ret) return $res;
        $this->compress(json_encode($res));
    }
    
    function liquid($template,$dataSource) {
        $data = array();
        $liquid = new \LiquidTemplate();
        if (class_exists("LiquidThemeFilters"))
            $liquid->registerFilter("LiquidThemeFilters");
        $tpl = $liquid->parse($template);
        return $tpl->render($data);        
    }    
    
    function upload() {
        $name = @$_REQUEST['name'];
        $iconWidth = @$_REQUEST['iconWidth'];
        $iconHeight = @$_REQUEST['iconHeight'];
        
        if ($name) {
            $dir = $this->uploadDir."/".$name;
            $tdir = $this->uploadDir."/".$name."/thumbs";
            
            if (!file_exists($dir)) mkdir($dir,0777,true);
            if (!file_exists($tdir)) mkdir($tdir,0777,true);
            
            $res = array();
            foreach ($_FILES as $key=>$val) {
                $error = $val['error'];
                if ($error==UPLOAD_ERR_OK) {
                    $name = $val['name'];
                    $tmp_name = $val['tmp_name'];
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    $dest = uniqid() . ($ext ? ".".$ext : "");
                    move_uploaded_file($tmp_name, $dir. "/" .$dest);
                    
                    require_once __DIR__."/lib/PhpThumb/Factory.php";
                    $file = \PhpThumb\Factory::create($dir."/".$dest,array('resizeUp'=>false));
                    $file->resize($iconWidth,$iconHeight);
                    
                    $thumb = basename($dest,".".$ext).".png";
                    $file->save($tdir."/".$thumb);    
                    
                    $url = str_replace($this->base_dir,$this->base_url,$dir."/".$dest);
                    $turl = str_replace($this->base_dir,$this->base_url,$tdir."/".$thumb);
                    
                    $res[] = array('url'=>$url,'icon'=>$turl);
                }
            }
            echo json_encode($res);
        }        
    }
    
    public $settings = false;
    public $settings_array = false;
    function getSettings($assoc=true) {
        $key = 'settings'.($assoc ? '_array':'');
        if (!$this->$key) {
            $this->$key = @file_get_contents($this->settingsPath);
            if ($this->$key) {
                $this->$key = json_decode($this->$key,$assoc);
            } else {
                $this->$key = array();
            }
        }
        return $this->$key;
    }
    
    function getTemplates2() {
        $templates = array();
        include_once __DIR__."/lib/XML2Array.php";
        
        $restoreCmp = function (&$cmp) use (&$restoreCmp) {
            if (isset($cmp['@attributes'])) {
                foreach ($cmp['@attributes'] as $key=>$val) {
                    $cmp['value'][$key] = $val;
                }
                unset($cmp['@attributes']);
            }
            
            if (isset($cmp['@value'])) unset($cmp['@value']);
            if (isset($cmp['component'])) {
                $list = isset($cmp['component'][0]) ? $cmp['component'] : array($cmp['component']);
                foreach ($list as $one) {
                    $restoreCmp($one);
                    $cmp['children'][] = $one;
                }
                unset($cmp['component']);
            }
            
            if (isset($cmp['value']['html'])) {
                $cmp['value']['html'] = $cmp['value']['html']['@cdata'];
            }
        };           
        
        
        $project_dir = str_replace(".json","",$this->settingsPath);
        if (file_exists($project_dir)) {
            $iterator = new \DirectoryIterator($project_dir);
            foreach ($iterator as $sub) {
                if (!$sub->isDot() && !$sub->isDir()) {
                    $name = $sub->getBasename('.xml');
                    if ($name == $sub->getBasename()) continue;
                    
                    $data = XML2Array::createArray(file_get_contents($sub->getPathname()));
                    $data = $data['template'];
                    $restoreCmp($data);                           
                    $templates[$name] = $data;
                }
            }
        }
        if (empty($templates)) $templates = false;        
        return json_encode($templates);
    }
    
    function getTemplates() {
        $templates = array();
        
        $restoreCmp = function ($cmp,$key=false) use (&$restoreCmp) {
            $out = array('value'=>array());
            
            if ($key) {
                $parts = explode('#',$key,2);
                $out['value']['id'] = $parts[1];
                $out['value']['type'] = $parts[0];
            }
            
            if (!is_array($cmp)) {
                $cmp = array($out['value']['type'] => $cmp);
            }
            
            foreach ($cmp as $k=>$v) {
                if (strpos($k,"#")!==false) {
                    $out['children'][] = $restoreCmp($v,$k);
                } else {
                    $out['value'][$k] = $v;
                }
            }
            return $out;
        };   

        $project_dir = str_replace(".json","",$this->settingsPath);
        if (file_exists($project_dir)) {
            $iterator = new \DirectoryIterator($project_dir);
            foreach ($iterator as $sub) {
                if (!$sub->isDot() && !$sub->isDir()) {
                    $name = $sub->getBasename('.yaml');
                    if ($name == $sub->getBasename()) continue;
                    
                    $data = yaml_parse(file_get_contents($sub->getPathname()));
                    $data = $restoreCmp($data);                           
                    
                    $templates[$name] = $data;
                }
            }
        }
        if (empty($templates)) $templates = false;        
        return json_encode($templates);
    }    
    
    function getTheme() {
        return @file_get_contents($this->settingsPath);
    }
    
    function load() {
        $res = array();
        $res['theme'] = $this->getTheme();
        $res['templates'] = $this->getTemplates();
        
        $components = $this->getComponents();
        $res['components'] = array();
        foreach ($components as $key=>$one) {
            unset($one['update']);
            $res['components'][$key] = $one;
            $res['components'][$key]['id'] = $key;
            
            $comps = $this->component(array(array('type'=>$key)),true);
            $res['components'][$key]['new'] = $comps[0];
        }
        
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(realpath(__DIR__."/../modules"),
                RecursiveDirectoryIterator::SKIP_DOTS));
        
        $cache = true;
        if (isset($_POST['cache']) && !$_POST['cache']) $cache = false;
        
        if ($cache) foreach ($files as $name => $file) {
            $ext = pathinfo($name, PATHINFO_EXTENSION);
            if ($ext=="js" || $ext=="tea" || $ext=='css') {
                $url = str_replace($this->base_dir,$this->base_url,$name)."\n";
                $res['cached'][$url] = file_get_contents($name);
            }
        }
        $this->compress(json_encode($res));
    }
    
    function saveTheme($theme) {
        file_put_contents($this->settingsPath,$theme);
    }
    
    function saveTemplates($templates) {
        $fixCmp = function (&$cmp) use (&$fixCmp) {
            $val = &$cmp['value'];
            $atts = array('id','type','parentTemplate');
            
            foreach ($atts as $key) {
                if (isset($val[$key])) {
                    $cmp['@attributes'][$key] = $val[$key];
                    unset($val[$key]);
                }
            }
            if (empty($val)) unset($cmp['value']);
            
            if (isset($cmp['children'])) {
                $children = array();
                foreach ($cmp['children'] as &$child) {
                    $fixCmp($child);
                }
                $cmp['component'] = $cmp['children'];
                unset($cmp['children']);
            }
            
            if (isset($cmp['value']['html'])) {
                $cmp['value']['html'] = array('@cdata'=>$cmp['value']['html']);
            }
        };   
        
        $fixYaml = function ($cmp) use (&$fixYaml) {
            $type = $cmp['value']['type'];
            $key = $type."#".$cmp['value']['id'];
            $out = array();
            $out[$key] = @$cmp['value'];
            
            unset($out[$key]['id']);
            unset($out[$key]['type']);
            
            if (isset($cmp['children'])) {
                foreach ($cmp['children'] as &$child) {
                    foreach ($fixYaml($child) as $k=>$v) {
                        $out[$key][$k] = $v;
                    }
                }
            } else {
                $data = $out[$key];
                if (is_array($data) && count($data)==1 && isset($data[$type])) {
                    $out[$key] = $data[$type];
                }
            }
            return $out;
        };
        
        // save templates
        include_once __DIR__."/lib/Array2XML.php";
        $templates = json_decode($templates,true);
        
        $project_dir = str_replace(".json","",$this->settingsPath);
        
        if (!file_exists($project_dir)) mkdir($project_dir);
        
        $files = glob($project_dir.'/*');
        foreach ($files as $file) {
            if (is_file($file)) unlink($file);
        }        
        
        ini_set('yaml.output_indent',4);
        
        foreach ($templates as $name=>$one) {
            $yaml_path = $project_dir."/".$name.".yaml";
            $data = $fixYaml($one);
            $data = reset($data);
            file_put_contents($yaml_path,yaml_emit($data,YAML_UTF8_ENCODING));
            
            $tpl_path = $project_dir."/".$name.".xml";
            $fixCmp($one);
            $xml = Array2XML::createXML('template', $one);
            file_put_contents($tpl_path,$xml->saveXML());
        }
    }
    
    function save() {
        $this->saveTheme(@$_REQUEST['theme']);
        $this->saveTemplates(@$_REQUEST['templates']);
    }    
    
    function publish() {
        // nothing to do
    }
    
    function view($name,$dataSource) {
        $templates = $this->getTemplates();
        $templates = json_decode($templates);
        
        $tpl = $templates->$name;
        
        Component::$api = $this;
        Component::$dataSource = $dataSource;
        Component::$settings &= $settings;

        $root_data = $tpl;
        $root = new Component($root_data);
        
        $hash = array();
        $inherit = false;
        
        $title = false;
        
        // if template has a parent then load parent template and create substitution has from current one
        if (@$root_data->value->parentTemplate) {
            $findRoot = function ($data,$inherit) use (&$settings,&$findRoot,&$hash,&$root_data) {
                if (@$data->value->parentTemplate) {
                    $findRoot($settings->templates->{$data->value->parentTemplate} ? : (object)array(),true);
                    if ($data->children) foreach ($data->children as $child) {
                        if (@$child->value->id) $hash[$child->value->id] = array('data'=>$child,'inherit'=>$inherit);
                    }
                } else {
                    $root_data = $data;
                }
            };
            
            $findRoot($tpl,false);
            $inherit = @$root->parentTemplate ? true : false;
        }
        
        // get all components into list recursively taking into account template inheritance
        $components = array();
        $component_values = array();
        
        $createComponents = function($parent,$data,$inherit) use (&$settings,&$components,&$component_values,&$hash,&$createComponents) {
            if ($data->children) foreach ($data->children as $child) {
                $ch_data = $child;
                $ch_inherit = $inherit;
                
                if ($child->value && $child->value->id && isset($hash[$child->value->id])) {
                    $ch_data = $hash[$child->value->id]['data'];
                    $ch_inherit = $hash[$child->value->id]['inherit'];
                }
                
                $cmp = new Component($child->value,$parent);
                $cmp->inherited = $ch_inherit;
                
                $components[] = $cmp;
                $component_values[] = $cmp->value;
                
                $createComponents($cmp,$ch_data,$ch_inherit);
                
                Component::$api->registerComponent($cmp);
            }
        };
        $createComponents($root,$root_data,$inherit); 
        $root_html = $root->render();
        
        ?>
            <body>
                <?= $root_html ?>
            </body>
        <?
    }
    
    function registerComponent($cmp) {
        // nothing to do
    }
}

class Component {
    
    static $settings;
    static $components = false;
    static $dataSource = false;
    static $api = false;
    
    function __construct($val,$parent=false) {
        $this->value = $val ?: (object)array();
        $this->children = array();
        if ($parent) {
            $parent->children[] = $this;
        }
    }
    
	function objectToArray($d) {
		if (is_object($d) && !$d instanceof Closure) {
			$d = get_object_vars($d);
		}
		if (is_array($d)) {
			return array_map(array($this,__FUNCTION__), $d);
		}
		else {
			return $d;
		}
	}
    
    function render() {
        if (!self::$components) {
            self::$components = self::$api->getComponents();
        }
        
        $type = $this->value->type;
        $html = "";
        if (!$type) {
            $html = '<br class="component-area">';
        } else {
            if (@self::$components[$type]) {
                $upd = array('html'=>'');
                if (isset(self::$components[$type]['html'])) {
                    $upd['html'] = self::$components[$type]['html'];
                } else {
                    $f = self::$components[$type]['update'];
                    $upd = $f($this->objectToArray($this->value),self::$dataSource,self::$api,false);
                }
                $html = $upd['html'];
            }
        }
        
        $me = $this;
        if ($me->value->id) $html = preg_replace_callback(
            '|^\s*<(\w+)(.*?)>|',
            function ($matches) use (&$me) {
                if (!preg_match('|id\s*=\s*|',$matches[0])) {
                    return "<".$matches[1].' id="'.$me->value->id.'"'.$matches[2].">";
                }
                return $matches[0];
            },
            $html
        );
        if ($me->value->class) $html = preg_replace_callback(
            '|^\s*<(\w+)(.*?)>|',
            function ($matches) use (&$me) {
                if (!preg_match('|class\s*=\s*?|',$matches[0])) {
                    return "<".$matches[1].' class="'.$me->value->class.'"'.$matches[2].">";
                }
                return $matches[0];
            },
            $html
        );
        $html = preg_replace_callback(
            '|<br class="component-area".*?>|',
            function ($matches) use (&$me) {
                $child_html = "";
                foreach ($me->children as $child) {
                    $child_html .= $child->render();
                }
                return $child_html;
            },
            $html
        );
        return $html;
    }
}