//dragdrop objects
var drag_drop_config = function (response_container_type, starting_positions_type, drop_type, double_drop_type, drag_item_adjust_type, state_calc_type, revert_type)
{
    var self = this;
    self.response_container_type = ko.observable(response_container_type);
    self.starting_position_type = ko.observable(starting_positions_type);
    self.drop_type = ko.observable(drop_type);
    self.double_drop_type = ko.observable(double_drop_type);
    self.drag_item_adjust_type = ko.observable(drag_item_adjust_type);
    self.state_calc_type = ko.observable(state_calc_type);
    self.revert_type = ko.observable(revert_type);
}

var response_container_obj = function ()
{
    var self = this;
    self.width = ko.observable();
    self.height = ko.observable();
}


function initiate_response_container(obj)
{
    if(obj.drag_drop_config().response_container_type() == 1)
    {   
        var widest_item = 0;
        var item_height = 0;
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(widest_item < obj.pep_objs()[i].pep()[0].clientWidth)
            {
                widest_item = obj.pep_objs()[i].pep()[0].clientWidth;
                item_height = obj.pep_objs()[i].pep()[0].clientHeight + 10;
            }
            //$.pep.peps[obj.pep_objs()[i].pep_idx].options.shouldEase = true;
            $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(35,((i*(obj.pep_objs()[i].pep()[0].clientHeight+10))+20));                     
        }
        obj.response_container().height((obj.pep_objs().length*item_height)+30);
        obj.response_container().width(widest_item+40);        
    }
    else if(obj.drag_drop_config().response_container_type() == 2)
    {
        //get width of exercises
        var response_container = undefined;
        for (var i = 0, len = $('.exercises').length; i < len; ++i)
        {   
            var tmp_response_container = $('.exercises')[i];
            if(tmp_response_container.offsetParent !== null)//is visible
            {                    
                response_container = tmp_response_container;
            }
        }
        var widest_item = 0;
        var heightOffsets = [20];
        var widthOffset = 20;
        var item_row_count = 0;
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(widthOffset,heightOffsets[item_row_count]);
            if(widest_item < obj.pep_objs()[i].pep()[0].clientWidth)
            {
                widest_item = obj.pep_objs()[i].pep()[0].clientWidth;
            }
            if((widthOffset + widest_item) + obj.pep_objs()[i].pep()[0].clientWidth < response_container.clientWidth)
            {
                widthOffset += obj.pep_objs()[i].pep()[0].clientWidth+10;
                heightOffsets[item_row_count] += obj.pep_objs()[i].pep()[0].clientHeight+10;
                ++item_row_count;
                if( typeof heightOffsets[item_row_count] === 'undefined' )
                {
                    heightOffsets[item_row_count] = 20;
                }
            }
            else
            {
                widthOffset = 20;
                heightOffsets[item_row_count] += obj.pep_objs()[i].pep()[0].clientHeight+10;                      
                item_row_count = 0;                        
            }
        }
        obj.response_container().height((response_container.clientHeight * 0.25));
        obj.response_container().width(response_container.clientWidth-40);        
    }
    else if(obj.drag_drop_config().response_container_type() == 3)
    {
        var $drop_container = $('.drop-target');
        var tmp_count = 0;
        for(var i = 0, len = $drop_container.length; i < len; ++i)
        {           
            //$.pep.peps[obj.pep_objs()[i].pep_idx].options.shouldEase = true;
            if($drop_container[i].offsetParent !== null)//is visible
            {                
                var tmp_item = $.pep.peps[obj.pep_objs()[tmp_count].pep_idx].$el.detach();
                $($drop_container[i]).append(tmp_item);
                obj.pep_objs()[tmp_count].drop_region($($drop_container[i]));
                //obj.pep_objs()[tmp_count].dropped(true);
                obj.pep_objs()[tmp_count].previous_drop_region($($drop_container[i]));
                $.pep.peps[obj.pep_objs()[tmp_count].pep_idx].moveTo(obj.pep_objs()[tmp_count].drop_region()[0].offsetLeft,obj.pep_objs()[tmp_count].drop_region()[0].offsetTop);
                $.pep.peps[obj.pep_objs()[tmp_count].pep_idx].activeDropRegions = $($drop_container[i]);
                ++tmp_count;
                
            }
        }
        obj.response_container().height((obj.pep_objs().length*item_height)+30);
        obj.response_container().width(widest_item+40);        
        adjust_drag_item_positions(obj);
    }    
}

