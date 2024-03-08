package qsentinel.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import qsentinel.model.cloudgate.WebsocketMessage;

@Controller
public class WsController
{
    @MessageMapping("/message_mapping")
    @SendTo("/topic/ws_message")
    public String greet(WebsocketMessage message) throws InterruptedException, JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();

        System.out.println("message  sanil= "+message);

        return objectMapper.writeValueAsString(message);
    }

}
