/*
    scorm_local_api.js

    Minimal SCORM 2004 runtime (API_1484_11) backed by localStorage.
    Lets the lesson run outside an LMS (e.g. GitHub Pages) while keeping the
    course's normal SCORM code path: progress (cmi.suspend_data), objectives,
    score and completion are saved in the learner's browser.

    - If a real LMS API is found in a parent/opener window, this file does nothing.
    - Add ?reset=1 to the URL to erase the saved progress for this lesson.
*/
(function(){
    // Launch data normally provided by the LMS from imsmanifest.xml (adlcp:dataFromLMS)
    var LAUNCH_DATA = {
        "product_type": "sena_esp8",
        "course_name": "",
        "unit_name": "English",
        "level_name": "SENA",
        "client_config": "default",
        "client_id": 1,
        "lang": "eng",
        "sco_number": "64022",
        "exit_url": "index.html"
    };
    // Objective ids declared in imsmanifest.xml; the course expects them to exist
    var OBJECTIVE_IDS = ["primary", "secondary_1", "secondary_2"];

    // One key per published lesson folder, so several lessons on the same site don't collide
    var STORAGE_KEY = "sena_scorm:" + window.location.pathname.replace(/[^\/]*$/, "") + ":" + LAUNCH_DATA.sco_number;

    function findLmsApi(win){
        try{
            var tries = 0;
            while(win && tries < 50){
                if(win.API_1484_11){ return win.API_1484_11; }
                if(!win.parent || win.parent === win){ break; }
                win = win.parent;
                tries++;
            }
        }
        catch(err){ /* cross-origin frame: no LMS reachable */ }
        return null;
    }

    if(findLmsApi(window) || (window.opener && findLmsApi(window.opener))){
        return; // running inside a real LMS
    }

    var storage = null;
    try{
        storage = window.localStorage;
        storage.setItem(STORAGE_KEY + ":test", "1");
        storage.removeItem(STORAGE_KEY + ":test");
    }
    catch(err){
        storage = null; // storage blocked: progress lives only for this page view
    }

    if(storage && /[?&]reset=1(&|$)/.test(window.location.search)){
        storage.removeItem(STORAGE_KEY);
    }

    // Elements that are not kept between sessions
    var NOT_PERSISTED = /^cmi\.(interactions\.|session_time$|exit$|entry$|launch_data$|mode$|learner_)/;

    var data = {};
    var lastError = "0";
    var ERRORS = {
        "0": "No Error",
        "101": "General Exception",
        "201": "General Argument Error",
        "351": "General Set Failure",
        "401": "Undefined Data Model Element"
    };

    function load(){
        if(!storage){ return {}; }
        try{
            return JSON.parse(storage.getItem(STORAGE_KEY)) || {};
        }
        catch(err){
            return {};
        }
    }

    function save(){
        if(!storage){ return; }
        var out = {};
        for(var key in data){
            if(data.hasOwnProperty(key) && !NOT_PERSISTED.test(key)){
                out[key] = data[key];
            }
        }
        try{
            storage.setItem(STORAGE_KEY, JSON.stringify(out));
        }
        catch(err){
            lastError = "351";
        }
    }

    // Number of entries in a collection such as cmi.objectives or cmi.interactions
    function collectionCount(prefix){
        var count = 0;
        while(data.hasOwnProperty(prefix + "." + count + ".id")){
            count++;
        }
        return count;
    }

    function init(){
        data = load();
        data["cmi.entry"] = data["cmi.suspend_data"] ? "resume" : "ab-initio";
        data["cmi.mode"] = "normal";
        data["cmi.credit"] = "credit";
        data["cmi.learner_id"] = "local";
        data["cmi.learner_name"] = "Learner";
        data["cmi.launch_data"] = JSON.stringify(LAUNCH_DATA);
        if(!data["cmi.completion_status"]){ data["cmi.completion_status"] = "unknown"; }
        if(!data["cmi.success_status"]){ data["cmi.success_status"] = "unknown"; }
        for(var i = 0; i < OBJECTIVE_IDS.length; ++i){
            data["cmi.objectives." + i + ".id"] = OBJECTIVE_IDS[i];
        }
    }

    window.API_1484_11 = {
        Initialize: function(){
            init();
            lastError = "0";
            return "true";
        },
        Terminate: function(){
            save();
            lastError = "0";
            return "true";
        },
        Commit: function(){
            save();
            lastError = "0";
            return "true";
        },
        GetValue: function(name){
            lastError = "0";
            name = String(name);
            var countMatch = name.match(/^(cmi\.(objectives|interactions))\._count$/);
            if(countMatch){
                return String(collectionCount(countMatch[1]));
            }
            return data.hasOwnProperty(name) ? data[name] : "";
        },
        SetValue: function(name, value){
            lastError = "0";
            name = String(name);
            var collection = name.match(/^(cmi\.(objectives|interactions))\.(\d+)\./);
            if(collection && parseInt(collection[3], 10) > collectionCount(collection[1])){
                lastError = "351"; // SCORM only allows appending at index _count
                return "false";
            }
            data[name] = (value === null || typeof value === "undefined") ? "" : String(value);
            if(!NOT_PERSISTED.test(name)){
                save();
            }
            return "true";
        },
        GetLastError: function(){
            return lastError;
        },
        GetErrorString: function(code){
            return ERRORS[String(code)] || "";
        },
        GetDiagnostic: function(code){
            return ERRORS[String(code || lastError)] || "";
        }
    };

    // Save the current state when the learner closes or leaves the page
    window.addEventListener("pagehide", function(){
        try{
            if(window.viewModel && viewModel.loaded && viewModel.loaded() && !viewModel.restoring_progress()){
                viewModel.get_progress();
            }
        }
        catch(err){ /* lesson not ready */ }
        save();
    });
})();
