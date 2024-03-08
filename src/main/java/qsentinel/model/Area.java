package qsentinel.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


@Data
@NoArgsConstructor
@Document(collection = "area")
@CompoundIndex(name = "primary_index", def = "{'id' : 1}")
public class Area{

    @Id
    @Field("id")
    private String id;

    @Field("name")
    private String name;

    @Field("model_name")
    private String model_name;

    @Field("client_id")
    private String client_id;


    @Field("client_name")
    private String client_name;

    @Field("department_id")
    private String department_id;

    @Field("department_name")
    private String department_name;

    @Field("approval_status")
    private String approval_status;


    @Field("approval_chain_start")
    public SystemAccessLevel approval_chain_start;

    @Field("approval_chain_end")
    public SystemAccessLevel approval_chain_end;

    @Field("time_created")
    private Time time_created;

}