function handle_drag_start(obj, pep_obj, ev, drag_obj)
{
    if(obj.drag_drop_config().starting_position_type() == 1)
    {
        
    }
    else if(obj.drag_drop_config().starting_position_type() == 2)
    {
            var drop = drag_obj.$el.detach();           
            $('body').append(drop);
            drag_obj.moveTo(ev.pep.x-10, ev.pep.y-10);
    }
    else if(obj.drag_drop_config().starting_position_type() == 3)
    {
        
    }
}

function handle_drag_event(obj, pep_obj, ev, drag_obj)
{
    if(obj.drag_drop_config().starting_position_type() == 1)
    {
        
    }
    else if(obj.drag_drop_config().starting_position_type() == 2)
    {
            if(drag_obj.$el[0].parentElement.nodeName != 'BODY')
            {
                var drop = drag_obj.$el.detach();           
                $('body').append(drop);            
                drag_obj.moveTo(ev.pep.x-1, ev.pep.y-1);
                alert('this is bad');
            }
    }
    else if(obj.drag_drop_config().starting_position_type() == 3)
    {
        
    }
    handleAutoScroll(ev, drag_obj);
}

function revert_drag_item(obj, pep_idx, exe_obj)
{
    //$.pep.peps[pep_idx].revert();
    adjust_response_container(obj)
}

function adjust_response_container(obj)
{
    if(obj.drag_drop_config().response_container_type() == 1)
    {   
        var tmp_count = 0;
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(!obj.pep_objs()[i].dropped())
            {                
                $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(35,((tmp_count*(obj.pep_objs()[i].pep()[0].clientHeight+10))+20));
                ++tmp_count;
            }
        }
    }
    else if(obj.drag_drop_config().response_container_type() == 2)
    {
        var response_container = undefined;
        for (var i = 0, len = $('.exercises').length; i < len; ++i)
        {   
            var tmp_response_container = $('.exercises')[i];
            if(tmp_response_container.offsetParent !== null)//is visible
            {                    
                response_container = tmp_response_container;
            }
        }
        var widest_item = 0;
        var heightOffsets = [20];
        var widthOffset = 20;
        var item_row_count = 0;
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(!obj.pep_objs()[i].dropped())
            {
                $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(widthOffset,heightOffsets[item_row_count]);
                if(widest_item < obj.pep_objs()[i].pep()[0].clientWidth)
                {
                    widest_item = obj.pep_objs()[i].pep()[0].clientWidth;
                }
                if((widthOffset + widest_item) + obj.pep_objs()[i].pep()[0].clientWidth < response_container.clientWidth)
                {
                    widthOffset += obj.pep_objs()[i].pep()[0].clientWidth+10;
                    heightOffsets[item_row_count] += obj.pep_objs()[i].pep()[0].clientHeight+10;
                    ++item_row_count;
                    if( typeof heightOffsets[item_row_count] === 'undefined' )
                    {
                        heightOffsets[item_row_count] = 20;
                    }
                }
                else
                {
                    widthOffset = 20;
                    heightOffsets[item_row_count] += obj.pep_objs()[i].pep()[0].clientHeight+10;                      
                    item_row_count = 0;                        
                }
            }
        }
        
    }
    else if(obj.drag_drop_config().response_container_type() == 3)
    {
        
    }    
}

function handle_drop(obj, pep_obj)
{
    if(obj.drag_drop_config().drop_type() == 1)
    {
        pep_obj.pep().addClass('dropped');
        attach_drag_item_to_drop_container(pep_obj);
    }
    else if(obj.drag_drop_config().drop_type() == 2)
    {
        pep_obj.pep().addClass('dropped');
        attach_drag_item_to_drop_container(pep_obj);
    }
    else if(obj.drag_drop_config().double_drop_type() == 3)
    {
        
    }    
}

function handle_revert(obj, pep_obj)
{
    if(obj.drag_drop_config().revert_type() == 1)
    {
        if(pep_obj.dropped())
        {
            pep_obj.pep().removeClass('dropped');
            pep_obj.drop_region().attr('style','');
            pep_obj.dropped(false);
            pep_obj.drop_region(-1);            
        }
        for (var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {            
            if(pep_obj.pep_idx == obj.pep_objs()[i].pep_idx)
            {
                //detach_drag_item_from_drop_container(pep_obj, $.pep.peps[obj.pep_objs()[i].pep_idx]);
                return_item_to_response_container(obj.pep_objs()[i]);
            }            
        }
    }
    else if(obj.drag_drop_config().revert_type() == 2)
    {
        attach_drag_item_to_drop_container(pep_obj);
        if(pep_obj.dropped())
        {
            pep_obj.pep().removeClass('dropped');
            pep_obj.drop_region().attr('style','');
            pep_obj.dropped(false);
        }
    }
    else if(obj.drag_drop_config().revert_type() == 3)
    {
        for (var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                if(pep_obj.pep_idx == obj.pep_objs()[i].pep_idx)
                {
                    //detach_drag_item_from_drop_container(pep_obj, $.pep.peps[obj.pep_objs()[i].pep_idx]);
                    return_item_to_response_container(obj.pep_objs()[i]);
                }
            }
        }
    }
}

