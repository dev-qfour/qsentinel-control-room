package qsentinel.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import qsentinel.model.Area;

import java.util.List;

public interface AreaRepository extends MongoRepository<Area, String> {

    @Query(value = "{'model_name': ?0}")
    public List<Area> findByModelName(String modelName);
}
