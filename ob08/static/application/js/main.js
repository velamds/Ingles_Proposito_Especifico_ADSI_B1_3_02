// Author       : Robert McMahon
// Date Started : 26/03/2014
// Notes *******************************************************
// functions prefixed with ajax are located in the ajax.js file
// functions prefixed with core are located in the core.js file
// varibles with _json in them are json objects


//url params hard coded
//write function to capture from url
var sco_number = 1015;
var client_id = 1;
var config_file = "default";
//Globals
var viewModel = undefined;
var localize_json = undefined;
var lesson_config_json = undefined;
var script_loaded = 0;
var loader_timer = undefined;
var resize_interval = undefined;
var recorder = ko.observable(undefined);

$( document ).ready(function()
{    
    if (SCORM_sco_number)//check if we are scorm
    {
        sco_number = SCORM_sco_number;
    }
    else//if not running in scorm
    {
        var config_file_name = getURLParameter('launch_config');
        var config_url = '';
        if(config_file_name.match("^testing"))
        {
            config_url = "startup/"+config_file_name+".JSON";
        }
        else
        {
            config_url = decodeURI(config_file_name);
        }
        lms_config = ajax_get_startup_config(config_url);
        lesson_config_json = ajax_get_config(lms_config.product_type, client_id, config_file, lms_config.lang);
        localize_json = ajax_get_localization(lms_config.product_type, lms_config.lang);        
        sco_number = lms_config.sco_number;        
    }
    //append product specific css here 
    helper_load_product_css(lesson_config_json.product_css);
    core_get_product_scripts();
    loader_timer=setInterval(function(){helper_is_loaded()},250);
    helper_show_loading();
});

function start_main()
{
        
    if(typeof lms_config === 'undefined')//bad url parameter or race condition
    {
        alert('There has been an error');
    }
    else
    {
        var sco_json = ajax_get_sco_json(lms_config.product_type, sco_number, lms_config.lang);        
        //get templates
        var lab_templates = product_core_get_lab_templates(sco_json);
        var framework_templates = core_get_lesson_templates(lms_config.product_type,lesson_config_json.product_templates, lesson_config_json.sidebar_templates);
        //build view model
        viewModel = new lesson_model(sco_json,lms_config,sco_number, lesson_config_json);
        //build html
        core_build_framework_html(framework_templates);
        core_build_lesson_html(lab_templates);
        //iniitate mono syytem
        ko.applyBindings(viewModel,document.getElementsByTagName('html')[0]);
        core_set_events_listeners();
        mono_core_set_event_listeners(lesson_config_json.sidebar_tools);
        product_core_start_lesson();
        helper_hide_loading();        
    }    
}
