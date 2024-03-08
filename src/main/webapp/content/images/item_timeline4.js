
var footfall_timeline_data = [];

var current_timeline_data = null;

var timeline_type = "";


function init_timeline()
{
	


	$("<div class='layer1 left_col col'> </div>").appendTo(".main_content");
	
	
	
	$("<div class='layer1 right_col col'> </div>").appendTo(".main_content");

	
	
	
	
	Promise.all([get_item_timeline(current_item_id)]).then(function([data]){
		
		console.log(data);
		
		draw_timeline_tool();

		
		draw_checkbox();
		
		
		init_export_btn();
		
		height_cascade();
	});

	
	
	
	

	
	draw_item_info_tool();	
	    
    Promise.all([get_single_item_data(current_item_id)]).then(function (){
    	
    	current_item_data = single_item_data;
    	
    	update_item_info();
    	
    });  
	
	height_cascade();

}






function draw_timeline_tool()
{
	
	var tool_class_name = "timeline";
	var tool_dot_class_name = " ."+tool_class_name;

	
	var tool_dot_class_name = "."+tool_class_name;
	
	var tool_w = lu*8;
	var tool_max_h = su*9;
	
		

	$("<div class='"+tool_class_name+" layer1 tool_box large_text'> " +
			"<div class='tool_box_header'>" +
			"<div class='tool_box_header_name'> Timeline </div>"+
			"<div class='tool_box_header_btn up_btn flat_btn'></div>"+
			"</div>" +	
			"<div class='tool_box_content'>" +
			"<div class='tool_box_content_comment'> Based on last 5 user selections </div>" +

			"<svg class='main_svg "+tool_class_name+"_svg' preserveAspectRatio='xMinYMin'> </svg>"+
			"</div>" +
	"</div>")
		.css({
			left:(0),
			top: (0),
			width:(tool_w),
//			height:tool_max_h,
			"min-height" : (tool_max_h),
			
		})
		.data("view_status",1)
		.click(function(){
		
		})		
		.appendTo(".left_col");
	

	$(tool_dot_class_name+" .up_btn ").click(function(){
		
		console.log("up_btn");
		
		var dim = $(tool_dot_class_name)[0].getBoundingClientRect();
		
		console.log(dim);

		window.scrollTo(0, dim.y+window.scrollY-gap_su_1);
		
	});
	
	
	
	
	Promise.all([get_item_timeline(current_item_id)]).then(function([data]){
		
		Promise.all([reshape_timeline_data(data)]).then(function(data){
			
			draw_timeline_chart_hourly();
			
		});
		
	});

	draw_chart_legends($(tool_dot_class_name+" .tool_box_content"),{x:(tool_w-su*6+su_mi),y:(su+su_2)})

	height_cascade();

}






