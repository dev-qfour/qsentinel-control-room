package qsentinel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import qsentinel.model.Container;
import qsentinel.service.ContainerService;

@RestController
@RequestMapping(value ="/user/container")
public class ContainerController {


    private static final Logger LOGGER = LogManager.getLogger(ContainerController.class);

    @Autowired(required = true)
    ContainerService containerService;

    @ResponseBody
    @RequestMapping(value = "/add",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = {MediaType.APPLICATION_JSON_VALUE, "application/json"}
    )
    public String add(@RequestBody Container container) {
        String response = "{\"message\":\"error\"}";

        LOGGER.info("container = " + container);

        try {

            containerService.add(container);


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
    public String update(@RequestBody Container container)
    {
        String response = "{\"message\":\"error\"}";

        LOGGER.info("container = "+container);


        try
        {
            containerService.update(container);



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
    public String get_by_area_id(@RequestBody Container container) {
        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        LOGGER.info("container = " + container);

        try {

            Iterable<Container> containerList = containerService.getByAreaId(container.getArea_id());


            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"container_list\": %s }", objectMapper.writeValueAsString(containerList));

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
    public String getById(@RequestBody Container container)
    {

        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();


        try
        {
            Container containerResult = containerService.getById(container);

            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"container\": %s }", objectMapper.writeValueAsString(containerResult));


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
    public String get_by_model_name(@RequestBody Container container) {
        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        LOGGER.info("container = " + container);

        try {

            Iterable<Container> containerList = containerService.getByModelName(container.getModel_name());


            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"container_list\": %s }", objectMapper.writeValueAsString(containerList));

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
