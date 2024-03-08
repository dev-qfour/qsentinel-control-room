package qsentinel.service;

import org.springframework.stereotype.Service;
import qsentinel.model.*;

@Service
public class CognitoUserService {



    public CognitoUser getCognitoUser()
    {
        CognitoUser cognitoUser = new CognitoUser();

        SystemAccessLevel systemAccessLevel = new SystemAccessLevel();
        systemAccessLevel.setId("HOD");
        systemAccessLevel.setName("HOD");
        systemAccessLevel.setLevel(5);
        systemAccessLevel.setValue("HOD");

        cognitoUser.setUser_id("GObm-8325");
        cognitoUser.setName("Anjali");
        cognitoUser.setFamily_name("Landge");
        cognitoUser.setEmail("anjali@quantumfour.com");

        cognitoUser.setArea_id("xomE-4370");
        cognitoUser.setDepartment_id("AOu7-9300");
        cognitoUser.setSystem_access_level(systemAccessLevel);


        return cognitoUser;
    }

    public User setUser(CognitoUser cognitoUser)
    {
        User user = new User();

        user.setUser_id(cognitoUser.getUser_id());
        user.setName(cognitoUser.getName());
        user.setFamily_name(cognitoUser.getFamily_name());
        user.setEmail(cognitoUser.getEmail());
        user.setDepartment_id(cognitoUser.getDepartment_id());
        user.setSystem_access_level(cognitoUser.getSystem_access_level());
        user.setArea_id(cognitoUser.getArea_id());


        return user;
    }

}