function attach_drag_item_to_drop_container(pep_obj)
{
    var tmp_item = $.pep.peps[pep_obj.pep_idx].$el.detach();
    pep_obj.drop_region().append(tmp_item);
    //pep_obj.drop_region().attr('style', 'width:'+(tmp_item[0].clientWidth+2)+'px;height:'+(tmp_item[0].clientHeight+2)+'px;');    
    $.pep.peps[pep_obj.pep_idx].velocityQueue = [];
    $.pep.peps[pep_obj.pep_idx].moveTo(pep_obj.drop_region()[0].offsetLeft,pep_obj.drop_region()[0].offsetTop);       
}

function detach_drag_item_from_drop_container(obj, pep_obj)
{
    pep_obj.drop_region().attr('style','');
    for (var i = 0, len = obj.pep_objs().length; i < len; ++i)
    {
        if(obj.pep_objs()[i].dropped())
        {
            if(pep_obj.pep_idx == obj.pep_objs()[i].pep_idx)
            {
                //detach_drag_item_from_drop_container(pep_obj, $.pep.peps[obj.pep_objs()[i].pep_idx]);
                return_item_to_response_container(obj.pep_objs()[i]);
            }
        }
    }
    //return_item_to_response_container(obj.pep_objs()[pep_obj.pep_idx]);
    // pep_obj.dropped(false);
    // for (var i = 0, len = $('#response_container').length; i < len; ++i)
    // {   
        // var response_container = $('#response_container')[i];
        // if(response_container.offsetParent !== null)//is visible
        // {                    
            // $(response_container).append(tmp_item);            
            // drag_obj.moveTo(pep_obj.offset_x(),pep_obj.offset_y());
        // }
    // }
    
}

function handle_double_drop(obj, pep_obj)
{
    if(obj.drag_drop_config().double_drop_type() == 1)
    {
        for (var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                if(pep_obj.drop_region()[0].id == obj.pep_objs()[i].drop_region()[0].id && pep_obj.pep_idx != obj.pep_objs()[i].pep_idx)
                {
                    //detach_drag_item_from_drop_container(pep_obj, $.pep.peps[obj.pep_objs()[i].pep_idx]);
                    return_item_to_response_container(obj.pep_objs()[i]);
                }
            }
        }
    }
    else if(obj.drag_drop_config().double_drop_type() == 2)
    {
        for (var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {            
            //console.log('previous ' + obj.pep_objs()[i].previous_drop_region()[0].id + 'obj ped idx ' + obj.pep_objs()[i].pep_idx + ' dragged ' +pep_obj.previous_drop_region()[0].id);
            if(pep_obj.drop_region()[0].id == obj.pep_objs()[i].drop_region()[0].id && obj.pep_objs()[i].previous_drop_region()[0].id == obj.pep_objs()[i].drop_region()[0].id)
            {                
                //console.log(pep_obj.previous_drop_region()[0].id);
                var tmp_item = $.pep.peps[obj.pep_objs()[i].pep_idx].$el.detach();
                if(obj.progress_restore() === false)
                {
                    obj.pep_objs()[i].dropped(true);
                    obj.pep_objs()[i].pep().addClass('dropped');
                }                
                obj.pep_objs()[i].drop_region(pep_obj.previous_drop_region());
                obj.pep_objs()[i].previous_drop_region(pep_obj.previous_drop_region());
                $(pep_obj.previous_drop_region()).append(tmp_item); 
                pep_obj.previous_drop_region(pep_obj.drop_region());
                //console.log(obj.pep_objs()[i].previous_drop_region()[0].id);
                
            }            
        }
    }
    else if(obj.drag_drop_config().double_drop_type() == 3)
    {
        
    }
}

//accepts a pep obj from viewmodel
function return_item_to_response_container(pep_obj)
{
    // $.pep.peps[pep_obj.pep_idx].options.shouldEase = true;
    var tmp_item = $.pep.peps[pep_obj.pep_idx].$el.detach();
    
    for (var i = 0, len = $('.response_container').length; i < len; ++i)
    {   
        var response_container = $('.response_container')[i];        
        if(response_container.offsetLeft > 0)//is visible
        {                    
            $(response_container).append(tmp_item);             
            $.pep.peps[pep_obj.pep_idx].moveTo(pep_obj.offset_x(),pep_obj.offset_y());
        }
    }
    if(pep_obj.dropped())
    {
        pep_obj.drop_region().attr('style','');
    }
    pep_obj.dropped(false);
    pep_obj.pep().removeClass('dropped');
    pep_obj.drop_region(-1);
    
}

