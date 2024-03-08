package qsentinel.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import qsentinel.model.Container;

import java.util.List;

public interface ContainerRepository extends MongoRepository<Container, String> {

    @Query(value = "{'area_id': ?0 }}")
    List<Container> getByAreaId(String areaId);

    @Query(value = "{'model_name': ?0 }}")
    List<Container> getByModelName(String modelName);

}