function reshape_timeline_data(data)
{

	var deferred = new $.Deferred();

	var footprint_timeline_hourly_data = new Array(24).fill().map(function(item, index, arr) {
	    return ({
	    	
	    	"time_unit" : index,
	    	"touch_array" : [
	    		{
	    			"touch_type_num": 0, 
	                "touch_type": "Visit",
	                "value": 0
	            },
	            {
	            	"touch_type_num": 1, 
	                "touch_type": "Purchase",
	                "value": 0
	            },
	            {
	            	"touch_type_num": 2,
	                "touch_type": "Cartexit",
	                "value": 0
	            }
	    		
	    	]
	    	
	    });
	});
	
	
	var footprint_timeline_weekly_data = new Array(7).fill().map(function(item, index, arr) {
	    return ({
	    	
	    	"time_unit" : index,
	    	"touch_array" : [
	    		{
	    			"touch_type_num": 0, 
	                "touch_type": "Visit",
	                "value": 0
	            },
	            {
	            	"touch_type_num": 1, 
	                "touch_type": "Purchase",
	                "value": 0
	            },
	            {
	            	"touch_type_num": 2,
	                "touch_type": "Cartexit",
	                "value": 0
	            }
	    		
	    	]
	    	
	    });
	});
	
	
	var footprint_timeline_monthly_data = new Array(12).fill().map(function(item, index, arr) {
	    return ({
	    	
	    	"time_unit" : index,
	    	"touch_array" : [
	    		{
	    			"touch_type_num": 0, 
	                "touch_type": "Visit",
	                "value": 0
	            },
	            {
	            	"touch_type_num": 1, 
	                "touch_type": "Purchase",
	                "value": 0
	            },
	            {
	            	"touch_type_num": 2,
	                "touch_type": "Cartexit",
	                "value": 0
	            }
	    		
	    	]
	    	
	    });
	});
	

	var data_l = data.length;

	
	for (var i=0; i<data_l; i++){
		
		var data_elem = data[i];
		
		
		if (data_elem.timeCat==1){
			
			footprint_timeline_hourly_data[data_elem.timeUnit].touch_array[data_elem.touchType-1].value = parseInt(data_elem.touchCount);

		}


		if (data_elem.timeCat==2){
			
			footprint_timeline_weekly_data[data_elem.timeUnit-2].touch_array[data_elem.touchType-1].value = parseInt(data_elem.touchCount);

		};
		

		if (data_elem.timeCat==4){

			footprint_timeline_monthly_data[data_elem.timeUnit-1].touch_array[data_elem.touchType-1].value = parseInt(data_elem.touchCount);

		};
		
		
		
		if (i+1==data_l){
			
	    	footfall_timeline_data = [footprint_timeline_hourly_data,footprint_timeline_weekly_data,footprint_timeline_monthly_data];

//	    	console.log(footprint_timeline_hourly_data);
//	    	console.log(footprint_timeline_weekly_data);
//	    	console.log(footprint_timeline_monthly_data);
//
//	    	console.log(footfall_timeline_data);
	    	
	    	
	    	deferred.resolve(footfall_timeline_data);

		}
		
		
	}
	return deferred.promise();

}


function draw_timeline_chart_hourly()
{
	  timeline_type = 1;
	  
	  current_timeline_data = footfall_timeline_data[0];
	  
	  draw_timeline_chart();

	  

}


function draw_timeline_chart_weekly()
{
	timeline_type = 2;
	
	current_timeline_data = footfall_timeline_data[1];
	  
	draw_timeline_chart();

	  
}


function draw_timeline_chart_monthly()
{
	timeline_type = 3;
	
	current_timeline_data = footfall_timeline_data[2];
	  
	draw_timeline_chart();

	
}