function calculate_drag_drop_state(obj, exercise_obj)
{
    //set all questions to -1 state
    
    //update state for droppped objects
    if(obj.drag_drop_config().state_calc_type() == 1)
    {
        for (var i = 0, len = exercise_obj.questions().length; i < len; ++i)
        {
            exercise_obj.questions()[i].select_response(ko.observable(-1));
        }
        for (var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                var question_num = obj.pep_objs()[i].drop_region()[0].id
                if(obj.pep_objs()[i].drop_region()[0].id == obj.pep_objs()[i].correct_drop_region())
                {                    
                    exercise_obj.questions()[question_num].select_response(ko.observable(1));
                }
                else
                {
                    exercise_obj.questions()[question_num].select_response(ko.observable(0));
                }
            }            
        }
    }
    else if(obj.drag_drop_config().state_calc_type() == 2)
    {
        for (var i = 0, len = exercise_obj.questions().length; i < len; ++i)
        {
            for (var w = 0, tmp_len = exercise_obj.questions()[i].responses().length; w < tmp_len; ++w)
            {
                exercise_obj.questions()[i].responses()[w].selected(0);
            }
            //exercise_obj.questions()[i].select_response(ko.observable(-1));
        }
        for (var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                var question_num = obj.pep_objs()[i].drop_region()[0].id
                if(obj.pep_objs()[i].drop_region()[0].id == obj.pep_objs()[i].correct_drop_region())
                {                    
                    exercise_obj.questions()[question_num].responses()[obj.pep_objs()[i].response_num()].selected(1);
                }
                else
                {
                    exercise_obj.questions()[question_num].responses()[0].selected(1);
                }
            }            
        }
    }
}

function adjust_drag_item_positions(obj)
{
    if(obj.drag_drop_config().drag_item_adjust_type() == 1)
    {   
        var tmp_count = 0;
        //double pass first loop sizes all containers second positions items
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                // $.pep.peps[obj.pep_objs()[i].pep_idx].options.shouldEase = false;
                obj.pep_objs()[i].drop_region().attr('style', 'width:'+($.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientWidth+2)+'px;height:'+($.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientHeight+2)+'px;');                
                ++tmp_count;
            }
        }
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                // $.pep.peps[obj.pep_objs()[i].pep_idx].options.shouldEase = false;                
                $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(obj.pep_objs()[i].drop_region()[0].offsetLeft,obj.pep_objs()[i].drop_region()[0].offsetTop);
                ++tmp_count;
            }
        }
    }
    else if(obj.drag_drop_config().drag_item_adjust_type() == 2)
    {
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            
                obj.pep_objs()[i].drop_region().attr('style', 'width:'+($.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientWidth+2)+'px;height:'+($.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientHeight+2)+'px;');
                //$('.MT1-question_'+ex_num+'_'+obj.activeDropRegions[0][0].id+'_'+lab_num).attr('style', 'height:'+(drop[0].clientHeight+2)+'px;');
            
        }
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(obj.pep_objs()[i].drop_region()[0].offsetLeft,obj.pep_objs()[i].drop_region()[0].offsetTop);
            }
        }
        
    }
    else if(obj.drag_drop_config().drag_item_adjust_type() == 3)
    {
        var drop_region_heights = [0,0];        
        var dropped_item_positions = [];
        for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
        {
            if(obj.pep_objs()[i].dropped())
            {
                if(obj.pep_objs()[i].drop_region()[0].id == 0)
                {
                    drop_region_heights[0] += obj.pep_objs()[i].pep()[0].clientHeight+10;
                }
                else if(obj.pep_objs()[i].drop_region()[0].id == 1)
                {
                    drop_region_heights[1] += obj.pep_objs()[i].pep()[0].clientHeight+10;
                }                
                //$('.MT1-question_'+ex_num+'_'+obj.activeDropRegions[0][0].id+'_'+lab_num).attr('style', 'height:'+(drop[0].clientHeight+2)+'px;');
            }
        }
        for(var w = 0, len = drop_region_heights.length; w < len; ++w)
        {
            var heightOffset = 30;
            for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
            {
                if(obj.pep_objs()[i].dropped())
                {
                    if(obj.pep_objs()[i].drop_region()[0].id == 0)
                    {
                        //drop_region_heights[0] += obj.pep_objs()[i].pep()[0].clientHeight+10;
                        obj.pep_objs()[i].drop_region().attr('style', 'width:'+($.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientWidth+2)+'px;height:'+drop_region_heights[0]+'px;');
                        $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(15,heightOffset);
                        heightOffset += $.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientHeight+10;
                    }                    
                }
            }
            var heightOffset = 30;
            for(var i = 0, len = obj.pep_objs().length; i < len; ++i)
            {
                if(obj.pep_objs()[i].dropped())
                {
                    if(obj.pep_objs()[i].drop_region()[0].id == 1)
                    {
                        obj.pep_objs()[i].drop_region().attr('style', 'width:'+($.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientWidth+2)+'px;height:'+drop_region_heights[1]+'px;');
                        $.pep.peps[obj.pep_objs()[i].pep_idx].moveTo(15,heightOffset);
                        heightOffset += $.pep.peps[obj.pep_objs()[i].pep_idx].$el[0].clientHeight+10;
                    }    
                }
            }            
        }
    }    
}

