
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

var streamsList = {};
var selectedStream = null;

var face_recognition_user;
var face_recognition_user_list=[];
var container_id;






function init()
{

    janus_init();

    load_selected_feeds();



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

                                selectedStream= 1000

                                let body =
                                    {
                                        request: "watch",
                                        id: parseInt(selectedStream) || selectedStream,
                                        media: ["1100","1200"]
                                    };

                                streaming.send({ message: body });


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



function load_selected_feeds()
{
    console.log("load_selected_feeds : Started")

    var janus_id = 1100



    $('#camera-list').append($('<div class="col-6 mb-3"><div class="card card-sm h-100">' +
                                 '<div class="card-header">' +
                                    '<div class="d-flex align-items-center">'+
                                        '<h4 class="card-header-title">'+'Camera 01 mid = '+janus_id+'</h4>' +
                                        '<span id="live-feed-bitrate-'+janus_id+'" class="badge bg-soft-danger text-danger ms-2"></span>'+
                                        '<span id="live-feed-resolution-'+janus_id+'" class="badge bg-soft-warning text-warning ms-2"></span>'+
                                    '</div>'+
                                 '</div>' +
                                 '<div class="card-body py-0">' +
                                     '<div class="video_wrapper">' +
                                         '<canvas id="drawCanvas"></canvas>'+
                                         '<video id="live-feed-'+janus_id+'" width="100%" muted controls> <source src="" type="video/mp4"></video>' +
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
                             '</div></div>'));


    janus_id = 1200

    $('#camera-list').append($('<div class="col-6 mb-3"><div class="card card-sm h-100">' +
                                 '<div class="card-header">' +
                                     '<h4 class="card-header-title">'+'Camera 02 mid = '+janus_id+'</h4>' +
                                 '</div>' +
                                 '<div class="card-body py-0">' +
                                     '<div class="video_wrapper">' +
                                         '<canvas id="drawCanvas"></canvas>'+
                                         '<video id="live-feed-'+janus_id+'" width="100%" muted controls> <source src="" type="video/mp4"></video>' +
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
                             '</div></div>'));




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