function draw_timeline_chart()
{
	
	var barchart_w = lu*7;
	var barchart_h = su*7;
	
	var margin = {top: 30, right: 25, bottom: 40, left: 50};
    
                                    	
	var dim = d3.select(".timeline_svg").node().getClientRects()[0];


	
	var barchart_svg = d3.select(".timeline_svg")
                        	.append("svg")
                        	.attr("class","large_timeline_hourly_g")
                        	.attr("transform", "translate(" + ( 0 )+ "," + ( 0 ) + ") scale(1.0)")
                        	.attr("opacity",1.0)
                        	;
	
	
	var time_unit_array = current_timeline_data.map(function(d) { return d.time_unit; });
	
	var valueNames = current_timeline_data[0].touch_array.map(function(d) { return d.touch_type; });

	

	var x0_scale = d3.scaleBand()
					    .rangeRound([0, barchart_w])
					    .paddingInner(0);
					    ;
	var x1_scale = d3.scaleBand()							
					    .paddingOuter(0)
					    .paddingInner(-2)
						;
	var y_scale = d3.scaleLinear().range([barchart_h,  margin.top]).nice();


	x0_scale.domain(time_unit_array);
	x1_scale.domain(valueNames).range([0+7, x0_scale.bandwidth()+7]);
//	x1_scale.domain(valueNames).rangeRound([0, x0_scale.bandwidth()]);
	y_scale.domain(
			[ 0, 
			  d3.max(
					  current_timeline_data, 
					  function(time_unit){ 
						  return d3.max( time_unit.touch_array, function(d){ return d.value; }); 							  
					  })
		    ]
		  );
	
	
	
	
	var xAxis = d3.axisBottom(x0_scale)
					.tickSize(5)
//					.tickFormat(d => d + " H")
					.tickFormat(d => {
						
						var unit_text = '';
						
						console.log(d);
						if (timeline_type==1){
							
							unit_text = d+"h";
							
						}
						else if (timeline_type==2){
							if (d==0){
								unit_text = "Monday";
							};
							if (d==1){
								unit_text = "Tuesday";
							};
							if (d==2){
								unit_text = "Wednsday";
							};
							if (d==3){
								unit_text = "Thursday";
							};
							if (d==4){
								unit_text = "Friday";
							};
							if (d==5){
								unit_text = "Saturday";
							};
							if (d==6){
								unit_text = "Sunday";
							};
						}
						else if (timeline_type==3){
							if (d==0){
								unit_text = "January";
							};
							if (d==1){
								unit_text = "February";
							};
							if (d==2){
								unit_text = "March";
							};
							if (d==3){
								unit_text = "April";
							};
							if (d==4){
								unit_text = "May";
							};
							if (d==5){
								unit_text = "June";
							};
							if (d==6){
								unit_text = "July";
							};
							if (d==7){
								unit_text = "August";
							};
							if (d==8){
								unit_text = "September";
							};
							if (d==9){
								unit_text = "October";
							};
							if (d==10){
								unit_text = "November";
							};
							if (d==11){
								unit_text = "December";
							};
						}
						
						return unit_text;
					});
					;
	
	var yAxis = d3.axisLeft(y_scale).ticks(3);


	
	barchart_svg.append("g")
					  .attr("class", "x_axis")
					  .attr("transform", "translate("+( margin.left )+"," + (barchart_h+margin.top ) + ")")								  

					  .call(xAxis)					  
					  ;

	barchart_svg.append("g")
				      .attr("class", "y_axis")
				      .attr("transform", "translate("+( margin.left )+","+( margin.top )+")")
				      .call(yAxis)	
				      ;

	var slice = barchart_svg.selectAll(".slice")
                            .data(current_timeline_data)
                            .enter().append("g")
                            .attr("class", "g")
                            .attr("transform",function(d) { return "translate(" + x0_scale(d.time_unit) + ",0)"; });


	

	slice.selectAll("rect")
		    .data(function(d) { 
//		  	  console.log([d.touch_array]);
		  	  return d.touch_array; 
		  	  
		    })
		    .enter().append("rect")
		    .attr("width", 6)
		    .attr("x", function(d) { 
		    	
		    	var x_offset = 0;
		    	if (timeline_type==1){
		    		x_offset = -1;
		    	}
		    	if (timeline_type==2){
		    		x_offset = 20;
		    	}
		    	if (timeline_type==3){
		    		x_offset = 8;
		    	}
		    	
		    	
		    	return x1_scale(d.touch_type)+margin.left+x_offset; 
		    	
		    })
		    .attr("height",0)
		    .attr("y", (barchart_h+margin.top) )
		    .style("fill", function(d) {
		  	  
		    	
		  	  return colors.touch_type[d.touch_type_num]; 
		  	  
		    })
		    .attr("fill-opacity",0.8)
		    .on("mouseenter",function(d){
		    	  
		    	  console.log(d);
		    	  
		    	  var dim = d3.select(this).node().getClientRects()[0];
		    	  console.log(dim);

		    	  var touch_type_text = "";
		    	  if (d.touch_type==1){
		    		  touch_type_text = "Visits";
		    	  }
		    	  else if (d.touch_type==2){
		    		  touch_type_text = "Purchases";
		    	  }
		    	  else if (d.touch_type==4){
		    		  touch_type_text = "Cart Exits";
		    	  }
		    	  
		    	  draw_svg_tooltip((d.touch_type+"s : "+d.value),d3.select(".timeline_svg"),[dim.x-su*2+su_8,d3.mouse(this)[1]]);
		    	  d3.select(this).attr("fill-opacity",1);
		    	  
		    })
        	.on("mouseleave",function(e){
        		  d3.select(this).attr("fill-opacity",0.8);
        		  remove_tooltip();
        	})
		    .transition()
            .duration(1000)
            .delay(function (d, i) {	
                return i * 100;
            })		    
		    .attr("height", function(d) {
		    	
		    	var h = (barchart_h - y_scale(d.value) );
		    	
		    	return (h==0?3:h); 
		  	  
		    })
		    .attr("y", function(d) {
		    	
		    	var _y = y_scale(d.value)+margin.top;
		    	
		    	return (d.value==0?_y-3:_y); 
		  	  
		    })
		    .style("fill", function(d){
		    	if(d.touch_type_num==0){return "url(#full_visit_gradient)"};
		    	if(d.touch_type_num==1){return "url(#full_purchase_gradient)"};
		    	if(d.touch_type_num==2){return "url(#full_cartexit_gradient)"};
		    })

		    ;
	
	

	
	barchart_svg
    		.append("text")			
    		.text("Touch Count")
    		.attr("class","chart_main_axis_title")
    		.attr("x",0)
    		.attr("y",(barchart_h/2))
    		.style("text-anchor", "middle")
    		.attr("transform", "rotate(-90,12,"+(barchart_h/2)+")");        
    		;
    		
    $(".x_axis_title_text").remove();
	var x_axis_title_text = "";
	if (timeline_type==1){
		x_axis_title_text = "Hour of Day";
	}
	else if (timeline_type==2){
		x_axis_title_text = "Day of Week";
		  
	}
	else if (timeline_type==3){
		x_axis_title_text = "Month in Year";
		  
	}    		
	
	
    d3.select(".timeline_svg")
			.append("text")			
			.text(x_axis_title_text)
			.attr("class","chart_main_axis_title x_axis_title_text")
			.attr("x",(barchart_w/2+margin.left))
			.attr("y",(barchart_h+su-su_8))
			.style("text-anchor", "middle")
			;        		
	
	
	
	
}








