package qsentinel.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@Document(collection = "system_access_level")
@CompoundIndex(name = "primary_index", def = "{'id' : 1}")
public class SystemAccessLevel {

    @Id
    @Field("id")
    private String id;

    @Field("name")
    private String name;

    @Field("level")
    private int level;

    @Field("value")
    private String value;

    @Field("time_created")
    private Time time_created;

}
