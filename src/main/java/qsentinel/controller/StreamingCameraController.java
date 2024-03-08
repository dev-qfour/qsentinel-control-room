package qsentinel.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import qsentinel.model.StreamingCamera;

@RestController
@RequestMapping(value ="/user/streaming_camera")
public class StreamingCameraController {

    private static final Logger LOGGER = LogManager.getLogger(StreamingCameraController.class);

    @ResponseBody
    @RequestMapping(value = "/send/all/id",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = {MediaType.APPLICATION_JSON_VALUE, "application/json"}
    )
    public String sendAllId(@RequestBody StreamingCamera streamingCamera) {
        String response = "{\"message\":\"error\"}";
        try {



            LOGGER.info("in Streaming Camera Controller = ");

            LOGGER.info("Streaming Camera = "+streamingCamera.getCamera_id());




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
}
