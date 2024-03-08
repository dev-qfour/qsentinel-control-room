package qsentinel.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import qsentinel.model.ProcessRequest;

import java.util.List;

public interface ProcessRequestRepository extends MongoRepository<ProcessRequest, String> {

    @Query(value = "{'action': ?0 }}")
    List<ProcessRequest> getByAction(String action);


    @Query(value = "{'area_id': ?0 ,'action': ?1 }}")
    List<ProcessRequest> findByAreaId(String areaId , String action);

}
