function initiate_mono_system(sidebar_tools)
{
    
    var templates = mono_core_get_modal_templates(sidebar_tools);
    //build html block
    $('#framework_sidebar_modals').html(mono_helper_build_modal_html_block(templates));
}

function mono_core_get_modal_templates(sidebar_tools)
{
    var templates = new Array();
    var has_common = false;
    for(var i = 0; i < sidebar_tools.length; ++i)
    {
        //loops on sub items
        for(var w = 0; w < sidebar_tools[i].sub_items.length; ++w)
        {
            if(sidebar_tools[i].sub_items[w].modal_template == "common.html")
            {
                if(!has_common)
                {
                    //get common here
                    templates.push(ajax_get_mono_system_modal_template(sidebar_tools[i].sub_items[w].modal_template));
                    has_common = true;
                }              
            }
            else if (sidebar_tools[i].sub_items[w].modal_template != "")
            {
                templates.push(ajax_get_mono_system_modal_template(sidebar_tools[i].sub_items[w].modal_template));
            }            
        }
        //Check specifically for Target Words since it has no sub items to loop on
        if (sidebar_tools[i].class_name == "target_words" && !has_common)
        {
            templates.push(ajax_get_mono_system_modal_template('common.html'));
        }
        
    }
    return templates;
}

function mono_helper_build_modal_html_block(templates)
{
    var html_output = ''
    for (var i = 0; i < templates.length; ++i)
    {
        html_output += templates[i].content
    }
    return html_output;
}

var sidebar_tools_model = function(data, obj)
{
    var self = this;
    var mapping = {
        'sub_items' : {
            create: function (options) {                
                return new sidebar_tool_model(options.data, obj, data.class_name);
            }
        }
    };
    ko.mapping.fromJS(data, mapping, self);
    self.current_css = ko.computed(function(){
        var class_name = self.class_name() + '-item';
        if(obj.current_selected_toolbar_item() == self.id())
        {
            class_name += " selected";
        }
        return class_name;
    });
};

var sidebar_tool_model = function(data, obj, parent_class)
{
    var self = this;    
    ko.mapping.fromJS(data, {}, self);    
    self.current_css = ko.computed(function(){
        var class_name = parent_class + '-sub-item';
        if(obj.current_selected_sub_item() == self.id())
        {
            class_name += " selected";
        }
        return class_name;
    });
    self.get_modal_json = function(){
        if(self.modal_json() == "text_tips")
        {
            if(obj.text_tip_items().length == 0)
            {
                obj.text_tip_items(ajax_get_common_modal_json(lms_config.product_type, lesson_config_json.language, self.modal_json()));
            }
            obj.modal_common_items(obj.text_tip_items());
        }
        else if(self.modal_json() == "comprehension_tips")
        {
            if(obj.comprehension_tip_items().length == 0)
            {
                obj.comprehension_tip_items(ajax_get_common_modal_json(lms_config.product_type, lesson_config_json.language, self.modal_json()));
            }
            obj.modal_common_items(obj.comprehension_tip_items());            
        }
        else if(self.modal_json() == "irregular_verbs")
        {
            if(!obj.irregular_verbs().length)
            {
                obj.irregular_verbs(ajax_get_irregular_verbs_json(lms_config.product_type, lesson_config_json.language));
            }
        }        
        else if(self.modal_json() == "writing_tips")
        {
            if(obj.writing_tip_items().length == 0)
            {                
                obj.writing_tip_items(ajax_get_common_modal_json(lms_config.product_type, lesson_config_json.language, self.modal_json()));
            }
            obj.modal_common_items(obj.writing_tip_items());
        }
        else if(self.modal_json() == "wordlist")
        {            
            if(typeof obj.wordlist_items().Nouns === 'undefined')
            {
                obj.wordlist_items(ajax_get_wordlist_json(lms_config.product_type, lesson_config_json.language));
            }
        }
    }
    self.show_modal = function(){
        obj.clear_selected_item();
        obj.current_selected_sub_item(self.id());
        $('#'+self.modal_id()).modal();
    }    
    self.fire_event = function(){        
        //check what item is
        if( parent_class == "lab-task" )
        {
            obj.downloadLab();
        }
        else if(self.text() == "Speaking Lab")
        {
            obj.openSpeakingLab();  
        }
        else if(self.modal_id() == "my_product_tour")
        {
            obj.openProductTour();  
        }
        else if(self.modal_id() == "myDictionary")
        {
            
            //ajax for dictionary json
            if(!obj.dictionary_items().length)
            {
                var dictionary_json = ajax_get_dictionary_json(lms_config.product_type, 'eng');
                if (lms_config.lang != 'eng')
                {
                    var dictionary_localize_json = ajax_get_dictionary_json(lms_config.product_type, lms_config.lang);
                    obj.localize_titles.removeAll();
                    obj.dictionary_localize_titles = dictionary_localize_json;
                    // ko.utils.arrayMap(dictionary_localize_json, function(item) {
                        // obj.localize_titles.push(new dictionary_localize_model(item));
                    // });  
                }
                obj.dictionary_items.removeAll();
                ko.utils.arrayMap(dictionary_json, function(item) {
                    obj.dictionary_items.push(new dictionary_model(item));
                }); 
               
                obj.sorted_dictionary_items(mono_helper_load_dictionary_items(obj.dictionary_items(),obj.letterArray));               
            }            
            obj.show_dictionary();
        }
        else if(self.modal_id() == "myGrammar")
        {
            if(!obj.grammar_items().length)
            {
                var grammar_json = ajax_get_grammar_json(lms_config.product_type, lesson_config_json.language)
                obj.grammar_items.removeAll();
                ko.utils.arrayMap(grammar_json, function(item) {
                    obj.grammar_items.push(new grammar_model(item));
                });                            
            }           
            obj.show_grammar();
        }
        else
        {
            self.get_modal_json();
            self.show_modal();
        }
    }
};

