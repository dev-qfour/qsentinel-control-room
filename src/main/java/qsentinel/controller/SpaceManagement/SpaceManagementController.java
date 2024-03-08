package qsentinel.controller.SpaceManagement;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import qsentinel.model.ProcessArea;
import qsentinel.service.ProcessAreaService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping(value ="/user/space_management")
public class SpaceManagementController {

    private static final Logger LOGGER = LogManager.getLogger(SpaceManagementController.class);

    @Autowired(required = true)
    ProcessAreaService processAreaService;

    @Autowired
    AmazonS3 amazonS3Client;


    @GetMapping(value = "/file/**", produces = { MediaType.APPLICATION_OCTET_STREAM_VALUE })
    public ResponseEntity<StreamingResponseBody> getObject(HttpServletRequest request) {
        try {

            String uri = request.getRequestURI();
            LOGGER.info("uri = "+uri);
            String uriParts[] = uri.split("/");
            String bucket = uriParts[4];
            String key = uriParts[uriParts.length-4]+"/"+uriParts[uriParts.length-3]+"/"+uriParts[uriParts.length-2]+"/"+uriParts[uriParts.length-1];
            LOGGER.info("uriParts[]  = "+uriParts.length);
            LOGGER.info("bucket = "+bucket);
            LOGGER.info("key = "+key);


//            bucket = "qsens-image-processing";
//            key = "client_demo/client-demo-cyclops-01/client_demo-client-demo-cyclops-01.03-11-2023.17-59-38.mp4";

            S3Object object = amazonS3Client.getObject(bucket, key);
            S3ObjectInputStream finalObject = object.getObjectContent();

            final StreamingResponseBody body = outputStream -> {
                int numberOfBytesToWrite = 0;
                byte[] data = new byte[1024];
                while ((numberOfBytesToWrite = finalObject.read(data, 0, data.length)) != -1)
                {
                    outputStream.write(data, 0, numberOfBytesToWrite);
                }
                finalObject.close();
            };
            return new ResponseEntity<StreamingResponseBody>(body, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error "+ e.getMessage());
            return new ResponseEntity<StreamingResponseBody>(HttpStatus.BAD_REQUEST);
        }


    }


    @ResponseBody
    @RequestMapping(value ="/add",
            method = RequestMethod.POST,
            consumes = {"application/json"},
            produces = { "application/json" }
    )
    public String add(@RequestBody ProcessArea processArea)
    {
        String response = "{\"message\":\"error\"}";

        LOGGER.info("processArea = "+processArea);

        try
        {

            processAreaService.add(processArea);


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
    @RequestMapping(value ="/get/all",
            method = RequestMethod.POST,
            consumes = {"application/json"},
            produces = { "application/json" }
    )
    public String getAll(@RequestBody ProcessArea processArea)
    {
        String response = "{\"message\":\"error\"}";
        ObjectMapper objectMapper = new ObjectMapper();
        try
        {
            Iterable<ProcessArea> processAreaList = processAreaService.getByAreaId(processArea.getProcess_area_id());

            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"process_area_list\": %s }", objectMapper.writeValueAsString(processAreaList));


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
    @RequestMapping(value ="/get/by/latest/one",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = { MediaType.APPLICATION_JSON_VALUE, "application/json" }
    )
    public String getByLatestOne(@RequestBody ProcessArea processArea)
    {

        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();


        try
        {
            ProcessArea processAreaResult = processAreaService.getLatestOne(processArea);

            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"process_area_latest_one\": %s }", objectMapper.writeValueAsString(processAreaResult));


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
    @RequestMapping(value ="/get/by/latest/ten",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = { MediaType.APPLICATION_JSON_VALUE, "application/json" }
    )
    public String getByLatestTen(@RequestBody ProcessArea processArea)
    {

        String response = "{\"message\":\"error\"}";

        ObjectMapper objectMapper = new ObjectMapper();


        try
        {
            List<ProcessArea> processAreaResult = processAreaService.getLatestTen(processArea);

            response = String.format("{ \"status\": \"200\", \"message\": \"success\", \"process_area_latest_ten\": %s }", objectMapper.writeValueAsString(processAreaResult));


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



}
