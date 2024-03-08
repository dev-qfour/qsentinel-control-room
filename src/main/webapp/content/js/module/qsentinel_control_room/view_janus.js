
var select_camera;
var camera_list_map=[];
var stompClient = null;
var camera_list=[];
var camera_list_temp=[];
var bounding_box_list=[];

var video;
var canvas;
var ctx;


var janus = null;
var streaming = null;
var opaqueId = "streamingtest-"+Janus.randomString(12);

var remoteTracks = {}, remoteVideos = 0, dataMid = null;
var bitrateTimer = {};

var simulcastStarted = {}, svcStarted = {};

var  streamsList = {};
var  selectedStream = null;

var face_recognition_user;
var face_recognition_user_list=[];
var container_id;






function init()
{
//    connect();
    janus_init();

    load_process_area_list();
    load_process_area_list_all();


}





function janus_init()
{

    Janus.init({debug: "all", callback: function() {

        console.log("Janus.init");

        if(!Janus.isWebrtcSupported()) {
            bootbox.alert("No WebRTC support... ");
            return;
        }

        // Create session
        janus = new Janus(
            {
                server: server,
                iceServers: iceServers,
                success: function() {
                    console.log("success");

                    janus.attach(
                        {
                            plugin: "janus.plugin.streaming",
                            opaqueId: opaqueId,
                            success: function(pluginHandle){

                                streaming = pluginHandle;
                                console.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");

//                                updateStreamsList();


                            },
                            webrtcState: function(on) {
                                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                            },
                            onmessage: function(msg, jsep)
                            {

                                console.log("onmessage: msg = ",msg);
                                console.log("onmessage: jsep = ",jsep);
                                let result = msg["result"];
                                if(result) {

                                    if(result["status"]) {
                                        let status = result["status"];
                                        if(status === 'starting')
                                            $('#status').removeClass('hide').text("Starting, please wait...").removeClass('hide');
                                        else if(status === 'started')
                                            $('#status').removeClass('hide').text("Started").removeClass('hide');
                                        else if(status === 'stopped')
                                            stopStream();
                                    }
                                    else if(msg["streaming"] === "event") {
                                        // Does this event refer to a mid in particular?
                                        let mid = result["mid"] ? result["mid"] : "0";
                                        // Is simulcast in place?
                                        let substream = result["substream"];
                                        let temporal = result["temporal"];
                                        if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                                            if(!simulcastStarted[mid]) {
                                                simulcastStarted[mid] = true;
                                                addSimulcastButtons(mid);
                                            }
                                            // We just received notice that there's been a switch, update the buttons
                                            updateSimulcastButtons(mid, substream, temporal);
                                        }
                                        // Is VP9/SVC in place?
                                        let spatial = result["spatial_layer"];
                                        temporal = result["temporal_layer"];
                                        if((spatial !== null && spatial !== undefined) || (temporal !== null && temporal !== undefined)) {
                                            if(!svcStarted[mid]) {
                                                svcStarted[mid] = true;
                                                addSvcButtons(mid);
                                            }
                                            // We just received notice that there's been a switch, update the buttons
                                            updateSvcButtons(mid, spatial, temporal);
                                        }
                                    }
                                }
                                else if(msg["error"]) {
                                    bootbox.alert(msg["error"]);
                                    stopStream();
                                    return;
                                }
                                if(jsep)
                                {
                                    console.log("Handling SDP as well...", jsep);
                                    let stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
                                    // Offer from the plugin, let's answer
                                    streaming.createAnswer(
                                        {
                                            jsep: jsep,
                                            // We only specify data channels here, as this way in
                                            // case they were offered we'll enable them. Since we
                                            // don't mention audio or video tracks, we autoaccept them
                                            // as recvonly (since we won't capture anything ourselves)
                                            tracks: [
                                                { type: 'data' }
                                            ],
                                            customizeSdp: function(jsep) {
                                                if(stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                                                    // Make sure that our offer contains stereo too
                                                    jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                                                }
                                            },
                                            success: function(jsep) {
                                                Janus.debug("Got SDP!", jsep);
                                                let body = { request: "start" };
                                                streaming.send({ message: body, jsep: jsep });
                                                $('#watch').html("Stop").removeAttr('disabled').unbind('click').click(stopStream);
                                            },
                                            error: function(error) {
                                                Janus.error("WebRTC error:", error);
                                                bootbox.alert("WebRTC error... " + error.message);
                                            }
                                        });
                                }

                            },
                            onremotetrack: function(track, mid, on, metadata) {

                                if (remoteVideos>0)
                                {
                                    return;
                                }

                                console.log("onremotetrack: mid = " + mid);
                                console.log("onremotetrack: on = " + on);
                                console.log(metadata);
                                console.log(track);


                                remoteVideos++
                                stream = new MediaStream([track]);
                                remoteTracks[mid] = stream;

                                if(!bitrateTimer[mid]) {
                                        bitrateTimer[mid] = setInterval(function() {
                                            if(!$("#MedP-2144" ).get(0))
                                                return;
                                            // Display updated bitrate, if supported
                                            let bitrate = streaming.getBitrate(mid);

                                            // Check if the resolution changed too
                                            let width = $("#MedP-2144" ).get(0).videoWidth;
                                            let height = $("#MedP-2144").get(0).videoHeight;

                                        }, 1000);
                                    }


                                console.log(stream);


                                $("#MedP-2144").bind("playing", function (ev)
                                {
                                    console.log("playing =>");
                                    console.log(ev);
                                    if(!this.videoWidth)
                                        return;
                                    $('#'+ev.target.id).removeClass('hide');
                                    let width = this.videoWidth;
                                    let height = this.videoHeight;
                                    $('#curres'+mid).removeClass('hide').text(width+'x'+height).removeClass('hide');
                                    if(Janus.webRTCAdapter.browserDetails.browser === "firefox") {
                                        // Firefox Stable has a bug: width and height are not immediately available after a playing
                                        setTimeout(function() {
                                            let width = $('#'+ev.target.id).get(0).videoWidth;
                                            let height = $('#'+ev.target.id).get(0).videoHeight;
                                        }, 2000);
                                    }
                                });

                                console.log("attachMediaStream ....");

                                Janus.attachMediaStream($('#MedP-2144').get(0), stream);
                                $('#MedP-2144' ).get(0).play();
                                $('#MedP-2144' ).get(0).volume = 1;

                            }


                        });
                },

            });


    }});




}


