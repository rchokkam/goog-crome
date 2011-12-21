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

			// Render order details
			$("#ordre").empty().html(
				(new EJS({url: 'js/ejs/ordre.js'})).render(data)				
			);					

			// Render kunde information
			$("#kunde").empty().html(
				(new EJS({url: 'js/ejs/kunde.js'})).render(data['kunde-data'])
			);

			get_order_by_kunde_id(data.kundeid);

			// Display tab widget.
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
			// Render kunde information
			$("#kunde-orders").empty().html(
				(new EJS({url: 'js/ejs/korders.js'})).render(data)
			);
			
			$("#kundeOrderGrid").jqGrid({				
  				datatype: "local",  				
  				height: 250,
    			colNames:['UUID','Ordredato', 'Status', 'Salgskanal'],
    			colModel:[
      				{name:'uuid',index:'uuid',sorttype:"string"},
      				{name:'ordredato',index:'ordredato'},
      				{name:'status',index:'status'},
      				{name:'salgskanal',index:'salgskanal'}      
    			],
    			pager: jQuery('#ko-pager'),
    			viewrecords: true,
    			multiselect: false,
    			caption: "Ordre by kunde",
    			height: "100%",
    			width: "100%"
			});

			$.each(data,function(i,order){
				$("#kundeOrderGrid").jqGrid('addRowData',i+1,order);
			});

		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Error get_order_by_kunde_id');	
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
/**
 *Resize the grid
 **/
var resize_the_grid=function() {
    $('#theGrid').fluidGrid({base:'#grid_wrapper', offset:-20});
};

// $(window).resize(resize_the_grid);


