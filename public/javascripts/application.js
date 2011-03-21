// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(document).ready(function() {
    $('#new_game').click(function(){
    redirect_to_path('/courses');
    });
    activatePlaceholders();
    window.onload=function() {
      activatePlaceholders();
    }
    
    onOrientationChange();
    setTimeout(setupScroller('content'), 300);
    $("#course_country_id").change(function() {
        var country_id = $(this).val();
        if(country_id>0) $('#course_state_id').attr('disabled','');
        else {
            $('#course_state_id').attr('disabled','disabled').attr('value','0');
            $('#course_city_id').attr('disabled','disabled').attr('value','0');
        }
        callAjax({url:'/states/get_states_for_country/',params: 'country_id='+country_id,elementId:'course_state_id',updater:'true'});
    });
    $("#course_state_id").change(function() {
        var state_id = $(this).val();
        if(state_id>0) $('#course_city_id').attr('disabled','');
        else $('#course_city_id').attr('disabled','disabled').attr('value','0');
        callAjax({url:'/cities/get_cities_for_state/',params: 'state_id='+state_id,elementId:'course_city_id',updater:'true'});
    });
    offline_storage();
    check_network_status();
    setTimeout(setupScroller('score_table_content'), 300);
});

/*Generalized function to call server through ajax*/
function callAjax(options) {
   $.ajax({
       url:options.url,
       data:options.params ? options.params : '',
       method:options.method ? options.method : 'GET',
       contentType:options.contentType ? options.contentType : 'application/x-www-form-urlencoded',
       datType:'html',
       async:true,
       success: function(response){
           if(options.updater) $('#' + options.elementId).html(response);
           else if(options.callbackfunction) eval(options.callbackfunction);
       }
   })
}

/*Setting the height for screnn during orientation*/
var device_height;
window.addEventListener('onorientationchange' in window ? 'orientationchange': 'resize', onOrientationChange, false);

/*function to handle orientation change in smart phones*/
function onOrientationChange() {

    //device_height = ((window.orientation==-90 || window.orientation==90) ? 242 : 410);
    device_height = $(window).height();
    setTimeout(setHeight(),10);
}

// used to set heigth for page
function setHeight() {
    var height = 0;
    height += document.getElementById('header').offsetHeight;
    height += document.getElementById('footer').offsetHeight;
    $('div#content').css('height', (device_height - height));
    $('div#score_content').css('height', (device_height - height));
}

var scrollers = {};

function setupScroller(elementId) {
	var element = document.getElementById(elementId);
    	scrollers[elementId] = new TouchScroll(element, {elastic: true});
	scrollers[elementId].setupScroller(true);
}

// Used to validate and showing corresponding content accordingly
function add_more_course_detail(course_id) {
    if(isEmpty($('#course_club'))) return;
    else if(isEmpty($('#course_name'))) return;
    else if(($('#course_holes').val()== 0))alert("Holes is mandatory");
    else {
        if(($('#course_holes').val()==2) && ($('#course_detail_form').is(':visible'))) {

                 $('.hide_button').hide();
                 $('#course_detail_form').hide();
                 $('#other_course_detail_form').show();
                 $('#hide_continue_button').show();
                 $('.hide_save_button').hide();
                 $('#back_button').hide();
                 $('#virtual_back_button').show();
       }else if(($('#course_holes').val()==2) && ($('#course_detail_form').is(':invisible'))) {
                 for(var i=0;i<9;i++){
                    if(par_holes_validate($('#course_course_holes_attributes_'+i+'_par').val())) {
                       ($('#course_course_holes_attributes_'+i+'_par').focus())
                        return;
                    }
                 }
		    var course_id = (course_id==undefined ? -1 : course_id);
                    callAjax({url:'/courses/'+ course_id + '/add_holes',elementId:'other_course_detail_form2',updater:'true'});
                    $('.hide_button').hide();
                    $('#other_course_detail_form').hide();
                    $('#other_course_detail_form2').show();
                    $('#hide_continue_button').hide();
                    $('#course_detail_form').hide();
                    $('.hide_save_button').show();
                    $('#back_button').hide();
                    $('#virtual_back_button').show();
                 
            }else if($('#course_holes').val()==1) {
                $('#course_detail_form').hide();
                $('#other_course_detail_form').show();
                $('#hide_continue_button').hide();
                $('.hide_save_button').show();
                $('#back_button').hide();
                $('#virtual_back_button').show();
            }
  }
}

/* Back button fuctionality */
function back_to_course_detail() {
    $('#other_course_detail_form').hide();
    $('.hide_button').hide();
    close_login_help();
    if(((($('#course_holes').val()==2 && $('#hide_continue_button').is(':visible'))||($('#course_holes').val()==1)))) {
        $('#course_detail_form').show();
        $('#back_button').show();
        $('.hide_save_button').hide();
        $('#hide_continue_button').show();
        $('#virtual_back_button').hide();
}else if(($('#course_holes').val()==2) && ($('#hide_continue_button').is(':invisible'))) {
        $('#other_course_detail_form2').hide();
        $('#other_course_detail_form').show();
        $('#course_detail_form').hide();
        $('#back_button').hide();
        $('.hide_save_button').hide();
        $('#hide_continue_button').show();
        $('#virtual_back_button').show();
    }
}

