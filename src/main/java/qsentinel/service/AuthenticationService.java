package qsentinel.service;


import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import qsentinel.configuration.AWSConfig;
import qsentinel.model.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
@PropertySource(value ={ "classpath:aws.properties" })
public class AuthenticationService
{
    private static final Logger LOGGER = LogManager.getLogger(AuthenticationService.class);

    private static final String USERINFO_URL = "https://insightai-web-client.auth.ap-south-1.amazoncognito.com/oauth2/userInfo";

    private static final List<String> PAGE_ACCESS_LEVEL
            = Arrays.asList(
                    "PUBLIC","GUEST","INTERN",
                    "TEAM-MEMBER","TEAM-LEADER",
                    "MANAGER","HEAD-OF-DEPARTMENT",
                    "EXECUTIVE","PARTNER","SUPERUSER","ULTRA");


    @Autowired
    AWSCognitoIdentityProvider cognitoIdentityProvider;


    @Autowired
    AWSConfig cognitoConfig;


    @Autowired
    AreaService areaService;

    @Autowired(required = true)
    CognitoUserService cognitoUserService;



    @Value("${aws.userpoolid}")
    private String userPoolId;




    public CognitoUser authorize(HttpServletRequest httpServletRequest, String[] pageAccessLevel)
    {
        CognitoUser cognitoUser = new CognitoUser();

        String accesstoken = httpServletRequest.getHeader("x-amzn-oidc-accesstoken");
        String idtoken = httpServletRequest.getHeader("x-amzn-oidc-identity");
//        String data = httpServletRequest.getHeader("x-amzn-oidc-data");

        LOGGER.info("accesstoken = "+accesstoken);
        LOGGER.info("idtoken = "+idtoken);


        try
        {
            if (idtoken!=null && accesstoken!=null)
            {
                LOGGER.info("accesstoken and idtoken are not null ");

                OkHttpClient okHttpClient = new OkHttpClient();

                Request request = new Request.Builder()
                                        .url(USERINFO_URL)
                                        .addHeader("Authorization", "Bearer " + accesstoken)
                                        .build();

                Response response = okHttpClient.newCall(request).execute();

                LOGGER.info("response = "+response);

                LOGGER.info("response.isSuccessful() = "+response.isSuccessful());


                if (response.isSuccessful())
                {
                    String responseBodyStr = response.body().string();

                    LOGGER.info("responseBodyStr = "+responseBodyStr);


                    ObjectMapper objectMapper = new ObjectMapper();

                    cognitoUser = objectMapper.readValue(responseBodyStr.replaceAll("custom:",""), CognitoUser.class);


                    cognitoUser = authenticate(cognitoUser,pageAccessLevel);




                }



            }


        } catch (IOException e)
        {
            e.printStackTrace();
        }

        LOGGER.info("cognitoUser = "+cognitoUser);


        if (true)
        {
/*            cognitoUser.setName("Robert");
            cognitoUser.setFamily_name("Williams");
            cognitoUser.setEmail("Robert@quantumfour.com");
            cognitoUser.setClient_id("client_01");
            cognitoUser.setAccess_level("SUPERUSER");*/


            SystemAccessLevel systemAccessLevel = new SystemAccessLevel();
            systemAccessLevel.setId("HOD");
            systemAccessLevel.setName("HOD");
            systemAccessLevel.setLevel(5);
            systemAccessLevel.setValue("HOD");

            cognitoUser.setName("Rahul Gupta");
          //  cognitoUser.setFamily_name("Williams");
            cognitoUser.setEmail("Robert@quantumfour.com");
            cognitoUser.setClient_id("demo_client");
//            cognitoUser.setClient_id("client_01");
            cognitoUser.setAccess_level("SUPERUSER");
            cognitoUser.setAuthenticated(true);

            cognitoUser.setUser_id("demo_client");
            cognitoUser.setArea_id("xomE-4370");
            cognitoUser.setDepartment_id("AOu7-9300");
            cognitoUser.setSystem_access_level(systemAccessLevel);


        }


        return cognitoUser;

    }





    private CognitoUser authenticate(CognitoUser cognitoUser, String[] pageAccessLevel)
    {

        int pageAccessLevelIndex = PAGE_ACCESS_LEVEL.indexOf(pageAccessLevel[pageAccessLevel.length-1]);
        LOGGER.info("pageAccessLevelIndex = "+pageAccessLevelIndex);

        if (pageAccessLevelIndex>=0)
        {
            int userAccessLevelIndex = PAGE_ACCESS_LEVEL.indexOf(cognitoUser.getAccess_level().toUpperCase());
            LOGGER.info("userAccessLevelIndex = "+userAccessLevelIndex);

            if (pageAccessLevelIndex<=userAccessLevelIndex)
            {
                LOGGER.info("access granted.");

                cognitoUser.setAuthenticated(true);
            }
            else
            {
                LOGGER.info("access denied.");
            }


        }


        return cognitoUser;
    }


    public User getValidateArea(HttpServletRequest httpServletRequest, String areaId)
    {
        Area area = new Area();

        CognitoUser cognitoUser = cognitoUserService.getCognitoUser();

        User user = cognitoUserService.setUser(cognitoUser);

        area.setId(areaId);


        boolean isAuthenticated = false;


        try {
            area = areaService.getById(area);

            if(validateArea(user,area))
            {
                user.isAuthenticated = true;

            }
            else {
                user.isAuthenticated = false;

            }


        } catch (Exception e) {
            e.printStackTrace();

            user.isAuthenticated = false;
        }

        return user;


    }

    public boolean validateArea(User user, Area area)
    {

        boolean valid = false;

        if(user.getUser_id().equals(area.getClient_id()))
        {
            if(area.getApproval_status().equals("true"))
            {
                if(user.getSystem_access_level().getLevel()>=area.getApproval_chain_start().getLevel())
                {
                    valid = true;
                }
                else {
                    valid= false;
                }

            }
            else {

                valid = true;

            }
        }




        return valid;

    }







}
