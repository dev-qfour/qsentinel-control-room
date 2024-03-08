
var incidence_report_list=[];
var select_incidence_type;
var select_status;
function init()
{

    draw_line_chart();

    load_incidence_report();

    select_status = new TomSelect('#select-status',{
                valueField: 'value',
                searchField: 'value',
                multiple: true,
                options: [
                             { value: 'RESOLVE', text: 'RESOLVE' },
                             { value: 'PENDING', text: 'PENDING' },
                             { value: 'IN_PROCESS', text: 'IN-PROCESS' }
                         ],
                onChange : function(data) {

                }
            });

    select_incidence_type = new TomSelect('#select-incidence-type',{
                valueField: 'value',
                searchField: 'value',
                multiple: true,
                options: [
                             { value: 'human_detected', text: 'Human Detected' },
                             { value: 'security', text: 'Security' },
                             { value: 'safety', text: 'Safety' }
                         ],
                onChange : function(data) {

                }
            });


}

function draw_line_chart()
{
    height = 300;

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

function load_incidence_report()
{
/*    var obj1={
    "id": "jgv7-gf8v",
    "incidence_name": "Slips",
    "process_area_id": "sys_pa_incidence_report",
    "camera_id": "MedP-2144",
    "camera_name": "Camera BF1",
    "status": "RESOLVE",
    "supervisor": "Rahul Gupta",
    "guard_on_duty": "Rajiv Dapode",
    "incidence_type": "Human Detected",
    "time": 1704791179752,
     };
    var obj2={
    "id": "kxgf-c6gn",
    "incidence_name": "Trips",
    "area": "store area",
    "camera": "camera-B12",
    "status": "PENDING",
    "supervisor": "Rahul Gupta",
    "guard_on_duty": "Rajiv Dapode",
    "incidence_type": "Human Group Detected",
    "time": 1704791179752,
    };
    var obj3={
    "id": "f547-gf8v",
    "incidence_name": "Falls",
    "area": "store area",
    "camera": "camera-B12",
    "status": "IN_PROCESS",
    "supervisor": "Rahul Gupta",
    "guard_on_duty": "Rajiv Dapode",
    "incidence_type": "Human Detected",
    "time": 1704791179752,
    };

    incidence_report_list.push(obj1);
    incidence_report_list.push(obj2);
    incidence_report_list.push(obj3);*/

    Promise.all([get_process_area_all()])
            .then(function ([data]){

                console.log(data);

                if (data.message=="error"){

                }
                else if (data.message=="not_found"){

                }
                else if (data.message=="success"){

                    incidence_report_list = data.process_area_list;
                    $(".no_of_incidences").text(incidence_report_list.length);
                    $(".avg_people_detected").text("9");
                    $(".raised_alarm_count").text("28");

                    draw_data_table();
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

	    	"process_area_id" : "sys_pa_incidence_report",
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