// function to validate group field
function check_group_field(){
    if(isEmpty($('#group_name'))) return;
        else $("form").submit();
}

// Used to check validation in Par Field and Save the Data
function save_course_detail() {
/*    if(($('#course_holes').val()==1)  ) {
        for(var i=0;i<9;i++){
            if(par_holes_validate($('#course_course_holes_attributes_'+i+'_par').val())) {
                     $('#course_course_holes_attributes_'+i+'_par').focus();
                     return false;
            }
        }
    }else if(($('#course_holes').val()==2) && ($('.hide_save_button').is(':visible'))) {
        for( i=9;i<18;i++){
            if(par_holes_validate($('#course_course_holes_attributes_'+i+'_par').val())) {
                $('#course_course_holes_attributes_'+i+'_par').focus();
                return false;
            }
        }
    }             */
   $('#course_submit').click();
 }

// Par Field Validate function
function par_holes_validate(s) {
    var illegalChars = /\D/; // allow letters, numbers, and underscores
    if(s == ""){
       alert("Par value is mandatory for all fields\n");
       return true;
    }else if(s<1 ||s>10){
       alert("Par value should be between 1 to 10 only");
       return true;
    /*}else if(illegalChars.test(s)) {
       alert("Only numeric  allowed in par \n");
       return true;*/
    }return false
}

/* function to get help */
function find_help(){
    $('#help_info').show();
    $('#main_container').hide();
    $('#help_info').flip({
	direction: 'lr',
        onEnd: function (){
                   $('#help_info').removeAttr('style');
                   $('#help_info').show();
                   $('#help_button').replaceWith('<a class="button" href="#" id="close_button" onclick="close_login_help(); return false;">Close</a>');
               }
     })
    
    }

/* function to close help*/
function close_login_help(){
    $('#main_container').show();
    $('#help_info').hide();
    $('#main_container').show();
    $('#main_container').flip({
        direction: 'lr',
        onEnd: function (){
                  $('#main_container').removeAttr('style');
                  $('#main_container').show();
                  $('#close_button').replaceWith('<a class="button" href="#" id="help_button" onclick="find_help(); return false;">?</a>');
              }
    });

}

// Functionality is to validate registeration form
function validate_new_user(){
    if(isEmpty($('#user_first_name')))  return;
    else if(isEmpty($('#user_email')))  return;
    else if(isEmpty($('#user_login')))  return;
    else if(isEmpty($('#user_password'))) return;
    else if(isEmpty($('#user_password_confirmation'))) return;
    else if($('#terms').val() == "1") alert("Agreement not accepted");
    else $('#user_submit').click();
}

//Functionality is to check whether the element is empty or not.
function isEmpty(element){
    if(!element.val()){
        alertMessage(element);
        focusElement(element);
        return true;
    }
    else
        return false;
}

//Functionality is to focus on the desired element
function focusElement(element) {
    element.val('');
    element.focus();
}

//Functionality is to display an alert message on the desired element
function alertMessage(element){
    alert(element.attr("placeholder")+' is mandatory');
}

/*Functionality is to check whether the application is offline or online.*/
function isOnline() {
    return window.navigator.onLine;
}

//Generalised function for redirect
function redirect_to_path(path){
      window.location.href = path;
}

/*function is to generate UTC format Date*/
function getUTCformatDate(now){
    var utcdate =  new Date(now.getTime() + (now.getTimezoneOffset()*60000));
    return utcdate.getFullYear() +  '-' + prependZero(utcdate.getMonth()+1) +  '-' + prependZero(utcdate.getDate()) +  ' ' +prependZero(utcdate.getHours())+  ':' +prependZero(utcdate.getMinutes())+  ':' + prependZero(utcdate.getSeconds()) + ' UTC';
}

/*generalized function to prepend zero */
function prependZero(value) {
    if(value < 10) return  ('0' + value);
    return value;
}

/*function to generate plcaeholder for browser which do not support them*/
function activatePlaceholders() {
var detect = navigator.userAgent.toLowerCase();
if (detect.indexOf("safari") > 0) return false;
var inputs = document.getElementsByTagName("input");
for (var i=0;i<inputs.length;i++) {
  if (inputs[i].getAttribute("type") == "text") {
   if (inputs[i].getAttribute("placeholder") && inputs[i].getAttribute("placeholder").length > 0) {
    inputs[i].value = inputs[i].getAttribute("placeholder");
    inputs[i].onclick = function() {
     if (this.value == this.getAttribute("placeholder")) {
      this.value = "";
     }return false;
    }
    inputs[i].onblur = function() {
     if (this.value.length < 1) {
      this.value = this.getAttribute("placeholder");
     }
    }
   }
  }
}
}