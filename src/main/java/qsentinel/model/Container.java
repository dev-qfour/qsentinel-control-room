package qsentinel.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "container")
@CompoundIndex(name = "primary_index", def = "{'id' : 1}")
public class Container {

    @Id
    @Field("id")
    private String id;
    @Field("user_id")
    private String user_id;

    @Field("client_id")
    private String client_id;

    @Field("area_id")
    private String area_id;
    @Field("data")
    private Object data;

    @Field("action")
    private String action;

    @Field("model_name")
    private String model_name;

    @Field("approval_chain_current")
    private ApprovalChain approval_chain_current;

    @Field("approval_chain_history")
    private List<ApprovalChain> approval_chain_history;

    @Field("time_created")
    private Time time_created;

}
