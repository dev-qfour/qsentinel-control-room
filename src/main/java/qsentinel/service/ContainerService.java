package qsentinel.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import qsentinel.model.Container;
import qsentinel.repository.ContainerRepository;

import java.util.List;


@Service
public class ContainerService {

    @Autowired
    ProcessRequestService processRequestQueueService;

    @Autowired(required = true)
    ContainerRepository containerRepository;

    @Autowired
    ObjectMapper objectMapper;

    public void add(Container container) throws Exception
    {
        //containerRepository.save(container);
        processRequestQueueService.addSqs(container);

    }

    public List<Container> getByAreaId(String areaId) throws Exception
    {
        Query query = new Query(Criteria.where("area_id").is(areaId).and("action").is("ADD"));

        List<Container> containerList = processRequestQueueService.getData(query,areaId);//containerRepository.getByAreaId(areaId);

        return containerList;
    }

    public Container getById(Container container) throws Exception
    {
        Query query = new Query(Criteria.where("_id").is(container.getId()));
        List<Container> containerOptional =  processRequestQueueService.getData(query,container.getArea_id());//containerRepository.findById(id);
        return containerOptional.get(0);
    }


    public void update(Container container) throws Exception
    {
        containerRepository.save(container);

    }

    public List<Container> getByModelName(String modelName) throws Exception
    {
        List<Container> containerList = containerRepository.getByModelName(modelName);

        return containerList;
    }


}
