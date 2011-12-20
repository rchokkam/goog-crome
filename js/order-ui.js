/*order ui javascript file*/

/*Global variable for order json response*/
var order_json={};

var accept_header = 'application/vnd.yousee.kasia2+json;charset=UTF-8;version=1';

$(function(){

	$("#tabs").tabs();
	$("#tabs").hide();

	$('#accordion').accordion({
		autoHeight : false,
		navigation : true
	});

	$('button').button();

	$('#uuid-b').click(function(){
		// get uuid
		var uuid = get_order_uuid();		
		// invoke the web service
		get_order_by_uuid(uuid);
		// process the response

	});

});

/**
 * Return the uuid
 **/
var get_order_uuid = function() {
	return $("#uuid").attr('value');
};

/**
 * Get order by uuid.
 **/
var get_order_by_uuid = function(uuid) {
	var ruri = 'http://darton:41001/ordre-v1/' + uuid;
 	$.ajax({
 		url: ruri,
		processData:false,
		type: 'GET',
		beforeSend:function(jqXHR, settings){			
			jqXHR.setRequestHeader("Accept", accept_header);
			jqXHR.setRequestHeader("Content-Type", accept_header);
			$('body').css('cursor','wait');

			// ToDo clear hide the tab or clear the tab data.
		},
		success: function(data, textStatus, jqXHR){						
			// Render the template with the movies data and insert
			// the rendered HTML under the "movieList" element
			order_json = data;	
			$("#ordre").empty().html(
				$( "#orderDetails" ).render( data )
			);					

			$("#tabs").show();

		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error get_order_by_uuid');	
		},
		complete: function(jqXHR,textStatus){
			$('body').css('cursor','auto');
		}						
	});
 };
/**
 * Return the kunde id
 **/
var get_order_by_kunde_id = function(kid) {
	var ruri = 'http://darton:41001/ordre-v1/' + kid;
 	$.ajax({
 		url: ruri,
		processData:false,
		type: 'GET',
		beforeSend:function(jqXHR, settings){			
			jqXHR.setRequestHeader("Accept", accept_header);
			jqXHR.setRequestHeader("Content-Type", accept_header);
			$('body').css('cursor','wait');
		},
		success: function(data, textStatus, jqXHR){						
			// Render the template with the movies data and insert
			// the rendered HTML under the "movieList" element
			$("#kid-rbody").empty().html(
				$( "#kundeOrder" ).render( data )
			);
			$('#kid-rdiv').show();
			
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('error');	
		},
		complete: function(jqXHR,textStatus){
			$('body').css('cursor','auto');
		}						
	});
 };

 /**
 * Get Address by ams id.
 **/
 var get_address_by_amsid = function(amsid) {
 	var ruri = 'http://darton:41001/adresse-v1/' + amsid;
 	$.ajax({
 		url: ruri,
		processData:false,
		type: 'GET',
		beforeSend:function(jqXHR, settings){			
			jqXHR.setRequestHeader("Accept", accept_header);
			jqXHR.setRequestHeader("Content-Type", accept_header);
			$('body').css('cursor','wait');
		},
		success: function(data, textStatus, jqXHR){						
			// Render the template with the movies data and insert
			// the rendered HTML under the "movieList" element								
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error get_address_by_amsid');	
		},
		complete: function(jqXHR,textStatus){
			$('body').css('cursor','auto');
		}						
	});
 };

/**
 * Replacer callback function for JSON.stringnify.
 */
var replacer=function(key, value) {
	return value;
};






