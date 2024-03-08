
var select_camera;
var selected_camera_list = [];
var selected_camera_mid = [];
var camera_list_map=[];
var work_place_list_map=[];
var stompClient = null;
var camera_list=[];
var camera_list_temp=[];
var bounding_box_list=[];

var video;
var canvas;
var ctx;

//var janus = null;
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

    janus_init();

    connect_websocket();

    load_process_area_list();
    load_process_area_list_all();

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

                selected_camera_list = data;

            }
        });

    $( ".show_camera_btn" ).click(function()
        {

            if(camera_list.length >= 1)
            {
//                sendAllCameraId();

                load_streaming_cameras();


            }
        }
    );




}

function connect_websocket()
{
    var socket = new SockJS('http://localhost:8080/local-websocket'); // new SockJS('/local-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
//        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/ws_message', function (ws_message) {

            console.log("hi sanil");

            console.log(JSON.parse(ws_message.body));

            showGreeting(JSON.parse(ws_message.body));

        });
    });
}

function showGreeting(message)
{

    console.log( message );

    if(message.data.type == "intruder_alert")
    {
        var current_date = new Date(message.data.time_created);
        var day = current_date.getDate();
        var month = current_date.getMonth()+1;
        var year = current_date.getFullYear();
        var hour = current_date.getHours();
        var min = current_date.getMinutes();
        var ampm = hour >= 12 ? 'pm' : 'am';
        $(".intruder_alert_time_input").text(day +'/'+month +'/'+year +" "+ hour +':'+min + " "+ampm);

    //    $(".camera_name").text(camera_list_map[message.camera_id].name);
        $(".intruder_alert_camera_name").text(camera_list_map[message.data.camera_id].name);
        $(".intruder_alert_workplace_name").text(work_place_list_map[message.data.work_place_id].name);
        $(".alert_type").text("Intruder Alert");
        $(".intruder_alert_person_count").text(message.data.person_count);

        const intruderAlertLiveToast = new bootstrap.Toast(document.querySelector('#intruderAlertLiveToast'))
        intruderAlertLiveToast.show();
    }
    if(message.data.type == "ground_team_alert")
    {
        var current_date = new Date(message.data.time_created);
        var day = current_date.getDate();
        var month = current_date.getMonth()+1;
        var year = current_date.getFullYear();
        var hour = current_date.getHours();
        var min = current_date.getMinutes();
        var ampm = hour >= 12 ? 'pm' : 'am';
        $(".ground_team_alert_time_input").text(day +'/'+month +'/'+year +" "+ hour +':'+min + " "+ampm);

        $(".ground_team_alert_camera_name").text(camera_list_map[message.data.camera_id].name);
        $(".ground_team_alert_workplace_name").text(work_place_list_map[message.data.work_place_id].name);
        $(".alert_type").text("Ground Team Alert");
        $(".ground_team_alert_person_count").text(message.data.person_count);

        const groundTeamAlertLiveToast = new bootstrap.Toast(document.querySelector('#groundTeamAlertLiveToast'))
        groundTeamAlertLiveToast.show();

    }




}


function load_process_area_list()
{
    HSCore.components.HSTomSelect.init('#select-work-place');
    select_work_place = HSCore.components.HSTomSelect.getItem("select-work-place");

    Promise.all([get_process_area()])
			.then(function ([data]){


			    console.log(data);

			    if (data.message=="error"){

                }
                else if (data.message=="not_found"){

                }
                else if (data.message=="success"){

                    work_place_list = data.process_area_list;

                    for(var i=0;i<work_place_list.length;i++)
                    {
                        work_place_list_map[work_place_list[i].id] = work_place_list[i].data;

                    }


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

                            console.log(data);

                            camera_list = [];

                            select_camera.clearOptions();

//                            for(var j=0;j<work_place_list.length;j++)
                            for(var j=0;j<data.length;j++)
                            {

                                for(var i=0; i<camera_list_all.length;i++)
                                {
                                    bounding_box_list=camera_list_all[camera_list_all.length-1].data.bounding_box_list;


                                                    if(camera_list_all[i].data.work_place_id==data[j])
                                                {
                                                                                                                                                                                                                                        camera_list.push(camera_list_all[i]);
                                    }

                                    if(i+1==camera_list_all.length)
                                    {
                                      load_camera_list();

//                                          setTimeout(() => select_camera.setValue(camera_list[0].id), 1000);

                                    }
                                }

                               process_area_obj = work_place_list[j];
                               space_group_list = work_place_list[j].data.space_group_list;

/*
                                if(data==work_place_list[j].id)
                                {


                                }
*/
                            }

                        }
                    });
                }

			});


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


    select_camera.addOption(camera_list);



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


