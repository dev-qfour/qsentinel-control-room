
var select_camera;
var camera_list_map=[];
var stompClient = null;
var camera_list=[];
var camera_list_temp=[];
var bounding_box_list=[];

var video;
var canvas;
var ctx;

var face_recognition_user;
var face_recognition_user_list=[];
var container_id;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('http://localhost:8080/local-websocket'); // new SockJS('/local-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/ws_message', function (ws_message) {

            console.log(JSON.parse(ws_message.body));
            console.log(JSON.parse(ws_message.body).type);

            showGreeting(JSON.parse(ws_message.body));

        });
    });
}


function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}


function showGreeting(message) {

    console.log( message );

    $("#greetings").append("<tr><td><div>" + message + "</div></td></tr>");


    if(message.data.person_count>0)
    {
        var current_date = new Date(message.time_created);
        var day = current_date.getDate();
        var month = current_date.getMonth()+1;
        var year = current_date.getFullYear();
        var hour = current_date.getHours();
        var min = current_date.getMinutes();
        var ampm = hour >= 12 ? 'pm' : 'am';
        $(".time_input").text(day +'/'+month +'/'+year +" "+ hour +':'+min + " "+ampm);

        $(".camera_name").text(camera_list_map[message.pn_id].name);
        //$("#workSpace-id-input").text(camera_list_map[message.pn_id].work_place_id);
        $(".person_count").text(message.data.person_count);
        $("."+message.pn_id+"person_count").text(message.data.person_count);
        $("."+message.pn_id+"person_count").closest("div").show();
                $("."+message.pn_id+"person_count").closest(".card-header").addClass("bg-soft-danger text-danger");
        $("."+message.pn_id+"person_count").closest(".card-body").addClass("bg-soft-danger text-danger");

        const liveToast = new bootstrap.Toast(document.querySelector('#liveToast'))
        liveToast.show();
    }
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});


function init()
{
    connect();

    load_process_area_list();

    load_process_area_list_all();

    draw_line_chart();

    draw_pie_chart();


}


function load_process_area_list()
{
    HSCore.components.HSTomSelect.init('#select-work-place');
    var select_work_place = HSCore.components.HSTomSelect.getItem("select-work-place");

    Promise.all([get_process_area()])
			.then(function ([data]){


			    console.log(data);

			    if (data.message=="error"){

                }
                else if (data.message=="not_found"){

                }
                else if (data.message=="success"){

                    work_place_list = data.process_area_list;
                    select_work_place.clearOptions();

                     if (select_work_place) {
                       select_work_place.destroy();
                     }


                    new TomSelect('#select-work-place',{
                        valueField: 'id',
                        searchField: 'id',
                        options: work_place_list,
                        render: {
                            option: function(data, escape) {


                                return '<div>' +
                                        '<span class="text-capitalize" style="display: block;">' + escape(data.data.name) + '</span>' +
                                        '<span class="text-capitalize" style="font-size: 12px;display: block; color: #a0a0a0;">' +"Id : "+escape(data.data.id)+"&nbsp;&nbsp; Name: "+escape(data.data.name)+'</span>' +
                                    '</div>';
                            },
                            item: function(data, escape) {
                                return '<div title="' + escape(data.data.id) + '">' + escape(data.data.name) + '</div>';  }
                        },
                        onChange : function(data) {

                            for(var j=0;j<work_place_list.length;j++)
                            {
                                if(data==work_place_list[j].id)
                                {
                                    for(var i=0; i<camera_list_all.length;i++)
                                    {
                                        bounding_box_list=camera_list_all[camera_list_all.length-1].data.bounding_box_list;

                                        if(camera_list_all[i].data.work_place_id==work_place_list[j].id)
                                        {
                                            camera_list.push(camera_list_all[i]);
                                        }

                                        if(i+1==camera_list_all.length)
                                        {
                                          load_camera_list();

                                          load_incidence_report();

                                          setTimeout(() => select_camera.setValue(camera_list[0].id), 1000);

                                        }
                                    }

                                   process_area_obj = work_place_list[j];
                                   space_group_list = work_place_list[j].data.space_group_list;

                                }
                            }

                        }
                    });
                }

			});


}

