package qsentinel.model.cloudgate;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebsocketMessage
{
    private String client_id;
    private String type;
    private Object data;

}
