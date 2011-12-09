/*order ui javascript file*/

/*Global variable for order json response*/
var order_json={};

$(function(){
	/*handle click event on submit button*/
	$("#submit").click(function(){
		var iurl = $("#url").attr("value");
		alert(iurl);
		$.ajax({url: iurl,
			processData:false,
			type: "GET",
			dataType: 'json',
			crossDomain: true,
			beforeSend:function(jqXHR, settings){
				jqXHR.setRequestHeader("Accept", "application/vnd.yousee.kasia2+json;charset=UTF-8");
	    		jqXHR.setRequestHeader("Content-Type", "application/vnd.yousee.kasia2+json;charset=UTF-8");
	    	},
			success: function(data, textStatus, jqXHR){
				//$("#dresponse").html('<pre><code>' + JSON.stringify(data, replacer, 4) + '</code></pre>')	
				order_json=data;
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert('Error');
			},
			complete: function(jqXHR,textStatus){
				//alert('Complete');				
			}
		});
	});

});

/**
 * Replacer callback function for JSON.stringnify.
 */
var replacer=function(key, value) {
	return value;
};