function mono_sidebar_model(obj, sidebar_tools)
{
    //placeholder objects
    var dictionary_json = [];
    var dictionary_localize_json = [];
    var grammar_json = [];
    var wordlist_json = [];
    var irregular_verbs_json = [];
    var text_tips_json = [];
    var comprehension_tips_json = [];
    var writing_tips_json = [];
    var target_words_json = [];
    
    if(sidebar_tools.length)
    {
        obj.no_sidebar = ko.observable(false);
    }
    else
    {
        obj.no_sidebar = ko.observable(true);
    }
    
    initiate_mono_system(lesson_config_json.sidebar_tools);
    //obj.sidebar_tools = sidebar_tools;
        
    //-------------------------------------------------------------
    // Learning Tools - Dictionary / Grammar / Wordlist / Irregular Verbs
    //-------------------------------------------------------------
    
    //Current sidebar item that is selected.
    //-1 is nothing
    obj.current_selected_toolbar_item = ko.observable(-1);
    //Current sub item on the sidebar that is selected
    //-1 is nothing
    obj.current_selected_sub_item = ko.observable(-1);
    //The search word to filter the list of dictionary words
	obj.search_term = ko.observable("");
    obj.displayed_search_term = ko.observable("");
	//The current selected item that has been selected from the list of words
	obj.selected_item = ko.observable("");
    //The current selected grammar item that has been selected from the list
    obj.selected_grammar_item = ko.observable("");
    
	//The entire list of dictionary words
	obj.dictionary_items = ko.observableArray(ko.utils.arrayMap(dictionary_json, function(item) {
		return new dictionary_model(item);
	}));
    //console.log(obj.dictionary_items);
        //Array of letters for search bar
    obj.letterArray = ko.observableArray(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']);
    obj.sorted_dictionary_items = ko.observableArray();
    obj.sorted_dictionary_items(mono_helper_load_dictionary_items(obj.dictionary_items,obj.letterArray));
    
    obj.localize_titles = ko.observableArray(ko.utils.arrayMap(dictionary_localize_json, function(item) {
		return new dictionary_localize_model(item);
	}));
    
    obj.dictionary_localize_titles;
    obj.target_words_localize_titles;
    
	//The entire list of grammar words
	obj.grammar_items = ko.observableArray(ko.utils.arrayMap(grammar_json, function(item) {
		return new grammar_model(item);
	}));

    //The entire list of wordlist words
    obj.wordlist_items = ko.observable(wordlist_json);

    //The entire list of irregular verbs
    obj.irregular_verbs = ko.observable(irregular_verbs_json);

    //The entire list of text tips
    obj.text_tip_items = ko.observable(text_tips_json);

    //The entire list of comprehension tips
    obj.comprehension_tip_items = ko.observable(comprehension_tips_json);

    //The entire list of writing tips
    obj.writing_tip_items = ko.observable(writing_tips_json);
    
    //The entire list of target-words
    obj.target_words_items = ko.observable(target_words_json);
    
    //The curently selected item list to be used for common modal
    obj.modal_common_items = ko.observable({"title": "","content":[]});   

    //The current selected item that has been selected from the list of items using common modal
    obj.modal_common_selected_item = ko.observable("");

    //The search word to filter the list of modal common seatch items
    obj.modal_common_search_term = ko.observable("");

    //Flag for whether or not the sidebar is currently opened or not
    obj.sidebar_open = ko.observable(false);

    //Flag for whether or not the sidebar is done animating
    obj.sidebar_finished_closing = ko.observable(1);
	
    //Positions the sidebar correctly on the right side of the page. It will
    //adjust the size of the sidebar and main page accordingly when the sidebar
    //expands and collapses.
    //item = Identifier for where the function is being called from.
    obj.move_sidebar = function(item, width_override) {
        //Get the client window height
        var inner_height = window.innerHeight;
        var inner_width = window.innerWidth;
        var side_bar_right;
        var width_offset = 50;

        if(typeof width_override !== 'undefined')
        {
            width_offset = width_override;
        }
        if(window.innerWidth > 1330)
        {
            inner_width = 1330 - width_offset;//must pos sidebar
            side_bar_right = ((window.innerWidth - (inner_width + width_offset))/2) + width_offset;
        }
        else
        {
             inner_width -= width_offset;
             side_bar_right = width_offset;
        }
        //The sidebar is not open
        if (obj.sidebar_open() == false)
        {
            //The sidebar has been clicked on, so open it up
            if (item != 1)
            {
                mono_helper_set_navbar_width(inner_width - 360);
                mono_helper_animate_sidebar(0, true, (inner_width - 360));   
            }
            else //The sidebar has not been clicked on, the window is being resized
                mono_helper_set_sidebar(width_offset, side_bar_right, inner_width, (inner_width - 210));
        }
        else //The sidebar is open
        {    
            //Increase width of navbar scroll so the nav control doesn't get pushed down
            //The sidebar has been clicked on, so close it
            if(item != 1)
            {
                $(".sidebar-sub-item").animate({height: "-=25",}, 150, function() {});
                //Clear all the selected items on the sidebar
                obj.current_selected_toolbar_item(-1); //Close the item
                obj.current_selected_sub_item(-1) //Clear sub items
                
                //Move the sidebar to the left, closing it
                mono_helper_animate_sidebar(1, false, (inner_width - 210));
            }
            else //The sidebar has not been clicked on, the window is being resized
            {
                mono_helper_set_sidebar(200, side_bar_right + 150, (inner_width - 150), (inner_width - 360));
            }
        }
    }
    
    
    //Checks the search term again the words being displayed 
    //Used to set the visibility binding on each words
    //current_word = The current word in the for each binding
    obj.check_search = function(current_word) {
        //The return statement
        var ret = false;
		//Create the regular expression that matches the search_term
        var reg = RegExp("^" + obj.search_term().toLowerCase());
        
        //If the regular expression matches then the word is being searched for, make it visible
        if (reg.test(current_word.toLowerCase()))
            ret = true;
            
        return ret;
    };
	
	//The item that has been selected and displayed on the page.
	obj.set_selected_item = function(item) {
        
        obj.displayed_search_term('');
        //Check to see if the item is the same as the current search term
        //If they are the same, then the user has clicked on the same item
        if (item == obj.search_term())
            obj.search_term(''); //Close the current item
        else
            obj.search_term(item); //Set the search term to the item that was clicked on
        
        //Scroll the bar for the word list
        mono_helper_adjust_dictionary_scroll(obj.search_term().toUpperCase());
        
	};
    
    //The item that has been selected in the grammar list
    obj.set_selected_grammar_item = function(item) {
        obj.selected_grammar_item(item);
    }
    
    //Called when typing in the search box. Makes sure that the scroll bar
    //on the word list scrolls properly.
    obj.set_auto_search = function() {
        obj.search_term(obj.displayed_search_term().toUpperCase());
        //Pass in the first letter on the search term
        mono_helper_adjust_dictionary_scroll(obj.search_term().charAt(0).toUpperCase());
    }

	//Clears the currently selected item and clears the search string.
	//Resets the entire dictionary to it's default state.
	obj.clear_selected_item = function() {
		//Clear the current item
        obj.selected_item("");
        //Clear the current grammar item
        obj.selected_grammar_item("");
        //Clear search term
		obj.search_term("");
	};
    
    //Set the word to be displayed in the content area
    obj.set_selected_word = function(item) {
        //alert(obj.grammar_items.indexOf(item);
        obj.selected_item(item);
    }
    
    //Set the irregular verb to be displayed in the content area
    obj.modal_common_set_selected_item = function(item) {
        obj.modal_common_selected_item(item);
    }

	//Sets the opened toolbar item to display the sub items
	obj.set_selected_toolbar_item = function(item) {
        // check if item is speaking lab, if so open it
        if(!(obj.sidebar_tools[item].sub_items().length) && obj.sidebar_tools[item].text() == "Speaking Lab")
        {
            obj.openSpeakingLab();
        }
        else if(!(obj.sidebar_tools[item].sub_items().length) && obj.sidebar_tools[item].class_name() == "target_words")
        {
            obj.openTargetWords();
        }
        else{
    		//Check to see if the toolbar item is already opened
    		if (obj.current_selected_toolbar_item() == item)
            {
                //Slowly close the sub items. Clear the selected variables after the animated finishes
                $(".sidebar-sub-item").animate({height: "-=25",}, 150, function() {
                    obj.current_selected_toolbar_item(-1); //Close the item
                    obj.current_selected_sub_item(-1) //Clear sub items
                });
            }
    		else //Open the item
            {
                //Set the current toolbar item
    			obj.current_selected_toolbar_item(item);
                //Make sure the other open items get closed first, 0 for no animation and happens instantly
                $(".sidebar-sub-item").animate({height: "-=25",}, 0, function() {});
                //Animate the item open
                $(".sidebar-sub-item").animate({height: "+=25",}, 150, function() {});
                //If the sidebar is currently closed then open it
                if (!obj.sidebar_open())
                    obj.move_sidebar();
            }
        }
	}
    
    //Download the specific lab document for the current lessson
    obj.downloadLab = function()
    {   

        //Get the name of the lesson so we know which task to download
        var unit_name = lms_config.unit_name
        if(unit_name == "Robotics & Medicine"){
            unit_name = "Life Sciences and Robotics";
        }
        else if(unit_name == "Genetic Engineering"){
            unit_name = "Genetics";
        }
        var file_name = lesson_config_json.lab_task_names[unit_name];
        
        //Download the file
        if(viewModel.lesson_type == "scholar")
            window.open("assets/"+viewModel.lesson_type+"/labtasks/labtask_"+lms_config.sco_number+".pdf");
        else
            window.open("assets/"+viewModel.lesson_type+"/labtasks/"+file_name+".pdf");
        
        if (obj.sidebar_open())
            obj.move_sidebar();
    }

    //Open the specific speaking lab for the current Lesson
    obj.openSpeakingLab = function()
    {
        //Open speaking lab in new window
        window.open("http://thestudio.ell4all.com/?toolID=5&entryID=&filterName="+lms_config.unit_name.replace(/&/g,"and"));
        if (obj.sidebar_open())
            obj.move_sidebar();
    }
    
    //Open the specific speaking lab for the current Lesson
    obj.openTargetWords = function()
    {
        //If the list is empty, then ajax for the word list
        if(obj.target_words_items().length == 0)
        {
            obj.target_words_items(ajax_get_target_words_json(lms_config.product_type, lms_config.sco_number, 'eng'));
            
            //Get the localize files for the non english languages
            if (lms_config.lang != 'eng')
            {
                //Ajax for the content
                obj.target_words_localize_titles = ajax_get_target_words_json(lms_config.product_type, lms_config.sco_number, lms_config.lang);
                
                //Loop through each target word
                for(var i = 0; i < obj.target_words_items().content.length; ++i)
                {
                    //Loop through each localized word
                    for(var j = 0; j < obj.target_words_localize_titles.content.length; ++j)
                    {
                        //Check to see if there is a match (Since some words are not localized, can't go by index)
                        if (obj.target_words_items().content[i].id == obj.target_words_localize_titles.content[j].id)
                        {
                            //Create the local string to display
                            obj.target_words_items().content[i].local = " - " + obj.target_words_localize_titles.content[j].title
                        }
                    }
                }
            }
        }
        //Set the items
        obj.modal_common_items(obj.target_words_items());
        
        obj.modal_common_selected_item("");
        
        //Show the modal
        obj.show_modal('Target Words', 'CommonModal');
    }
    
    obj.openProductTour = function()
    {
        //Open speaking lab in new window
        window.open("http://tour.ellcampus.com/?lang="+lms_config.lang);
        if (obj.sidebar_open())
            obj.move_sidebar();
    }
    
    obj.get_dictionary_localize_title = function(id)
    {
        if (lms_config.lang != 'eng')
        {
            ret = " - "

            for (var i = 0; i < obj.dictionary_localize_titles.length; ++i)
            {
                if (obj.dictionary_localize_titles[i]["id"] == String(id))
                {
                    ret += obj.dictionary_localize_titles[i]["title"];
                    break;
                }
            }
            
            return ret;
        }
        else
            return "";
    }

    //-------------------------------------------------------------
    // End of Learning Tools - Dictionary / Grammar / Wordlist / Irregular Verbs
    //-------------------------------------------------------------
    
    //Open dictionary modal on sidebar
    obj.show_dictionary = function(){
		obj.clear_selected_item();
        obj.current_selected_sub_item(0);
        $('#myDictionary').modal()
    }
    //Open grammar modal on sidebar
	obj.show_grammar = function(){
        //Clear all previous items in the modal
		obj.clear_selected_item();
        obj.current_selected_sub_item(1);
        $('#myGrammar').modal()
    }
    obj.show_modal = function(item, title){
        obj.clear_selected_item();
        obj.current_selected_sub_item(item);
        $('#my'+title).modal();
    }
    
    //do here for now ensure all data is visible
    obj.sidebar_tools = ko.utils.arrayMap(sidebar_tools, function(item) {
		return new sidebar_tools_model(item, obj);
	});
};

/*
===========================Product Core Functions============================
*/
function mono_core_set_event_listeners(sidebar_tools)
{
    for(var i = 0; i < sidebar_tools.length; ++i)
    {
        //loops on sub items
        for(var w = 0; w < sidebar_tools[i].sub_items.length; ++w)
        {
            $('#'+sidebar_tools[i].sub_items[w].modal_id).on('hidden.bs.modal', function () {
                viewModel.current_selected_sub_item(-1); //Clear sub items
                viewModel.modal_common_selected_item(""); //Clear selected verb
                viewModel.modal_common_search_term(""); //Clear search box                
                viewModel.displayed_search_term(""); //Clear search box                
            });
        }
    }
}


/*
===========================Product Helper Functions============================
*/
//Adjusts the scrollbar on the word list in the dictionary modal. It will
//position the scrollbar to always be at the top of a newly loaded list of
//words.
//letter = The letter that was clicked on
function mono_helper_adjust_dictionary_scroll(letter)
{
    //Set the scrollbar position to the current letters position
    //35 is a random number to give it some space above the letter
    if ($('#' + letter)[0] != undefined)
        $('.wordList').scrollTop( $('#' + letter)[0].offsetParent.offsetTop - 35);
}


//Animates the sidebar when it is opened or closed.
//dir = The direction the sidebar is moving. 0 = opening, 1 = closing
//open = Set the status of the sidebar
function mono_helper_animate_sidebar(dir, open, nav_width)
{
    viewModel.sidebar_open(open);
    //jQuery animate to slowly move the main page over
    $(".main").animate({width: (dir == 0 ? "-" : "+") +"=150",}, 300, function() {
        mono_helper_set_navbar_width(nav_width);
        
        //Used for displaying the sidebar item name
        if (dir == 1)
            viewModel.sidebar_finished_closing(1);
        else
            viewModel.sidebar_finished_closing(0);
    });
    //jQuery animate to slowly open the sidebar
    $(".framework_sidebar").animate({width: (dir == 0 ? "+" : "-") + "=150",}, 300, function() {
        product_helper_update_container_height();
    });
}

//Sets the position of the sidebar and the main page on a high resolution.
//width = width of sidebar
//right = right position of sidebar
//max_width = maximum width of main
//nav_width the nav bar width
function mono_helper_set_sidebar(width, right, max_width,nav_width)
{
    var margin_right = right;
    if(right > width)
    {
        margin_right = width;
    }
    $('.framework_sidebar').attr('style', 'width: '+ width +'px; right:'+ right +'px; margin-right:-'+ margin_right +'px;');
    $('.page_wrapper').attr('style', 'padding-right:'+ width +'px;');
    mono_helper_set_navbar_width(nav_width);
    if(lms_config.product_type !== "sena"){
        $('.main').attr('style', 'width: ' + max_width + 'px;');
    }
}

//Sets the width of the nav bar at the bottom. Takes the old css
//style and replaces the width in it.
//nav_width = width of the nav bar
function mono_helper_set_navbar_width(nav_width)
{
    if (typeof nav_width !== "undefined")
    {
        //Find the width out of the style of the scrollbar
        var reg = RegExp("^" + "width: [0-9]*px;");
        //Get the all the styles applied to the scrollbar
        var t = $('.nav-scrollbar').attr('style');        
        var res;
        //Check to see if the styles have been applied yet
        //Only undefined on startup
        if(typeof t !== 'undefined')
        {
            //Get the width
            try
            {
                res = reg.exec(t).toString();
            }
            catch(err)
            {
                t = 'width: 0px; padding-right: 0px; outline: none; height: 40px; padding-bottom: 10px; overflow: hidden; ';
                res =  reg.exec(t).toString();
            }
            
            if (nav_width < 100)
                nav_width = 100;
                
            //Replace the old styles with the new one and replace the width
            $('.nav-scrollbar').attr('style',t.replace(res, ('width: '+ nav_width +'px;')));
        }
        else //On startup there is no style to replace, so just apply the width
            $('.nav-scrollbar').attr('style','width: '+ nav_width +'px;');
           
    }
}

//Gets the sub-title of the grammar name without any html tags.
//name = name object from grammar json
function mono_helper_get_grammar_title(name)
{
    //Attempts to find any words between the span tags of entry-item
    var ret = name.match("<br />&nbsp;&nbsp;&nbsp;(.*)");
    
    //If the object is null then nothing was found, return empty 
    if (ret == null)
        ret = "";
    else //A title was found
        ret = ret[1];
     
    //Return the title
    return ret;
}

//Gets the name of the grammar item without any html tags included.
//Will get the initial name without the sub-title.
//name = name object from grammar json
function mono_helper_get_grammar_name(name)
{
    //Get the string before the first html tag
    var ret = name.substr(0, name.indexOf('<'));
    
    //If the string is empty that means there were no html tags included
    if (ret == "")
        ret = name;
    
    //Returned the name
    return ret;
}

//Load the dictionary items into separate arrays.
//dictionary_items = The total list of dictionary words
//letterArray = The array of letters being displayed in the dictionary
function mono_helper_load_dictionary_items(dictionary_items,letterArray)
{
    //Array of sorted items to be returned
    var sorted_dictionary_items = new Array();
    
    //Loop through each letter
    for(var k = 0; k < letterArray().length; ++k)
    {
        var wordArray = new Array();
        //Loop through all of the dictionary items
        for(var i = 0; i < dictionary_items.length; ++i)
        {
            //Check the current letter against the first letter of the current dictionary item
            if (letterArray()[k].toLowerCase() == dictionary_items[i].item().charAt(0).toLowerCase())
                wordArray.push(dictionary_items[i]); //Add the item to the array if they match
        }
        
        //Create a new array to hold the group of letters
        sorted_dictionary_items.push ({
            wordLetter: letterArray()[k],
            words: wordArray
        });
    }
    
    //Return all the arrays
    return sorted_dictionary_items;
}

//Prints the current dictionary item that is open.
//Only gets the word title and definition/examples.
function mono_helper_print_dictionary()
{
    var w = window.open();
    w.document.write($('.word-title').html() + '<hr/><br/> ' + $('.word-content').html());

    var res;
    
    //Check if the user is using Chrome and find the version they are running.
    //There is a bug in chrome in versions below 36 with closing the printing tab
    //without cancelling.
    if (navigator.userAgent.search("Chrome") != -1)
        res = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
    else //Set to 36 if not on chrome since all the other browsers are fine
        res = 36;
    
    //Alert the user when they try to close the tab on chrome
    if (res < 36) {
        w.PPClose = false;     
        w.onbeforeunload = function(){                         
        if(w.PPClose === false){                          
            return 'Leaving this page will block the parent window!\nPlease select "Stay on this Page option" and use the\nCancel button instead to close the Print Preview Window.\n';
        }
    }        
        w.print(); 
        w.PPClose = true;         
        w.close();
    }
    else //Called for every other browser except chrome
    {
        //IE requires document.close() a focus()
        w.document.close();
        w.focus();
        w.print();               
        w.close();
    }
};

function mono_create_sidebar_items()
{
    //Set initial position for sub item. Breaks without this
    $(".sidebar-sub-item").animate({height: "-=50",}, 300, function() {});
};