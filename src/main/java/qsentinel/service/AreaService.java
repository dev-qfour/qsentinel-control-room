package qsentinel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import qsentinel.model.Area;
import qsentinel.model.Time;
import qsentinel.repository.AreaRepository;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class AreaService {
    @Autowired(required = true)
    AreaRepository areaRepository;


    public void add(Area area) throws Exception
    {
        long instant = Instant.now().toEpochMilli(); //can be LocalDateTime
        ZoneId systemZone = ZoneId.systemDefault(); // my timezone

        Time time = new Time();
        time.setTimezone(String.valueOf(systemZone));
        time.setTime_in_millisec(instant);

        area.setTime_created(time);
        areaRepository.save(area);

    }


    public Iterable<Area> getAll() throws Exception
    {
        Iterable<Area> areaList = areaRepository.findAll();
        return areaList;
    }


    public Area getById(Area area) throws Exception
    {
        Optional<Area> areaOptional =  areaRepository.findById(area.getId());

        return areaOptional.get();
    }


    public List<Area> getByModelName(String modelName) throws Exception
    {

        List<Area> areaList= areaRepository.findByModelName(modelName);
        return areaList;
    }

}
