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
        
        $base_url = explode("?",$_SERVER['REQUEST_URI'],2);
        $base_url = $base_url[0];
        $base_url = dirname($base_url);
        
        $this->uploadDir = __DIR__."/upload";
        $this->uploadUrl = $base_url."/upload";
        
        $this->settingsPath = __DIR__."/settings.json";
        $this->templatePath = false;
        
        $this->base_url = dirname(dirname($_SERVER['SCRIPT_URL']));
        $this->base_dir = dirname(__DIR__);
        
        $this->modules = array("core");
    }    
    
    function includeModules($modules) {
        foreach ($modules as $module) {
            if ($module[0]!="/") {
                include __DIR__."/../modules/$module/$module.php";
            } else {
                $name = basename($module);
                include "$module/$name.php";
            }
        }
    }
    
    function compress($out) {
        ob_start('ob_gzhandler');
        echo $out;
        exit;
    }
    
    function run() {
        $action = $_REQUEST['_type'];
        $res = self::runAction('run',array($this,$action));
        if ($res!==false) {
            if (method_exists($this,$action)) {
                $this->includeModules($this->modules);
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
        if (!$values) $values = json_decode($_REQUEST['values'],true);
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
    
    function browse() {
        $api_url = explode("?",$_SERVER['REQUEST_URI'],2);
        $api_url = $api_url[0];
        
        define('KC_ROOT',$api_url);
        
        $url = @$_REQUEST['url'];
        
        if ($url) {
            $path = __DIR__."/lib/kcFinder".$url;
            if (is_file($path)) {
                $ext = pathinfo($path,PATHINFO_EXTENSION);
                if ($ext=='php') {
                    chdir(dirname($path));
                    include $path;
                    die();
                }
                if ($ext=='css') header('Content-type: text/css');
                if ($ext=='js') header('Content-type: application/javascript');
                readfile($path);
                die();
            }
            die();
        }
        
        global $_CONFIG;
        $config = array();
        $_CONFIG = array();
        $_CONFIG['disabled'] = false;
        $_CONFIG['uploadURL'] = "http://upload.url/dir";
        $_CONFIG['uploadDir'] = $this->uploadDir;
        if (isset($_REQUEST['theme'])) $_CONFIG['theme'] = $_REQUEST['theme'];
        
        $_CONFIG = array_merge($_CONFIG,$config);
        require __DIR__.'/lib/kcFinder/browse.php';        
    }
    
    function upload_delete() {
        $dir = @$_REQUEST['dir'];
        $name = @$_REQUEST['file'];
        
        $path = $this->uploadDir."/".$dir."/".$name;
        
        $ext = pathinfo($name, PATHINFO_EXTENSION);
        $thumb = basename($name,".".$ext).".png";
        $thumbPath = $this->uploadDir."/".$dir."/thumbs/".$thumb;
        
        if (file_exists($path)) {
            unlink($path);
        }
        if (file_exists($thumbPath)) {
            unlink($thumbPath);
        }
        echo "ok";
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
                    $dest = time()."_".uniqid() . ($ext ? ".".$ext : "");
                    move_uploaded_file($tmp_name, $dir. "/" .$dest);
                    
                    require_once __DIR__."/lib/PhpThumb/Factory.php";
                    $file = \PhpThumb\Factory::create($dir."/".$dest,array('resizeUp'=>false));
                    $file->resize($iconWidth,$iconHeight);
                    
                    $thumb = basename($dest,".".$ext).".png";
                    $file->save($tdir."/".$thumb);    
                    
                    $url = str_replace($this->base_dir,$this->base_url,$dir."/".$dest);
                    $turl = str_replace($this->base_dir,$this->base_url,$tdir."/".$thumb);
                    
                    $res[] = array('name'=>$dest,'url'=>$url,'icon'=>$turl);
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
    
    public $templates = false;
    function getTemplates($json=false) {
        $templates = $this->templates;
        if (!$templates) {
            $this->templates = $templates = (object)array();
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

            $project_dir = $this->templatePath ? : str_replace(".json","",$this->settingsPath);
            if (file_exists($project_dir)) {
                $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($project_dir,
                    RecursiveDirectoryIterator::SKIP_DOTS));

                foreach ($iterator as $sub) {
                    if (!$sub->isDir()) {
                        $path = $sub->getPathname();
                        $rel = str_replace($project_dir."/","",$path);
                        $name = str_replace(".yaml","",$rel);

                        if ($name==$rel) continue;

                        $data = yaml_parse(file_get_contents($path));
                        $data = $restoreCmp($data);                           

                        $templates->$name = $data;
                    }
                }
            }
        }
        if (!$json) return $templates;
        return json_encode($templates);
    }    
    
    function getTheme($json=false) {
        $data = @file_get_contents($this->settingsPath);
        if ($json) return $data;
        return json_decode($data);
    }
    
    function load() {
        $res = array();
        $res['theme'] = $this->getTheme(true);
        $res['templates'] = $this->getTemplates(true);
        
        $components = $this->getComponents();
        $res['components'] = array();
        foreach ($components as $key=>$one) {
            unset($one['update']);
            $res['components'][$key] = $one;
            $res['components'][$key]['id'] = $key;
            
            $comps = $this->component(array(array('type'=>$key)),true);
            $res['components'][$key]['new'] = $comps[0];
        }
        
        $upload = new DirectoryIterator($this->uploadDir);
        foreach ($upload as $dir) {
            if ($dir->isDir() && !$dir->isDot()) {
                $files = new DirectoryIterator($dir->getPathname());
                foreach ($files as $file) {
                    if ($file->isFile()) {
                        $res['upload'][$dir->__toString()][] = $file->__toString();
                    }
                }
            }
        }
        
        $cache = true;
        if (isset($_POST['cache']) && !$_POST['cache']) $cache = false;
        
        if ($cache) {
            
            $dirs = new DirectoryIterator(realpath(__DIR__."/../modules"));
            
            foreach ($dirs as $dir) {
                if (!$dir->isDir() || $dir->isDot()) continue;
                $dirname = $dir->getBasename();
                if (!in_array($dirname,$this->modules)) continue;
                
                $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(realpath(__DIR__."/../modules/".$dirname),
                        RecursiveDirectoryIterator::SKIP_DOTS));
                
                foreach ($files as $name => $file) {
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    if ($ext=="js" || $ext=="tea" || $ext=='css') {
                        $url = str_replace($this->base_dir,$this->base_url,$name)."\n";
                        $res['cached'][$url] = file_get_contents($name);
                    }
                }
            }
        }
        $this->compress(json_encode($res));
    }
    
    function saveTheme($theme) {
        file_put_contents($this->settingsPath,$theme);
    }
    
    function saveTemplates($templates) {
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
        $templates = json_decode($templates,true);
        $project_dir = $this->templatePath ? : str_replace(".json","",$this->settingsPath);
        
        if (!file_exists($project_dir)) mkdir($project_dir);
        
        $files = glob($project_dir.'/*');
        foreach ($files as $file) {
            if (is_file($file)) unlink($file);
        }        
        
        ini_set('yaml.output_indent',4);
        foreach ($templates as $name=>$one) {
            $yaml_path = $project_dir."/".$name.".yaml";
            $dir = dirname($yaml_path);
            if (!file_exists($dir))
                mkdir($dir,0777,true);
            
            $data = $fixYaml($one);
            $data = reset($data);
            file_put_contents($yaml_path,yaml_emit($data,YAML_UTF8_ENCODING));
        }
    }
    
    function save() {
        $this->saveTheme(@$_REQUEST['theme']);
        $this->saveTemplates(@$_REQUEST['templates']);
    }    
    
    function publish() {
        $project = @$_REQUEST['_project'];
        if (!$project) return;
        
        $files = $_REQUEST['files'];
        $base = __DIR__."/projects/$project/publish/";
        
        if (!file_exists($base)) mkdir($base,0777,true);
        foreach ($files as $path=>$text) {
            $path = $base.$path;

            $mark = "data:image/png;base64,";
            if (strpos($text,$mark)===0)
                $text = base64_decode(substr($text,strlen($mark)));
            
            $res = file_put_contents($path,$text);
        }        
    }
    
    function view($name,$dataSource,$ret) {
        
        $this->includeModules($this->modules);
        
        $templates = $this->getTemplates(true);
        $templates = json_decode($templates);
        
        $tpl = $templates->$name;
        
        Component::$api = $this;
        Component::$dataSource = $dataSource;
        
        $root_data = $tpl;
        $root = new Component($root_data);
        
        $hash = array();
        $inherit = false;
        
        $title = false;
        
        // if template has a parent then load parent template and create substitution has from current one
        if (@$root_data->value->parentTemplate) {
            $findRoot = function ($data,$inherit) use (&$templates,&$findRoot,&$hash,&$root_data) {
                if (@$data->value->parentTemplate) {
                    $findRoot($templates->{$data->value->parentTemplate} ? : (object)array(),true);
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
        
        $createComponents = function($parent,$data,$inherit) use (&$templates,&$components,&$component_values,&$hash,&$createComponents) {
            if (isset($data->children) && $data->children) foreach ($data->children as $child) {
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
        
        if ($ret) return $root_html;
        echo $root_html;
    }
    
    function registerComponent($cmp) {
        // nothing to do
    }
}

class Component {
    
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
        
        $type = @$this->value->type;
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
        if (isset($me->value->id)) $html = preg_replace_callback(
            '|^\s*<(\w+)(.*?)>|',
            function ($matches) use (&$me) {
                if (!preg_match('|id\s*=\s*|',$matches[0])) {
                    return "<".$matches[1].' id="'.$me->value->id.'"'.$matches[2].">";
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