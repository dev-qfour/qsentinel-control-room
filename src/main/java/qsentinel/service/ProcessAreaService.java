package qsentinel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import qsentinel.model.ProcessArea;

import java.util.List;

@Service
public class ProcessAreaService {

    @Autowired
    ProcessRequestService processRequestQueueService;

    private MongoTemplate mongoTemplate;

    @Autowired
    public void setMongoTemplate(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }


    public void add(ProcessArea processArea) throws Exception
    {
        processRequestQueueService.addProcessArea(processArea);

       // mongoTemplate.save(processArea, processArea.getArea_id());

    }

    public List<ProcessArea> getByAreaId(String areaId) throws Exception
    {
/*        Query query =new Query(Criteria.where("data.space_group_list").elemMatch(
                        Criteria.where("space_list.id").is("XDDt-7519"))
                        .and("action").is("ADD"));*/

        Query query = new Query(Criteria.where("process_area_id").is(areaId).and("action").is("ADD"));

        List<ProcessArea> processAreaList = mongoTemplate.find(query, ProcessArea.class, areaId);//processAreaRepository.getByAreaId(areaId);

        return processAreaList;
    }

    public ProcessArea getById(ProcessArea processArea) throws Exception
    {
        Query query = new Query(Criteria.where("_id").is(processArea.getId()));
        List<ProcessArea> processAreaOptional =  mongoTemplate.find(query, ProcessArea.class, processArea.getProcess_area_id());//processAreaRepository.findById(id);
        return processAreaOptional.get(0);
    }


    public void update(ProcessArea processArea) throws Exception
    {
        mongoTemplate.save(processArea, processArea.getProcess_area_id());

    }

    public List<ProcessArea> getByModelName(String modelName) throws Exception
    {
        List<ProcessArea> processAreaList = null;//= processAreaRepository.getByModelName(modelName);

        return processAreaList;
    }

    public ProcessArea getLatestOne(ProcessArea processArea) throws Exception
    {
        Query query = new Query().with(Sort.by(Sort.Order.desc("time_created"))); // Replace "timestamp" with your actual timestamp field
        query.limit(1);
        List<ProcessArea> processAreaOptional =  mongoTemplate.find(query, ProcessArea.class, processArea.getProcess_area_id());//processAreaRepository.findById(id);
        return processAreaOptional.get(0);
    }

    public List<ProcessArea> getLatestTen(ProcessArea processArea) throws Exception
    {
        Query query = new Query().with(Sort.by(Sort.Order.desc("time_created"))); // Replace "timestamp" with your actual timestamp field
        query.limit(10);
        List<ProcessArea> processAreaList =  mongoTemplate.find(query, ProcessArea.class, processArea.getProcess_area_id());//processAreaRepository.findById(id);
        return processAreaList;
    }


}