function clear_drag_drop_exercise(obj)
{
    for(var i = 0, len = obj.dragdrop.pep_objs().length; i < len; ++i)
    {
        if(obj.dragdrop.pep_objs()[i].dropped())
        {          
            {
                $.pep.peps[obj.dragdrop.pep_objs()[i].pep_idx].toggle(true);
                return_item_to_response_container(obj.dragdrop.pep_objs()[i]);                
            }
        }
    }
    initiate_response_container(obj.dragdrop);    
}

function show_drag_drop_answer(obj)
{
    for(var i = 0, len = obj.dragdrop.pep_objs().length; i < len; ++i)
    {
        var $drop_container = $('.drop-target');
        var tmp_count = 0;
        for(var w = 0, tmp_len = $drop_container.length; w < tmp_len; ++w)
        {
            if($drop_container[w].offsetParent !== null)//is visible
            {
                if($drop_container[w].id == obj.dragdrop.pep_objs()[i].correct_drop_region())
                {
                    obj.dragdrop.pep_objs()[i].drop_region($($drop_container[w]));
                    obj.dragdrop.pep_objs()[i].dropped(true);
                    handle_drop(obj.dragdrop, obj.dragdrop.pep_objs()[i]);
                    adjust_drag_item_positions(obj.dragdrop);
                    $.pep.peps[obj.dragdrop.pep_objs()[i].pep_idx].toggle(false);
                }
            }
        }        
    }
    adjust_response_container(obj.dragdrop);
    adjust_drag_item_positions(obj.dragdrop);
    calculate_drag_drop_state(obj.dragdrop, obj);
}

function handleAutoScroll(ev, obj)
{
    var container_height = viewModel.labs()[viewModel.selected_lab()].container_height();
    var window_height = $('#'+viewModel.labs()[viewModel.selected_lab()].type()+'_exercises').height();
    var scroll_pos = $('.'+viewModel.labs()[viewModel.selected_lab()].type()+'_exercises').scrollTop();    
    //if(ev.pep.y > (scroll_pos+window_height) - 100)
    if(ev.pep.y > (container_height + 100))
    {   
        //alert($('.'+viewModel.labs()[lab_id].type()+'_exercises').scrollTop());
        $('.'+viewModel.labs()[viewModel.selected_lab()].type()+'_exercises').scrollTop(scroll_pos+10);
        var drop = obj.$el.detach();           
        $('body').append(drop);
        obj.moveTo(ev.pep.x, ev.pep.y);        
    }
    if(ev.pep.y < 200)
    {        
        $('.'+viewModel.labs()[viewModel.selected_lab()].type()+'_exercises').scrollTop(scroll_pos-10);
        var drop = obj.$el.detach();           
        $('body').append(drop);
        obj.moveTo(ev.pep.x, ev.pep.y);
    }    
}

// function restore_drag_drop_progress(progress_array)
// {
    // var dragdrop_progress = progress_array.split(',');
    // for (var p = 0; p < dragdrop_progress.length; ++p)
    // {   
        // if(typeof dragdrop_progress[p] === 'undefined' || dragdrop_progress[p] == ''){continue;}
        // var progress_data = dragdrop_progress[p].match( /l(\d+)e(\d+)q(\d+)r(\d+)\|q(\d+)/i );
        // viewModel.select_lab(parseInt(progress_data[1]));
        // viewModel.labs()[viewModel.selected_lab()].select_exercise(parseInt(progress_data[2]));//ex must be showing               
        // var type = viewModel.labs()[progress_data[1]].exercises()[progress_data[2]].type();