function load_streaming_cameras()
{

    $('#camera-list').empty();



    for(var i=0;i<selected_camera_list.length;i++)
    {

        var selected_camera_list_id=selected_camera_list[i];

        var janus_id = "";

        for(var j=0;j<camera_list.length;j++)
        {

            if(camera_list[j].id == selected_camera_list_id)
            {
               janus_id = camera_list[j].data.janus_id;

               console.log(janus_id);

               selected_camera_mid.push(janus_id.toString());

//                   janus_init_stream("#"+selected_camera_list_id,janus_id);

               console.log(janus_id);

               var newColumn = $('<div class="col-6 mb-3"><div class="card card-sm h-100">' +
                                                                           '<div class="card-header">' +
                                                                             '<h4 class="card-header-title">'+camera_list_map[selected_camera_list_id].name+'</h4>' +
                                   //                                            '<h4 class="card-header-title">'+'Camera 01 mid = '+janus_id+'</h4>' +
                                                                               '<span id="live-feed-bitrate-'+janus_id+'" class="badge bg-soft-danger text-danger ms-2"></span>'+
                                                                               '<span id="live-feed-resolution-'+janus_id+'" class="badge bg-soft-warning text-warning ms-2"></span>'+
                                                                           '</div>' +
                                                                           '<div class="card-body py-0">' +
                                                                               '<div class="video_wrapper">' +
                                                                                   '<canvas id="drawCanvas"></canvas>'+
                                   //                                                '<video id="'+selected_camera_list[i]+'" width="100%" controls><source src="" type="video/mp4"></video>' +
                                                                                   '<video id="live-feed-'+janus_id+'" width="100%" muted controls> <source src="" type="video/mp4"></video>' +
                                                                               '</div>' +
                                                                               '<div style="display: none;">' +
                                                                                   '<h5 class="text-dark"> Number of People Track <span class="badge bg-primary h5 '+selected_camera_list[i]+'person_count ms-2"></span></h5>' +
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

        }

        if(i+1==selected_camera_list.length)
        {

            start_stream();

        }


    }

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
                    console.log("Janus : success");

                    janus.attach(
                        {
                            plugin: "janus.plugin.streaming",
                            opaqueId: opaqueId,
                            success: function(pluginHandle){

                                streaming = pluginHandle;
                                console.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");

/*
                                selectedStream= 1000

                                let body =
                                    {
                                        request: "watch",
                                        id: parseInt(selectedStream) || selectedStream,
                                        media: ["1100","1200"]
                                    };

                                streaming.send({ message: body });
*/


                            },
                            webrtcState: function(on) {
                                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                            },
                            onmessage: function(msg, jsep)
                            {

                                console.log("onmessage: msg = ",msg);
                                console.log("onmessage: jsep = ",jsep);
                                let result = msg["result"];
                                if(jsep)
                                {
                                    streaming
                                        .createAnswer(
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

                                                console.log("onmessage : customizeSdp = ",jsep);
                                                j = jsep
                                                let stereo = (jsep.sdp.indexOf("stereo=1") !== -1);
                                                if(stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                                                    // Make sure that our offer contains stereo too
                                                    jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                                                }
                                            },
                                            success: function(jsep) {
                                                Janus.debug("onmessage: success : Got SDP!", jsep);
                                                let body = { request: "start" };
                                                streaming.send({ message: body, jsep: jsep });
                                            },
                                            error: function(error) {
                                                Janus.error("WebRTC error:", error);
                                            }
                                        });
                                }


                            },
                            onremotetrack: function(track, mid, on, metadata) {

                                console.log("onremotetrack: mid = " + mid);
                                console.log("onremotetrack: on = " + on);
                                console.log(metadata);
                                console.log(track);


                                stream = new MediaStream([track]);

                                console.log(stream);


                                video_id = "#live-feed-"+mid;


                                $(video_id).bind("playing", function (ev)
                                {
                                    console.log("playing =>");
                                    console.log(ev);
                                    if(!bitrateTimer[mid]) {

                                        bitrateTimer[mid] = setInterval(function() {
                                            if(!$("#live-feed-" + mid).get(0))
                                                return;
                                            // Display updated bitrate, if supported
                                            let bitrate = streaming.getBitrate(mid);
                                            console.log("bitrate = "+bitrate);
                                            $('#live-feed-bitrate-'+mid).text(bitrate);
                                            // Check if the resolution changed too
                                            let width = $(video_id).get(0).videoWidth;
                                            let height = $(video_id).get(0).videoHeight;
                                            console.log("width+'x'+height = "+width+'x'+height);

                                            if(width > 0 && height > 0)
                                                $('#live-feed-resolution-'+mid).text('W '+width+' x H '+height);

                                        }, 1000);

                                    }


                                });

                                console.log("attachMediaStream ....");

                                Janus.attachMediaStream($(video_id).get(0), stream);
                                $(video_id ).get(0).play();
                                $(video_id ).get(0).volume = 1;

                            }


                        });
                },

            });


    }});




}