function startStream()
{

    console.log("Selected video id #" + selectedStream);
	let body = { request: "watch", id: parseInt(selectedStream) || selectedStream };
    streaming.send({ message: body });
    getStreamInfo();

}


function getStreamInfo() {

	if(!selectedStream || !streamsList[selectedStream])
	{
	    console.log("exiting");

	    return;
	}


	// Send a request for more info on the mountpoint we subscribed to
	let body = { request: "info", id: parseInt(selectedStream) || selectedStream };
	streaming.send({ message: body, success: function(result) {
	    console.log(result);
	    console.log(result.info.metadata);
	    console.log(escapeXmlTags(result.info.metadata));

		if(result && result.info && result.info.metadata) {
			$('#metadata').html(escapeXmlTags(result.info.metadata));
			$('#info').removeClass('hide');
		}
	}});
}




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
    var socket = new SockJS('http://192.168.1.72:8080/local-websocket'); // new SockJS('/local-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/ws_message', function (ws_message) {

            console.log(JSON.parse(ws_message.body));
            console.log(JSON.parse(ws_message.body).type);

            if(JSON.parse(ws_message.body).type=="face_recognition")
            {
                container_id = JSON.parse(ws_message.body).data.user_id;
                load_container();
            }else if(JSON.parse(ws_message.body).type=="person_detection")
            {
                showGreeting(JSON.parse(ws_message.body));
            }

        });
    });
}

function load_container()
{
    Promise.all([get_container()])
        .then(function ([data]){


            console.log(data);

            if (data.message=="error"){

            }
            else if (data.message=="not_found"){

            }
            else if (data.message=="success"){

                container = data.container;
                face_recognition_user = container.data;
                face_recognition_user_list.push(container);

                draw_data_table();

            }

        });

}

function draw_data_table()
{

    $(".table-loading").hide();

    HSCore.components.HSDatatables.init('#datatable-face-recognition',{
            "data": face_recognition_user_list,
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
                                title:"ID",
                                data: "id",
                                class:"table-col-id",
                                render: function(data, type, row, meta) {

                                    if(row.data.image_list[0]!=undefined)
                                     {
                                        var src="http://localhost:8081/user/face_recognition_user/file/qsens-image-processing/"+(row.data.image_list[row.data.image_list.length-1].image_url).replace('.jpg', '');
                                        return  '<div class="avatar avatar-circle"><img class="avatar-img" src="'+src+'" alt="Image Description"></div> <span class="text-uppercase font-monospace text-body mb-0">#'+data+'</span>';
                                     }else{

                                        return  '<div class="avatar avatar-soft-primary avatar-circle"><span class="avatar-initials">.</span></div><span class="text-uppercase font-monospace text-body mb-0">#'+data+'</span>';
                                     }

                                    //return  '<span class="text-uppercase font-monospace text-body mb-0">#'+data+'</span>';
                                }

                            },
                            {
                                title:"User Name",
                                data: "name",
                                render: function(data, type, row, meta) {
                                    return  '<span class="text-capitalize font-monospace mb-0">'+row.data.name+" "+row.data.surname+'</span>';
                                }

                            },
                            {
                                title:"Phone",
                                data: "phone",
                                render: function(data, type, row, meta) {
                                    return  '<span class="text-capitalize font-monospace mb-0">'+row.data.phone+'</span>';
                                }

                            },
                            {
                                title:"State",
                                data: "state",
                                render: function(data, type, row, meta) {
                                    return  '<span class="text-capitalize font-monospace mb-0">'+row.data.state+'</span>';
                                }

                            },
                            {
                                title:"Create Date",
                                data: "time_created",
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
                            }




                    ]

        });


    datatable_container = HSCore.components.HSDatatables.getItem('datatable-face-recognition');




    $('#face-recognition tbody').on('click', 'tr', function () {

        _url_id = datatable_container.row( this ).data().id;

       // window.location.href=window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length-2).join("/")+"/face_recognition_user_info/edit?i="+_url_id;

    });


}