function draw_checkbox()
{

	console.log("draw_checkbox - ");
	
	
	var dim = d3.select(".timeline_svg").node().getClientRects()[0];
	var radio_html_w = 167;
//	console.log("draw_checkbox : dim:=");
//	console.log(dim);
	
	
	var radio_html = $('<div class="large_timeline_radio small_text"> '+
			              '<input type="radio" id="option-one" value="hourly" name="selector" checked>'+
			              '<label for="option-one">DAY</label>'+
			              '<input type="radio" id="option-two" value="weekly" name="selector">'+
			              '<label for="option-two">WEEK</label>'+
			              '<input type="radio" id="option-three" value="monthly" name="selector">'+
			              '<label for="option-three">MONTH</label></div>') 			             
			              ;
	
	
	
	
	
	$(".timeline .tool_box_content").append(radio_html);
	


	
	
	
	radio_html.css("top",(su+su_2));
	radio_html.css("left",( 0 ) );

	
	$( "input[type=radio]" ).on( "click", function(d){
		
		console.log("draw_checkbox : $(this):=");
		console.log($(this));
		
		console.log("draw_checkbox : $(this).val:=");
		console.log($(this).val());
		
		console.log("draw_checkbox : $(this).is(:checked):=");
		console.log($(this).is(":checked"));
//		.removeAttr('checked');
		if ($(this).is(":checked")){
			
			if ($(this).val()==="hourly"){
				remove_timeline( );
				
				draw_timeline_chart_hourly();
			};
			if ($(this).val()==="weekly"){
				remove_timeline( );
				draw_timeline_chart_weekly();
			};
			if ($(this).val()==="monthly"){
				remove_timeline( );
				draw_timeline_chart_monthly();
			};
			
			
		}; 
		
		
	});

	
	
	
}




function remove_timeline()
{
	
	d3.select(".timeline_svg svg").remove();
	
	current_timeline_data = null;

	
}










