package qsentinel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import qsentinel.model.*;
import qsentinel.repository.ProcessRequestRepository;

import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProcessRequestService {

    @Autowired(required = true)
    ProcessRequestRepository processRequestQueueRepository;

    @Autowired
    ObjectMapper objectMapper;

    private MongoTemplate mongoTemplate;

    @Autowired
    public void setMongoTemplate(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }



    public void add(ProcessRequest processRequestQueue) throws Exception
    {
        long instant = Instant.now().toEpochMilli(); //can be LocalDateTime
        ZoneId systemZone = ZoneId.systemDefault(); // my timezone

        Time time = new Time();
        time.setTimezone(String.valueOf(systemZone));
        time.setTime_in_millisec(instant);

        processRequestQueue.getContainer().setTime_created(time);

        processRequestQueueRepository.save(processRequestQueue);

    }

    public void update(ProcessRequest processRequest) throws Exception
    {
        processRequestQueueRepository.save(processRequest);

    }



    public Iterable<ProcessRequest> getAll() throws Exception
    {
        Iterable<ProcessRequest> areaList = processRequestQueueRepository.findAll();
        return areaList;
    }

    public List<ProcessRequest> getByAction(ProcessRequest processRequest) throws Exception
    {
        List<ProcessRequest> processRequestList = processRequestQueueRepository.getByAction(processRequest.getAction());

        return processRequestList;
    }

    public void delete(ProcessRequest proccessRequestQueue) throws Exception
    {
        processRequestQueueRepository.delete(proccessRequestQueue);

    }

    public void addSqs(Container container)throws Exception
    {
        long instant = Instant.now().toEpochMilli(); //can be LocalDateTime
        ZoneId systemZone = ZoneId.systemDefault(); // my timezone

        Time time = new Time();
        time.setTimezone(String.valueOf(systemZone));
        time.setTime_in_millisec(instant);

        ApprovalChain approvalChain = new ApprovalChain();
        approvalChain.setAccess_level(container.getApproval_chain_current().getAccess_level());
        approvalChain.setTime_create(time);

        List<ApprovalChain> approvalChainList = new ArrayList<>(); //container.getApproval_chain_history();
        approvalChainList.add(approvalChain);

        container.setTime_created(time);
        container.setApproval_chain_history(approvalChainList);



        ProcessRequest processRequest = new ProcessRequest();
        processRequest.setId(UUID.randomUUID().toString());
        processRequest.setAction("ADD");
        processRequest.setArea_id(container.getArea_id());
        processRequest.setClient_id(container.getClient_id());
        processRequest.setModel_name(container.getModel_name());
        processRequest.setContainer(container);
        processRequest.setTime_created(time);

        processRequestQueueRepository.save(processRequest);

/*        final Map<String, MessageAttributeValue> messageAttributes = new HashMap<>();
        messageAttributes.put("Id", new MessageAttributeValue()
                .withDataType("String")
                .withStringValue(processRequest.getClient_id()));*/

       // sqsService.sendSqsMessage(objectMapper.writeValueAsString(processRequest),processRequest.getClient_id());


    }

    public List<ProcessRequest> getByAreaId(ProcessRequest processRequest) throws Exception
    {
        List<ProcessRequest> processRequestList = processRequestQueueRepository.findByAreaId(processRequest.getArea_id(),"ADD");

        return processRequestList;
    }

    public List<Container> getData(Query query, String tableName) throws Exception
    {
        List<Container> containerList = mongoTemplate.find(query, Container.class, tableName);
        return containerList;
    }



    public void addProcessArea(ProcessArea processArea)throws Exception
    {
        long instant = Instant.now().toEpochMilli(); //can be LocalDateTime
        ZoneId systemZone = ZoneId.systemDefault(); // my timezone

        Time time = new Time();
        time.setTimezone(String.valueOf(systemZone));
        time.setTime_in_millisec(instant);

        ApprovalChain approvalChain = new ApprovalChain();
        approvalChain.setAccess_level(processArea.getApproval_chain_current().getAccess_level());
        approvalChain.setTime_create(time);

        List<ApprovalChain> approvalChainList = new ArrayList<>(); //processArea.getApproval_chain_history();
        approvalChainList.add(approvalChain);

        processArea.setTime_created(time);
        processArea.setApproval_chain_history(approvalChainList);

        ProcessRequest processRequest = new ProcessRequest();
        processRequest.setId(UUID.randomUUID().toString());
        processRequest.setAction("ADD");
        processRequest.setArea_id(processArea.getProcess_area_id());
        processRequest.setClient_id(processArea.getClient_id());
        processRequest.setModel_name(processArea.getModel_name());
        processRequest.setProcess_area(processArea);
        processRequest.setTime_created(time);

        processRequestQueueRepository.save(processRequest);

    }

}
