


var month_name_array = new Array();
month_name_array[0] = "Jan";
month_name_array[1] = "Feb";
month_name_array[2] = "Mar";
month_name_array[3] = "Apr";
month_name_array[4] = "May";
month_name_array[5] = "Jun";
month_name_array[6] = "Jul";
month_name_array[7] = "Aug";
month_name_array[8] = "Sep";
month_name_array[9] = "Oct";
month_name_array[10] = "Nov";
month_name_array[11] = "Dec";

var weekday_name_array = new Array();
weekday_name_array[0] = "Sunday";
weekday_name_array[1] = "Monday";
weekday_name_array[2] = "Tuesday";
weekday_name_array[3] = "Wednesday";
weekday_name_array[4] = "Thursday";
weekday_name_array[5] = "Friday";
weekday_name_array[6] = "Saturday";



Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}



Date.prototype.getDayOfYear = function() {


	var start = new Date(this.getFullYear(), 0, 0);
	var diff = this - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);

    return day;
}




Date.prototype.getStdFormat = function() {


    return this.toDateString();
}


var colors = {

		normal : "#fff",
		blue : "#0075ff",
		focus : "#0075ff",
		focus_btn_fg : "#fff",
		focus_btn_bg : "#0075ff",

		primary_node_bg:"#0075ff",
		secondary_node_bg:"#4DF2FF",


		visit:"#377dff",
		purchase:"#00c9a7",
		cartexit:"#ed4c78",

		touch_type : ["#377dff","#00c9a7","#ed4c78"],



};




var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


$("#footer-year").text((new Date()).getFullYear());


function load_userinfo(userinfo)
{
    $("#navbar-user-name").text(userinfo.name+" "+userinfo.family_name);
    $("#navbar-user-email").text(userinfo.email);
}





function random_string(length) {
    	var result = '';
	var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


function random_numeric(length) {
	var result = '';
	var characters = '0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


function create_id() {

	return random_string(4) + "-" + random_numeric(4); //return random_string(4) + "-" + random_numeric(4) + "-" + random_string(4) + "-" + random_numeric(4);

}



function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
};




String.prototype.is_email = function() {

	var regexPattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

	return regexPattern.test(this);

}



function create_barcode_png_dataurl(barcode_str)
{
	var deferred = new $.Deferred();

	barcode_svg_html = $('<svg id="barcode" class="barcode_svg"></svg>').appendTo("body");

	JsBarcode("#barcode", barcode_str, {

//		width: 3.6,
		displayValue: false


	});




	var serializer = new XMLSerializer();
	var barcode_svg_str = serializer.serializeToString(barcode_svg_html[0]);


	var $canvas = $('<canvas/>');
	$canvas.attr('width', '300px');
	$canvas.appendTo('body');

	canvg($canvas.get(0), barcode_svg_str);




	html2canvas($canvas,
				{

					quality: 4,
					onrendered: function (canvas) {

												    var barcode_DataURL = canvas.toDataURL('image/png');

													$canvas.remove();

													$("#barcode").remove();



													deferred.resolve(barcode_DataURL);

												  }
	});




	return deferred.promise();

}



function navbar_create(nav_item_id)
{

    var nav_html =

    '<div id="navbarVerticalMenu" class="nav nav-pills nav-vertical card-navbar-nav">'+

        '<div class="nav-item">'+
            '<a id="nav_home" class="nav-link " href="/" data-placement="left">'+
                '<i class="bi-house-door nav-icon"></i>'+
                '<span class="nav-link-title">Home</span>'+
            '</a>'+
        '</div>'+


        '<span class="dropdown-header mt-4">Camera Select</span>'+
        '<small class="bi-three-dots nav-subtitle-replacer"></small>'+

        '<div id="navbarVerticalMenu_camera_select">'+
            '<div  class="nav-item">'+
                '<div class="nav-item">'+
                    '<a id="nav_camera_select" class="nav-link " href="/user/qsentinel_control_room/camera_select" data-placement="left">'+
                        '<i class="bi bi-camera-reels nav-icon"></i>'+
                        '<span class="nav-link-title">Camera Select</span>'+
                    '</a>'+
                '</div>'+

            '</div>'+

        '</div>'+

        '<span class="dropdown-header mt-4">Incidence Report</span>'+
        '<small class="bi-three-dots nav-subtitle-replacer"></small>'+

        '<div id="navbarVerticalMenu_incidence_report">'+

            '<div class="nav-item">'+
                '<a id="nav_incidence_report" class="nav-link " href="/user/qsentinel_control_room/incidence_report" data-placement="left">'+
                    '<i class="bi-people nav-icon"></i>'+
                    '<span class="nav-link-title">Incidence Report</span>'+
                '</a>'+
            '</div>'+

        '</div>'+

        '<span class="dropdown-header mt-4">Analytics</span>'+
        '<small class="bi-three-dots nav-subtitle-replacer"></small>'+

        '<div id="navbarVerticalMenu_analytics">'+

            '<div class="nav-item">'+
                '<a id="nav_analytics" class="nav-link " href="/user/qsentinel_control_room/analytics" data-placement="left">'+
                    '<i class="bi-people nav-icon"></i>'+
                    '<span class="nav-link-title">Analytics</span>'+
                '</a>'+
            '</div>'+

        '</div>'+






    '</div>'
    ;


	var nav_elem = $(nav_html)

//    nav_elem.find(nav_item_id).find("a").attr("aria-expanded",true);

    //nav_item_id = "#nav_item_inventory_overview"


    nav_elem.find(nav_item_id).addClass("active");

    nav_elem.find(nav_item_id).parent().parent()
        .find("> .nav-link")
        .addClass("active")
        .attr("aria-expanded",true)
        ;


    nav_elem.find(nav_item_id).parent().parent()
        .find("> .nav-collapse")
        .addClass("show")
        ;


    $(".navbar-vertical-content").append(nav_elem);



}




function getPageFooter()
{
    var date=new Date();

    $("#page-footer").text("Copyright \u00A9 "+date.getFullYear()+" | Powered by Quantum Four");
    $("#footer-year").text(date.getFullYear());

}


function draw_svg_tooltip_xy(msg, svg_elem, x_coord, y_coord)
{

    var svg_dim = svg_elem.node().getClientRects()[0];

    $(".tooltip_box").remove();

    var tooltip = $("<div class='tooltip_box toolbox_left_arrow shadow-lg'>"+msg+"</div>")
				    	.css({
							left: svg_dim.x + x_coord,
							top: svg_dim.y + y_coord + window.scrollY,
						})
						.appendTo("body")
						;

    var tooltip_dim = tooltip[0].getClientRects()[0];

    if (window.innerWidth < tooltip_dim.x + tooltip_dim.width + 50)
    {
    	tooltip
    		.css({
    			top: window.scrollY + svg_dim.y + y_coord - tooltip_dim.height/2,
    			left : svg_dim.x + x_coord + 15
    		})
    		.removeClass("toolbox_left_arrow")
    		.addClass("toolbox_right_arrow")
    		;
    }
    else{

    	tooltip
    		.css({
    			top: window.scrollY + svg_dim.y + y_coord - tooltip_dim.height/2,
    			left : svg_dim.x + x_coord + 15,
    		});

    };



};