function get_process_area()
{
    var deferred = new $.Deferred();

    var data = {'message':'error'};



    $.ajax({
        type: "POST",
        url: "user/space_management/get/all",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
	    data:  JSON.stringify({

	    	"process_area_id" : "pa_dem_Work_kC",
	    }),
        success: function(data)
        {

            console.log(data);
            deferred.resolve(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {


            console.log("error ");

            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            deferred.resolve(data);
        }
    });

    return deferred.promise();
}

function load_process_area_list_all()
{
    Promise.all([get_process_area_all()])
			.then(function ([data]){


			    console.log(data);

			    if (data.message=="error"){

                }
                else if (data.message=="not_found"){

                }
                else if (data.message=="success"){

                    camera_list_all = data.process_area_list;

                    for(var i=0;i<camera_list_all.length;i++)
                    {
                        camera_list_map[camera_list_all[i].id] = camera_list_all[i].data;

                        if(i+1==camera_list_all.length)
                        {
                            //load_camera_list();
                        }
                    }

                }

			});

}

function load_camera_list()
{

    select_camera = new TomSelect('#select-camera',{
        valueField: 'id',
        searchField: 'id',
        options: camera_list,
        render: {
            option: function(data, escape) {
                return '<div>' +
                        '<span class="text-capitalize" style="display: block;">' + escape(data.data.name) + '</span>' +
                        '<span class="text-capitalize" style="font-size: 12px;display: block; color: #a0a0a0;">' +"Id : "+escape(data.data.id)+'</span>' +
                    '</div>';
            },
            item: function(data, escape) {
                return '<div title="' + escape(data.data.id) + '">' + escape(data.data.name) + '</div>';  }
        },
        onChange : function(data) {

            //$('#camera-list').empty();

/*
            var currentColumns = $('#camera-list .col-6');

            // Loop through each column
            currentColumns.each(function () {
                // Get the video ID associated with the column
                var columnVideoId = $(this).find('.card-body video').attr('id');

                // Check if the video ID is not in the selected options
                if (data.indexOf(columnVideoId) === -1) {
                    // If not in selected options, remove the column
                    $(this).remove();
                }
            });


            for(var i=0;i<data.length;i++)
            {
                var data_id=data[i];
                if ($('#camera-list .col-6:has(video#' + data_id + ')').length === 0)
                {
                    if(i==0)
                    {

                          var newColumn = $('<div class="col-6 mb-3"><div class="card card-sm h-100">' +
                                                '<div class="card-header">' +
                                                    '<h4 class="card-header-title">'+camera_list_map[data_id].name+'</h4>' +
                                                '</div>' +
                                                '<div class="card-body py-0">' +
                                                    '<div class="video_wrapper">' +
                                                        '<canvas id="drawCanvas"></canvas>'+
                                                        '<video id="'+data[i]+'" width="100%" controls><source src="" type="video/mp4"></video>' +
                                                    '</div>' +
                                                    '<div style="display: none;">' +
                                                        '<h5 class="text-dark"> Number of People Track <span class="badge bg-primary h5 '+data[i]+'person_count ms-2"></span></h5>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="card-footer">' +
                                                    '<div class="row align-items-center">' +
                                                        '<div class="col">' +
                                                            //'<button type="button" class="btn btn-soft-warning">Alarm</button>' +
                                                        '</div>' +
                                                        '<div class="col-auto">' +
                                                            '<button type="button" class="btn btn-soft-danger" data-bs-toggle="modal" data-bs-target="#warning-model">Alert Central</button>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div></div>');

                            $('#camera-list').append(newColumn);

                    }else{

                         var newColumn = $('<div class="col-6 mb-3"><div class="card card-sm h-100">' +
                                                        '<div class="card-header">' +
                                                            '<h4 class="card-header-title">'+camera_list_map[data_id].name+'</h4>' +
                                                        '</div>' +
                                                        '<div class="card-body py-0">' +
                                                            '<video id="'+data[i]+'" width="100%" controls><source src="" type="video/mp4"></video>' +
                                                            '<div style="display: none;">' +
                                                                '<h5 class="text-dark"> Number of People Track <span class="badge bg-primary h5 '+data[i]+'person_count ms-2"></span></h5>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div class="card-footer">' +
                                                            '<div class="row align-items-center">' +
                                                                '<div class="col">' +
                                                                    //'<button type="button" class="btn btn-soft-warning">Alarm</button>' +
                                                                '</div>' +
                                                                '<div class="col-auto">' +
                                                                    '<button type="button" class="btn btn-soft-danger" data-bs-toggle="modal" data-bs-target="#warning-model">Alert Central</button>' +
                                                                '</div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                    '</div></div>');

                    $('#camera-list').append(newColumn);

                    }

                    var video = document.getElementById(data_id);
                    video.addEventListener('dblclick', function () {
                        if (video.requestFullscreen) {
                            video.requestFullscreen();
                        } else if (video.mozRequestFullScreen) { */
/* Firefox *//*

                            video.mozRequestFullScreen();
                        } else if (video.webkitRequestFullscreen) { */
/* Chrome, Safari, and Opera *//*

                            video.webkitRequestFullscreen();
                        } else if (video.msRequestFullscreen) { */
/* IE/Edge *//*

                            video.msRequestFullscreen();
                        }
                    });

                }

                if(i+1==data.length)
                {
                    var video = document.getElementById(camera_list[0].id);
                    var width = $("#" + camera_list[0].id).width();
                    var height = $("#" + camera_list[0].id).height();
                    video.src = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
                    video.load();
                    video.play();
                    var canvas = document.getElementById('drawCanvas');
                    canvas.width = width;
                    canvas.height = height;
                    var scaleX = width / camera_list_all[camera_list_all.length-1].data.image_width;
                    var scaleY = height / camera_list_all[camera_list_all.length-1].data.image_height;

                    var ctx = canvas.getContext('2d');
                    for (var i = 0; i < bounding_box_list.length; i++) {
                        var x = bounding_box_list[i].x * scaleX;
                        var y = bounding_box_list[i].y * scaleY;
                        var width = bounding_box_list[i].width * scaleX;
                        var height = bounding_box_list[i].height * scaleY;

                        ctx.globalAlpha = 0.5;
                        ctx.fillStyle = "green";
                        ctx.fillRect(x, y, width, height);
                        ctx.globalAlpha = 1.0;


                        ctx.strokeStyle = 'rgba(116, 219, 96)';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x, y, width, height);
                    }






                      */
/*video.addEventListener('play', function() {
                        var width = video.width;
                        var height = video.height;

                        function drawCanvas() {

                            rect = $(".video_wrapper")[0].getBoundingClientRect();
                                canvas.width = width;
                                canvas.height = height;

                                for (var i=0; i<bounding_box_list.length; i++)
                                {
                                    ctx.strokeStyle = 'rgba(0,100,225)';
                                    ctx.lineWidth = 2;
                                    var x = bounding_box_list[i].x/1;
                                    var y = bounding_box_list[i].y/1;
                                    var width = bounding_box_list[i].width/1;
                                    var height = bounding_box_list[i].height/1;
                                    ctx.strokeRect(x, y, width, height);

                                }
                        }

                        drawCanvas();
                    });*//*

                }


            }

*/

        }
    });

}



function get_process_area_all()
{
    var deferred = new $.Deferred();

    var data = {'message':'error'};

    $.ajax({
        type: "POST",
        url: "user/space_management/get/all",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
	    data:  JSON.stringify({

	    	"process_area_id" : area_id,
	    }),
        success: function(data)
        {

            console.log(data);
            deferred.resolve(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {


            console.log("error ");

            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            deferred.resolve(data);
        }
    });

    return deferred.promise();
}

function get_all_incidence_report()
{
    var deferred = new $.Deferred();

    var data = {'message':'error'};




    $.ajax({
        type: "POST",
        url: "user/space_management/get/all",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
	    data:  JSON.stringify({

	    	"process_area_id" : "sys_pa_incidence_report_1",
	    }),
        success: function(data)
        {

            console.log(data);
            deferred.resolve(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {


            console.log("error ");

            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

            deferred.resolve(data);
        }
    });

    return deferred.promise();
}

function draw_line_chart()
{
    height = 450;

    width = 800;

    margin = ({top:20, right:30, bottom:30, left:40})

    data_raw = ([
           {timestamp: 1708831800000, person: 10},
           {timestamp: 1708835400000, person: 8},
           {timestamp: 1708839000000, person: 7},
           {timestamp: 1708842600000, person: 11},
           {timestamp: 1708846200000, person: 8},
           {timestamp: 1708849800000, person: 10},
           {timestamp: 1708853400000, person: 9},
           {timestamp: 1708857000000, person: 10},
           {timestamp: 1708860600000, person: 8},
           {timestamp: 1708864200000, person: 7},
           {timestamp: 1708867800000, person: 9}
        ])

    dateParser = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

    data = data_raw.map(({timestamp, person}) => ({date: dateParser(d3.isoFormat(new Date(timestamp))), person: person}))

    console.log(data);

    var svg = d3.select("svg")
          .attr("viewBox", [0, 0, width, height]);


    x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right])

    y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.person)]).nice()
        .range([height - margin.bottom, margin.top])

    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))


    line = d3.line()
        .defined(d => !isNaN(d.person))
        .x(d => x(d.date))
        .y(d => y(d.person))


    svg.append("g")
          .call(xAxis);

      svg.append("g")
          .call(yAxis);

      svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("d", line);





      return svg.node();



}


