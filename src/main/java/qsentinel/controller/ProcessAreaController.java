package qsentinel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import qsentinel.model.ProcessArea;
import qsentinel.service.ProcessAreaService;

@RestController
@RequestMapping(value ="/user/process_area")
public class ProcessAreaController {


    private static final Logger LOGGER = LogManager.getLogger(ProcessAreaController.class);

    @Autowired(required = true)
    ProcessAreaService processAreaService;

    @ResponseBody
    @RequestMapping(value = "/add",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = {MediaType.APPLICATION_JSON_VALUE, "application/json"}
    )
    public String add(@RequestBody ProcessArea processArea) {
        String response = "{\"message\":\"error\"}";
        
        try {

            processAreaService.add(processArea);


            response = "{\"message\":\"success\"}";

        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error(e.getLocalizedMessage());
            LOGGER.error(e.getMessage());
            LOGGER.error(e.getCause());
            LOGGER.error(e.hashCode());

            response = "{\"message\":\"error\"}";


        }


        return response;

    }


    @ResponseBody
    @RequestMapping(value ="/update",
            method = RequestMethod.POST,
            consumes = {"application/json"},
            produces = { "application/json" }
    )
    public String update(@RequestBody ProcessArea processArea)
    {
        String response = "{\"message\":\"error\"}";

        LOGGER.info("processArea = "+processArea);


        try
        {
            processAreaService.update(processArea);



            response = "{\"message\":\"success\"}";

        } catch (Exception e)
        {
            e.printStackTrace();
            LOGGER.error(e.getLocalizedMessage());
            LOGGER.error(e.getMessage());
            LOGGER.error(e.getCause());
            LOGGER.error(e.hashCode());

            response = "{\"message\":\"error\"}";


        }


        return response;

    }



    @ResponseBody
    @RequestMapping(value = "/get/by/area_id",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = {MediaType.APPLICATION_JSON_VALUE, "application/json"}
    )
    public String get_by_area_id(@RequestBody ProcessArea processArea) {
        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        LOGGER.info("processArea = " + processArea);

        try {

            Iterable<ProcessArea> processAreaList = processAreaService.getByAreaId(processArea.getProcess_area_id());


            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"process_area_list\": %s }", objectMapper.writeValueAsString(processAreaList));

        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error(e.getLocalizedMessage());
            LOGGER.error(e.getMessage());
            LOGGER.error(e.getCause());
            LOGGER.error(e.hashCode());

            response = "{\"message\":\"error\"}";


        }


        return response;

    }


    @ResponseBody
    @RequestMapping(value ="/get/by/id",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = { MediaType.APPLICATION_JSON_VALUE, "application/json" }
    )
    public String getById(@RequestBody ProcessArea processArea)
    {

        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();


        try
        {
            ProcessArea processAreaResult = processAreaService.getById(processArea);

            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"process_area\": %s }", objectMapper.writeValueAsString(processAreaResult));


        } catch (Exception e)
        {
            e.printStackTrace();
            LOGGER.error(e.getLocalizedMessage());
            LOGGER.error(e.getMessage());
            LOGGER.error(e.getCause());
            LOGGER.error(e.hashCode());

            response = "{\"message\":\"error\"}";


        }


        return response;


    }

    @ResponseBody
    @RequestMapping(value = "/get/by/model_name",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = {MediaType.APPLICATION_JSON_VALUE, "application/json"}
    )
    public String get_by_model_name(@RequestBody ProcessArea processArea) {
        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        LOGGER.info("processArea = " + processArea);

        try {

            Iterable<ProcessArea> processAreaList = processAreaService.getByModelName(processArea.getModel_name());


            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"process_area_list\": %s }", objectMapper.writeValueAsString(processAreaList));

        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error(e.getLocalizedMessage());
            LOGGER.error(e.getMessage());
            LOGGER.error(e.getCause());
            LOGGER.error(e.hashCode());

            response = "{\"message\":\"error\"}";


        }


        return response;

    }





}
