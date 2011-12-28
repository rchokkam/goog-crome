/*order ui javascript file*/

/*Global variable for order json response*/
var order_json={};

var accept_header = 'application/vnd.yousee.kasia2+json;charset=UTF-8;version=1';

var map;
var marker;

$(function(){

	$("#tabs").tabs({
		event: "mouseover"
	});

	$("#a-tab-3").bind("mouseover",function(){
		if(map!=undefined || map!=null){
			google.maps.event.trigger(map, 'resize');
		}

		if(marker!=undefined || market!=null){
			map.setCenter(marker.getPosition());
			google.maps.event.trigger(marker, 'click');	
		}		
	});
	
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

			// Display tab widget.
			$("#tabs").show();

			// Render order details
			$("#ordre").empty().html(
				(new EJS({url: 'js/ejs/ordre.js'})).render(data)				
			);
			
			$('#order-detail-acrdion').accordion({
				autoHeight : false,
				navigation : true
			});
			
			$('#order-aftaler-acrdion').accordion({
				autoHeight : false,
				navigation : true
			});
						
			var kundeData=data['kunde-data'];
			
			// Render Aftaler
			render_order_aftaler(kundeData.aftaler);
			// Render Valgt
			render_order_valgt(kundeData.valgt);
			// Render Opsagt				
			render_order_opsagt([]);


			// Render steps data grid
			populate_steps_grid(data.steps);

			// Render kunde information
			// TODO - for simple html replace $.get to get the html content.
			$("#kunde").empty().html(
				(new EJS({url: 'js/ejs/kunde.js'})).render(kundeData)
			);

			get_order_by_kunde_id(data.kundeid);


			// Address Tab
			get_address_by_amsid(data.amsid);

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

			$("#kunde-orders").empty();	
			$.each(data,function(i,order){
				var korder = '#' + order.uuid,
					korder_grid = korder + '-grid',
					korder_pager = korder + '-pager',
					korder_caption = '| ' + order.uuid + ' | ' + order.ordredato + ' | ' + order.status + ' | ';

				$("#kunde-orders").append(
					(new EJS({url: 'js/ejs/korders.js'})).render(order)
				);	

				$(korder_grid).jqGrid({				
	  				datatype: "local",  				  				
	    			colNames:['Navn','Varenr', 'Type', 'Forretningsområde'],
	    			colModel:[
	      				{name:'navn',index:'navn',sorttype:"string"},
	      				{name:'varenr',index:'varenr'},
	      				{name:'type',index:'type'},
	      				{name:'forretningsområde',index:'forretningsområde'}      
	    			],
	    			rowNum:10,
	   				rowList:[10,20,30],
	    			pager: korder_pager,
	    			viewrecords: true,
	    			multiselect: false,
	    			caption: korder_caption,	    					
	    			width: 866,
	    			height: '100%'
				}).navGrid(korder_pager,{edit:false,add:false,del:false});

				$.each(order.valgte,function(i,valgte){
					$(korder_grid).jqGrid('addRowData',i+1,valgte);				
				});
				
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

			$("#address").empty().html(
				(new EJS({url: 'js/ejs/adresse.js'})).render(data)
			);

			var myLatlng = new google.maps.LatLng(parseFloat(data.latitude), parseFloat(data.longitude));
    		var myOptions = {
      			zoom: 16,
      			center: myLatlng,
      			mapTypeId: google.maps.MapTypeId.ROADMAP
    		};
    		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    		var addTitle = $('#kaddress').text();
			marker = new google.maps.Marker({
    			position: myLatlng,
    			title: addTitle
			});

			var infowindow = new google.maps.InfoWindow({
   				content: addTitle
			});

			// To add the marker to the map, call setMap();
			marker.setMap(map);

			google.maps.event.addListener(marker, 'click', function() {
  				infowindow.open(map,marker);
			});

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
  *
  **/
var populate_steps_grid = function(steps){
	// TODO - for simple html replace $.get to get the html content.
	$("#steps").empty().html(
		(new EJS({url: 'js/ejs/steps.js'})).render(steps)
	);

	$("#orderStepsGrid").jqGrid({				
  		datatype: "local",  				  		
    	colNames:['Varenummer','Step status', 'kode', 'Id'],
    	colModel:[
      		{name:'varenummer',index:'varenummer',sorttype:"string"},
      		{name:'step_status',index:'step_status'},
      		{name:'kode',index:'kode'},
      		{name:'id',index:'id',jsonmap:'id'}
    	],
    	id: 'id',
    	rowNum:10,
   		rowList:[10,20,30],
    	pager: '#os-pager',
    	viewrecords: true,
    	multiselect: false,
    	caption: "Ordre steps",    	
    	width: 866,
	    height: '100%'
	}).navGrid('#os-pager',{edit:false,add:false,del:false});

	$.each(steps,function(i,step){
		$("#orderStepsGrid").jqGrid('addRowData',i+1,step);
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
/**
 *
 **/
var render_order_aftaler = function(aftaler){
	$("#order-aftaler").empty();
	$.each(aftaler, function(i, aftal){
		var aftalenr = '#' + aftal.aftalenr,
			aftalenr_pager = aftalenr + '-pager',
			aftalenr_caption = aftal.aftaletype + ' &gt;&gt; ' + aftal.aftalenr;

		$("#order-aftaler").append(
			(new EJS({url: 'js/ejs/aftaler.js'})).render(aftal)
		);	
				
		$(aftalenr).jqGrid({				
	  		datatype: "local",  				  		
	    	colNames:['Navn','Varenr','Varetype','Sorteringsgruppe'],
	    	colModel:[
	      		{name:'navn',index:'navn',sorttype:"string"},
	      		{name:'varenr',index:'varenr'},
	      		{name:'varetype',index:'varetype'},
	      		{name:'sorteringsgruppe',index:'sorteringsgruppe'}
	    	],	    	
	    	rowNum:10,
	   		rowList:[10,20,30],
	    	pager: aftalenr_pager,
	    	viewrecords: true,
	    	multiselect: false,	    	
	    	caption: aftalenr_caption,
	    	width: 810,
	    	height: '100%'
		}).navGrid(aftalenr_pager,{edit:false,add:false,del:false});

		$.each(aftal.abonnementer,function(i,abonnement){
			$(aftalenr).jqGrid('addRowData',i+1,abonnement);
		});
	});			
};
/**
 *
 **/
var render_order_valgt = function(valgts){
	$('#order-valgt').empty();

	$.each(valgts, function(i, valgt){		
		var valgt_aftalenr = '#' + valgt.aftalenr + '-valgt',
			valgt_aftalenr_pager = valgt_aftalenr + '-pager',
			valgt_aftalenr_caption = valgt.aftaletype + ' &gt;&gt; ' + valgt.aftalenr;

		$('#order-valgt').append(
			(new EJS({url: 'js/ejs/valgt.js'})).render(valgt)
		);		
			
		$(valgt_aftalenr).jqGrid({				
	  		datatype: "local",  				  		
	    	colNames:['Navn','Varenr','Varetype','Sorteringsgruppe'],
	    	colModel:[
	      		{name:'navn',index:'navn',sorttype:"string"},
	      		{name:'varenr',index:'varenr'},
	      		{name:'varetype',index:'varetype'},
	      		{name:'sorteringsgruppe',index:'sorteringsgruppe'}
	    	],	    	
	    	rowNum:10,
	   		rowList:[10,20,30],
	    	pager: valgt_aftalenr_pager,
	    	viewrecords: true,
	    	multiselect: false,	    	
	    	caption: valgt_aftalenr_caption,
	    	width: 810,
	    	height: '100%'
		}).navGrid(valgt_aftalenr_pager,{edit:false,add:false,del:false});
		
		$.each(valgt.varer,function(i,varer){
			$(valgt_aftalenr).jqGrid('addRowData',i+1,varer);
		});	

	});
};
/**
 *
 **/
var render_order_opsagt = function(opsagt){
	$('#order-opsagt').text(opsagt.length);
};