function draw_pie_chart()
{
    HSCore.components.HSChartJS.init(document.querySelector('.js-chartjs-doughnut-half'),

        {
           "type": "doughnut",

            "data": {
                "labels": ["Visits", "Purchases", "Cart Exits"],
                "datasets": [{
                    "data": [20, 10, 15],
                    "backgroundColor": ["#377dff", "#00c9a7", "#ed4c78"],
                    "borderWidth": 4,
                    "hoverBorderColor": "#ffffff"
                }]
            },

            "options": {
                   tooltips: {
                     postfix: ""
                   },
                   cutoutPercentage: 85,
                   rotation: 1 * Math.PI,
                   circumference: 1 * Math.PI
            }
        }


    );

    $(".weekly_visit_perc").text( 10  );
    $(".weekly_purchase_perc").text( 20 );
    $(".weekly_cartexit_perc").text( 30);


}

function load_incidence_report()
{

    Promise.all([get_all_incidence_report()])
            .then(function ([data]){

                console.log(data);

                if (data.message=="error"){

                }
                else if (data.message=="not_found"){

                }
                else if (data.message=="success"){

                    incidence_report_list = data.process_area_list;

                    incidence_report_list_1 = [];

                    console.log(camera_list);

                    for(var j=0;j<incidence_report_list.length;j++)
                    {

                        for(var i=0; i<camera_list.length;i++)
                        {
                            console.log("here");

                            if(camera_list[i].id==incidence_report_list[j].data.camera_id)
                            {
                                incidence_report_list_1.push(incidence_report_list[j]);
                            }

                            if(i+1==camera_list.length)
                            {
                              console.log(incidence_report_list_1);

                            }
                        }

                    }


                    $(".no_of_incidences").text(incidence_report_list.length);
                    $(".avg_people_detected").text("9");
                    $(".raised_alarm_count").text("28");

                    draw_data_table();
                }

            });

}


