package qsentinel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import qsentinel.model.cloudgate.WebsocketMessage;

@RestController
@RequestMapping(value ="/user/cloud_system")
public class ControlRoomController {

    private static final Logger LOGGER = LogManager.getLogger(ControlRoomController.class);


    private SimpMessagingTemplate template;

    @Autowired
    public ControlRoomController(SimpMessagingTemplate template)
    {
        this.template = template;
    }

    @ResponseBody
    @RequestMapping(value = "/post",
            method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json"},
            produces = {MediaType.APPLICATION_JSON_VALUE, "application/json"}
    )
    public String post(@RequestBody String body) {
        String response = "{\"message\":\"error\"}";
        try {



            LOGGER.info("in cloud system response = ");

            LOGGER.info("cloud system body = "+body);


            WebsocketMessage websocketMessage = new WebsocketMessage();

            Gson gson = new Gson();
            websocketMessage = gson.fromJson(body, WebsocketMessage.class);

            this.template.convertAndSend("/ws/cloud_gate_ws", websocketMessage);






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
