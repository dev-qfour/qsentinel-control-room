package qsentinel.model;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@Document(collection = "process_request_queue_m2")
@CompoundIndex(name = "primary_index", def = "{'id' : 1}")
public class ProcessRequest {

    @Id
    @Field("id")
    private String id;

    @Field("container")
    private Container container;

    @Field("process_area")
    private ProcessArea process_area;

    @Field("client_id")
    private String client_id;

    @Field("action")
    private String action;

    @Field("area_id")
    private String area_id;

    @Field("process_area_id")
    private String process_area_id;

    @Field("model_name")
    private String model_name;

    @Field("time_created")
    private Time time_created;

}