function draw_data_table()
{

    $(".table-loading").hide();

    HSCore.components.HSDatatables.init('#datatable-incidence-report',{
            "data": incidence_report_list,
            "order": [],
            "isResponsive": false,
            "isShowPaging": true,
            "pagination": "datatableWithPaginationPagination",
            "search": "#datatableWithSearchInput",
            "columnDefs": [{
                            "targets": 3,
                            "type": 'date'
                        }],
            "columns": [
                   {
                       title:"Incidence Id",
                       data: "id",
                       class:"table-col-id",
                       render: function(data, type, row, meta) {
                           return  '<span class="text-capitalize font-monospace mb-0">#'+data+'</span>';
                       }

                   },
                   {
                       title:"Incidence Type",
                       data: "incidence_type",
                       render: function(data, type, row, meta) {
                           return  '<span class="font-monospace text-primary">'+row.data.incidence_type+'</span>';
                       }

                   },
                   {
                      title:"status",
                      data: "status",
                      render: function(data, type, row, meta) {
                          if(row.data.status=="RESOLVE")
                          {
                              return '<span class="badge bg-soft-success text-success"><span class="legend-indicator bg-success"></span>'+row.data.status+'</span>';
                          }
                          if(row.data.status=="PENDING")
                          {
                              return  '<span class="badge bg-soft-danger text-danger"><span class="legend-indicator bg-danger"></span>'+row.data.status+'</span>';
                          }
                          else
                          {
                              return  '<span class="badge bg-soft-warning text-warning"><span class="legend-indicator bg-warning"></span>'+row.data.status+'</span>';
                          }
                      }

                   },
                   {
                       title:"Create Date",
                       data: "time",
                       render: function(data, type, row, meta) {

                           var current_date = new Date(row.time_created.time_in_millisec);

                           var day = current_date.getDate();

                           var month = current_date.getMonth()+1;

                           var year = current_date.getFullYear();

                           var hour = current_date.getHours();
                           var min = current_date.getMinutes();
                           var ampm = hour >= 12 ? 'pm' : 'am';

                           return type === 'sort' ? data : '<div class="d-flex flex-column">'+
                                                             '<div class="d-block h5 mb-0" >'+
                                                                 day +'/'+month +'/'+year +
                                                             '</div>'+
                                                             '<div class="d-block fs-5" >'+
                                                                 hour +':'+min + " "+ampm+
                                                             '</div>'+
                                                           '</div>';
                       }
                   },
                 {
                    render: function(data, type, row, meta) {
                        return  '<button id="edit-button" type="button" class="btn btn-white btn-sm"><i class="bi-pencil me-1"></i>Read Report</button>';
                    }

                 },
               {
                  render: function(data, type, row, meta) {
                      return  '<button id="play-button" type="button" class="btn btn-white btn-sm"><i class="bi-eye-fill me-1"></i>View Video</button>';
                  }

               }

           ]

        });

    $(".dataTables_empty").text("No work place data available in table");
    datatable_process_area = HSCore.components.HSDatatables.getItem('datatable-incidence-report');

    $('#datatable-incidence-report tbody').on('click', '#play-button', function () {

        data = datatable_process_area.row($(this).closest('tr')).data();

        //console.log("http://localhost:8080/user/space_management/file/"+data.data.url_input);
        //$("#video-temp-src").attr("src", "http://localhost:8080/user/space_management/file/"+data.data.url_input);
        //$("#video-temp-src").attr("src", "http://localhost:8080/user/space_management/file/qsens-image-processing/qsentinel/demo_client/pn_cyl_102/demo_client.pn_cyl_102.29-01-2024.18-11-55.mp4");
        $("#play-video-model").modal('show');

        var video = document.getElementById('video-temp');
            video.src = "http://localhost:8080/user/space_management/file/"+data.data.url_input;
            video.load(); // Optional, you can remove this line depending on your use case
            video.play();
    });


    $('#datatable-incidence-report tbody').on('click', '#edit-button', function () {

        console.log(datatable_process_area.row($(this).closest('tr')));

        _url_id = datatable_process_area.row($(this).closest('tr')).data().id;

        var report_data = datatable_process_area.row($(this).closest('tr')).data();
        var current_date = new Date(report_data.time_created.time_in_millisec);
        var day = current_date.getDate();
        var month = current_date.getMonth()+1;
        var year = current_date.getFullYear();
        var hour = current_date.getHours();
        var min = current_date.getMinutes();
        var ampm = hour >= 12 ? 'pm' : 'am';

        $("#date-input").val(day +'/'+month +'/'+year );
        $("#time-input").val(hour +':'+min + " "+ampm);
        $("#id-input").val(report_data.id);
        $("#name-input").val(report_data.data.incidence_name);
        $("#camera-id-input").val(report_data.data.camera_id);
        $("#camera-name-input").val(report_data.data.camera_name);
        $("#supervisor-input").val(report_data.data.supervisor);
        $("#guard-on-duty-input").val(report_data.data.guard_on_duty);
        select_status.setValue(report_data.data.status);
        select_incidence_type.setValue("human_detected");

        $("#incidence-report-model").modal('show');

    });

}



function update_page_breadcrumb()
{
    console.log("in update_page_breadcrumb");

    console.log(path_js);
    console.log(category);
    console.log(module_name);
    console.log(system_name);

    if(system_name == null)
    {
        $("#page-breadcrumb .breadcrumb").append(
        '<li class="breadcrumb-item"><a class="breadcrumb-link" href="./">Home</a></li>'+
        '<li class="breadcrumb-item"><a id="category_level" class="breadcrumb-link" href="./user/modules">Module</a></li>'+
        '<li class="breadcrumb-item active" aria-current="page" id="module_name">'+module_name+'</li>'
        );

    }
    else
    {
        $("#page-breadcrumb .breadcrumb").append(
        '<li class="breadcrumb-item"><a class="breadcrumb-link" href="./">Home</a></li>'+
        '<li class="breadcrumb-item"><a id="category_level" class="breadcrumb-link" href="./">System</a></li>'+
        '<li class="breadcrumb-item"><a id="system_name" class="breadcrumb-link" href="./user/systems">'+system_name+'</a></li>'+
        '<li class="breadcrumb-item active" aria-current="page" id="module_name">'+module_name+'</li>'
        );

    }

}