function get_container()
{
    var deferred = new $.Deferred();

    var data = {'message':'error'};



    $.ajax({
        type: "POST",
        url: "user/container/get/by/id",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
	    data:  JSON.stringify({

	    	"id" : container_id,
	    	"area_id": "container",
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





function load_perspective_mapping_image()
{
    rect1 = $(".wrapper")[0].getBoundingClientRect();
/*
    canvas1.width = rect1.width;
    canvas1.height = rect1.height;

    ctx1.translate(0, 0)
    ctx1.scale(1, 1)
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height)

    imageCanvas1.width = rect1.width;
    imageCanvas1.height = rect1.height;

    image_ctx1.translate(0, 0)
    image_ctx1.scale(1, 1)
    image_ctx1.clearRect(0, 0, imageCanvas1.width, imageCanvas1.height);

    image1.onload = function () {
        //image_ctx.drawImage(image,0,0);
        image_ctx1.drawImage(image1, 0, 0, rect1.width, rect1.height);
    };
*/

/*    imageCanvas1.width = image1.width;
    imageCanvas1.height = image1.height;

    image1.onload = function () {
        image_ctx1.drawImage(image1,0,0, image1.width, image1.height);
    };*/

    image1.onload = function () {
        imageCanvas1.width = image1.width;
        imageCanvas1.height = image1.height;
        canvas1.width = image1.width;
        canvas1.height = image1.height;

        for (var i=0; i<bounding_box_list.length; i++)
        {


            console.log(bounding_box_list[i]);

            var x = bounding_box_list[i].x/1;
            var y = bounding_box_list[i].y/1;
            var width = bounding_box_list[i].width/1;
            var height = bounding_box_list[i].height/1;


            ctx1.strokeStyle = 'rgba(0,100,225)';
            ctx1.lineWidth = 2;
            ctx1.strokeRect(x, y, width, height);


        }


        image_ctx1.drawImage(image1, 0, 0, image1.width, image1.height);
    };

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

            console.log(data)

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

                    if (data[i]=="MedP-2144")
                    {
                        console.log("video  exists ");

                        console.log($("#MedP-2144").get(0));

                        if ($("#MedP-2144").length==0)
                        {

                            for(var j=0;j<camera_list.length;j++)
                            {
                                if(camera_list[j].id == data_id)
                                {
                                    selectedStreamId = camera_list[j].data.janus_id;
                                }
                            }


                            selectedStream = "1200";
                            startStream();
                        }

//                        selectedStream = "2144";
//                        startStream();

                    }
                    if(i==0)
                    {

                          var newColumn = $('<div class="col-6 mb-3"><div class="card card-sm h-100">' +
                                                '<div class="card-header">' +
                                                    '<h4 class="card-header-title">'+camera_list_map[data_id].name+'</h4>' +
                                                '</div>' +
                                                '<div class="card-body py-0">' +
                                                    '<div class="video_wrapper">' +
                                                        '<canvas id="drawCanvas"></canvas>'+
                                                        '<video id="'+data[i]+'" width="100%" muted controls> <source src="" type="video/mp4"></video>' +
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

                    }
                    else{

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
                        } else if (video.mozRequestFullScreen) { /* Firefox */
                            video.mozRequestFullScreen();
                        } else if (video.webkitRequestFullscreen) { /* Chrome, Safari, and Opera */
                            video.webkitRequestFullscreen();
                        } else if (video.msRequestFullscreen) { /* IE/Edge */
                            video.msRequestFullscreen();
                        }
                    });

                }

                if(i+1==data.length)
                {
                    var video = document.getElementById(camera_list[0].id);
                    var width = $("#" + camera_list[0].id).width();
                    var height = $("#" + camera_list[0].id).height();
//                    video.src = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
//                    video.load();
//                    video.play();
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
                    });*/
                }


            }


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