function init_export_btn()
{
	
	$(".nav_export_btn")
			.click(function(e){
				
				console.log("nav_prediction_btn click");
				remove_tooltip();
				
				
				console.log(e);
				console.log($(this).offset());
				console.log($(this).position());
				console.log(e.originalEvent);
				console.log(window.scrollY);
				
				
				
				var tool_w = su*4;
				var tool_max_h = su*2;
				
				$(
					"<div class='modal_export'>" +
					"<div class='modal_export_box_header small_text bold_text'> &nbsp; &nbsp; &nbsp; &nbsp;Download CSVs" +
						"<div class='modal_export_box_header_btn cancel_btn flat_btn'></div>"+

					"</div>"+
					"<div class='modal_export_box_content'>" +
    					"<div class='modal_export_row small_text'> Product Timeline Data" +
    						"<div class='modal_export_box_header_btn download_btn  prediction_data_download  '></div>"+
    					"</div>"+
    					"<div class='modal_export_row small_text'> Product Data" +
    						"<div class='modal_export_box_header_btn  download_btn  production_data_download '></div>"+
    					"</div>"+
					"</div>"+
					"</div>" 	
				)
				.css({
					left:(su+su_3),
//					top: (e.originalEvent.clientY+window.scrollY-su+su_8),
//					top: ($(this).position()[0]-tool_max_h/2),
					top: ($(this).position().top),
					width:(tool_w),
//					height:tool_max_h,
					"min-height" : (tool_max_h),
					
				})
				.data("view_status",1)
				.click(function(){
				
				})		
				.appendTo("body");
			
				$(".modal_export_box_header_btn")
    				.click(function(){
    					$(".modal_export").remove();
    					
    				});
				
				
				$(".prediction_data_download")
    				.click(function(){
    					_timeline_data_download();
    					
    				});
				

				$(".production_data_download")
    				.click(function(){
    					
    					_product_data_download();
    				});
				
				
				
			});
	

	
	
	
	
	var _timeline_data_download = function ()
	{
		console.log(current_item_data);	
		
		var export_data = [];
		
		
		export_data.push(["====","====","====","===="]);
		export_data.push(["Main Product","Exported On = "+Date()]);
		export_data.push([""]);
		

		var keys = Object.keys(current_item_data);
		var values = Object.values(current_item_data);
		
		var keys_l = keys.length;
		
		for (var i=0; i<keys_l; i++){
		
			
			if (keys[i]=="itemId"){
				export_data.push(["Item Id", values[i]]);				
			}

			if (keys[i]=="nameStr"){
				export_data.push(["Name", values[i]]);
			}

			if (keys[i]=="catArray"){
				export_data.push(["Categories", values[i]]);
			}

			if (keys[i]=="price"){
				export_data.push(["Price", values[i]]);
			}

			if (keys[i]=="descrStr"){
				export_data.push(["Description", values[i]]);
			}
			
			if (keys[i]=="imageUrl"){
				export_data.push(["Image URL", values[i]]);
			}

			if (keys[i]=="footfallRank"){
				export_data.push(["Footfall Rank", values[i]]);
			}

			if (keys[i]=="footfallPerc"){
				export_data.push(["Footfall Percentage", values[i]]);
			}

			if (keys[i]=="footfallCount"){
				export_data.push(["Footfall Count", values[i]]);
			}
			
			if (keys[i]=="visitCount"){
				export_data.push(["Visit Count", values[i]]);
			}
			
			if (keys[i]=="purchaseCount"){
				export_data.push(["Purchase Count", values[i]]);
			}
			
			if (keys[i]=="cartexitCount"){
				export_data.push(["Cartexit Count", values[i]]);
			}
			
		}

		export_data.push([""]);
		export_data.push([""]);
		export_data.push(["====","====","====","===="]);
		export_data.push(["Daily Timeline (24 Hours)"]);
		export_data.push([""]);
		var export_item_row_header = [ 	"Hour", "Visit Count", "Purchase Count",	"Cart Exit Count" 	];		
		export_data.push(export_item_row_header);
		
		var timeline_data = footfall_timeline_data[0];
		
		var _length = timeline_data.length;

		for (var i=0; i<_length; i++ ){
			
			var data_elem = timeline_data[i];

			export_data.push([
				data_elem["time_unit"],
				data_elem["touch_array"][0].value,
				data_elem["touch_array"][1].value,
				data_elem["touch_array"][2].value,
				
			]);
				
		}

		
		
		
		export_data.push([""]);
		export_data.push([""]);
		export_data.push(["====","====","====","===="]);
		export_data.push(["Weekly Timeline (7 Days)"]);
		export_data.push([""]);
		var export_item_row_header = [ 	"Day", "Visit Count", "Purchase Count",	"Cart Exit Count" ];		
		export_data.push(export_item_row_header);
		
		var timeline_data = footfall_timeline_data[1];
		
		var _length = timeline_data.length;

		for (var i=0; i<_length; i++ ){
			
			var data_elem = timeline_data[i];
			var day_name = [ "Moday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday", 	];		

			export_data.push([
				day_name[data_elem["time_unit"]],
				data_elem["touch_array"][0].value,
				data_elem["touch_array"][1].value,
				data_elem["touch_array"][2].value,
				
			]);
				
		}
		
		
		
		

		
		export_data.push([""]);
		export_data.push([""]);
		export_data.push(["====","====","====","===="]);
		export_data.push(["Monthly Timeline (12 Months)"]);
		export_data.push([""]);
		var export_item_row_header = [ 	"Month", "Visit Count", "Purchase Count",	"Cart Exit Count" ];		
		export_data.push(export_item_row_header);
		
		var timeline_data = footfall_timeline_data[2];
		
		var _length = timeline_data.length;

		for (var i=0; i<_length; i++ ){
			
			var data_elem = timeline_data[i];
			var month_name = [ "January", "February", "March", "April", "May", "June",
							 "July", "August", "September","October","November","December", 	];		

			export_data.push([
				month_name[data_elem["time_unit"]],
				data_elem["touch_array"][0].value,
				data_elem["touch_array"][1].value,
				data_elem["touch_array"][2].value,
				
			]);
				
		}
		
		
		
		
		console.log(export_data);		
		


		var csvString = export_data.map(row => row.join(',')).join('\n');
		var a         = document.createElement('a');
		a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
		a.target      = '_blank';
		a.download    = 'Product_Timeline_'+string_trim(current_item_data.nameStr,20)+'['+current_item_data.itemId+']'+'.csv';
		
		document.body.appendChild(a);
		a.click();
		
		
		
		
	}
	
	
	
	
	
	var _product_data_download = function ()
	{
		
//		console.log(a);
//		console.log(current_item_data);		
		
		var export_item_data = [];
		
		var keys = Object.keys(current_item_data);
		var values = Object.values(current_item_data);
		
		var keys_l = keys.length;
		
		for (var i=0; i<keys_l; i++){
		
			
			if (keys[i]=="itemId"){
				export_item_data.push(["Item Id", values[i]]);				
			}

			if (keys[i]=="nameStr"){
				export_item_data.push(["Name", values[i]]);
			}

			if (keys[i]=="catArray"){
				export_item_data.push(["Categories", values[i]]);
			}

			if (keys[i]=="price"){
				export_item_data.push(["Price", values[i]]);
			}

			if (keys[i]=="descrStr"){
				export_item_data.push(["Description", values[i]]);
			}
			
			if (keys[i]=="imageUrl"){
				export_item_data.push(["Image URL", values[i]]);
			}

			if (keys[i]=="footfallRank"){
				export_item_data.push(["Footfall Rank", values[i]]);
			}

			if (keys[i]=="footfallPerc"){
				export_item_data.push(["Footfall Percentage", values[i]]);
			}

			if (keys[i]=="footfallCount"){
				export_item_data.push(["Footfall Count", values[i]]);
			}
			
			if (keys[i]=="visitCount"){
				export_item_data.push(["Visit Count", values[i]]);
			}
			
			if (keys[i]=="purchaseCount"){
				export_item_data.push(["Purchase Count", values[i]]);
			}
			
			if (keys[i]=="cartexitCount"){
				export_item_data.push(["Cartexit Count", values[i]]);
			}
			
		}


		

		var csvString = export_item_data.map(row => row.join(',')).join('\n');
		var a         = document.createElement('a');
		a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
		a.target      = '_blank';
		a.download    = 'Product_'+string_trim(current_item_data.nameStr,20)+'['+current_item_data.itemId+']'+'.csv';
		
		
		
		document.body.appendChild(a);
		a.click();
		
	}
	
	
}













function get_item_timeline(item_id)
{
//	console.log("footfalls.get_item_timeline : item_id :=" +item_id);

	var deferred = new $.Deferred();

	$.ajax({
		type: "POST",
	    url: "itemtimeline/get",	    
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    data:  JSON.stringify( {"itemId": item_id}),
	    success: function(data)
	    {
//	    	console.log("footfalls.get_item_timeline : 1.data :=");
//	    	console.log(data);
	    	
	    	deferred.resolve(data);
	    	
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	           console.log(jqXHR);
	           console.log(textStatus);
	           console.log(errorThrown);
	    }
	    
	});
	
	return deferred.promise();

	
}

