function janus_init_stream(selected_camera_list_id,janus_id)
{
    console.log(selected_camera_list_id+","+janus_id);

    var streaming_plugin = null;

    // Create session
    var janus = new Janus(
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

                            streaming_plugin = pluginHandle;
                            console.log("Plugin attached! (" + streaming_plugin.getPlugin() + ", id=" + streaming_plugin.getId() + ")");

                            console.log("Selected video id #" + janus_id);
                            let body = { request: "watch", id: parseInt(janus_id) || janus_id };
                            streaming_plugin.send({ message: body });
//                            getStreamInfo();

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
                                streaming_plugin.createAnswer(
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
                                            streaming_plugin.send({ message: body, jsep: jsep });
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
                                        if(!$(selected_camera_list_id ).get(0))
                                            return;
                                        // Display updated bitrate, if supported
                                        let bitrate = streaming_plugin.getBitrate(mid);

                                        // Check if the resolution changed too
                                        let width = $(selected_camera_list_id ).get(0).videoWidth;
                                        let height = $(selected_camera_list_id).get(0).videoHeight;

                                    }, 1000);
                                }


                            console.log(stream);


                            $(selected_camera_list_id).bind("playing", function (ev)
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

                            Janus.attachMediaStream($(selected_camera_list_id).get(0), stream);
                            $(selected_camera_list_id ).get(0).play();
                            $(selected_camera_list_id ).get(0).volume = 1;

                        }


                    });
            },

        });



}

function start_stream()
{

    selectedStream= 1000

    let body =
        {
            request: "watch",
            id: parseInt(selectedStream) || selectedStream,
            media: selected_camera_mid
        };

    streaming.send({ message: body });


}


function sendAllCameraId()
{
    var deferred = new $.Deferred();

    var data = {'message':'error'};



    $.ajax({
        type: "POST",
        url: "user/streaming_camera/send/all/id",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
	    data:  JSON.stringify({

	    	"client_id" : "client_01",
	    	"camera_id" : selected_camera_list

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
