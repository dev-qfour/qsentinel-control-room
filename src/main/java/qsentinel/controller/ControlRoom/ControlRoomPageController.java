package qsentinel.controller.ControlRoom;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import qsentinel.model.CognitoUser;
import qsentinel.service.AuthenticationService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/user/qsentinel_control_room")
public class ControlRoomPageController {


    private static final Logger LOGGER = LogManager.getLogger(ControlRoomPageController.class);

    @Autowired
    private AuthenticationService authenticationService;

    private static final String PATH_JS = "./content/js/module/qsentinel_control_room";

    private static final String CATEGORY = "MODULE";

    private static final String MODULE_NAME = "Qsentinel Control Room";



    @RequestMapping(value = "/camera_select", method = RequestMethod.GET)
    protected String camera_select(final HttpServletRequest req,
                                   final HttpServletResponse res,
                                   Model model)
    {

        LOGGER.info("home");

        String returnUrl = "error/404";

        String [] pageAccessLevel = {"ALL","TEAM-MEMBER"};

        CognitoUser cognitoUser = null;


        try
        {
            cognitoUser = authenticationService.authorize(req, pageAccessLevel);
            LOGGER.info("cognitoUser = "+cognitoUser);

            cognitoUser.setArea_id("sys_pa_machine_vision");

            model.addAttribute("userinfo",cognitoUser);

            model.addAttribute("path_js",PATH_JS);

            model.addAttribute("category",CATEGORY);

            model.addAttribute("module_name",MODULE_NAME);

//			model.addAttribute("userinfo", (new ObjectMapper()).writeValueAsString(cognitoUser) );

            if (cognitoUser.isAuthenticated())
            {
                returnUrl = "module/qsentinel_control_room/camera_select";
            }
            else
            {
                returnUrl = "error/access-denied";
            }


        } catch (Exception e)
        {
            LOGGER.info(e.getLocalizedMessage());
            LOGGER.info(e.getMessage());
            LOGGER.info(e.getCause());

        }



        return returnUrl;
    }


    @RequestMapping(value = "/incidence_report", method = RequestMethod.GET)
    protected String incidence_report(final HttpServletRequest req,
                          final HttpServletResponse res,
                          Model model)
    {

        LOGGER.info("home");

        String returnUrl = "error/404";

        String [] pageAccessLevel = {"ALL","TEAM-MEMBER"};

        CognitoUser cognitoUser = null;


        try
        {
            cognitoUser = authenticationService.authorize(req, pageAccessLevel);
            LOGGER.info("cognitoUser = "+cognitoUser);

            cognitoUser.setArea_id("sys_pa_machine_vision");

            model.addAttribute("userinfo",cognitoUser);

            model.addAttribute("path_js",PATH_JS);

            model.addAttribute("category",CATEGORY);

            model.addAttribute("module_name",MODULE_NAME);

//			model.addAttribute("userinfo", (new ObjectMapper()).writeValueAsString(cognitoUser) );

            if (cognitoUser.isAuthenticated())
            {
                returnUrl = "module/qsentinel_control_room/incidence_report";
            }
            else
            {
                returnUrl = "error/access-denied";
            }


        } catch (Exception e)
        {
            LOGGER.info(e.getLocalizedMessage());
            LOGGER.info(e.getMessage());
            LOGGER.info(e.getCause());

        }



        return returnUrl;
    }


    @RequestMapping(value = "/analytics", method = RequestMethod.GET)
    protected String analytics(final HttpServletRequest req,
                          final HttpServletResponse res,
                          Model model)
    {

        LOGGER.info("home");

        String returnUrl = "error/404";

        String [] pageAccessLevel = {"ALL","TEAM-MEMBER"};

        CognitoUser cognitoUser = null;


        try
        {
            cognitoUser = authenticationService.authorize(req, pageAccessLevel);
            LOGGER.info("cognitoUser = "+cognitoUser);

            cognitoUser.setArea_id("sys_pa_machine_vision");

            model.addAttribute("userinfo",cognitoUser);

            model.addAttribute("path_js",PATH_JS);

            model.addAttribute("category",CATEGORY);

            model.addAttribute("module_name",MODULE_NAME);

//			model.addAttribute("userinfo", (new ObjectMapper()).writeValueAsString(cognitoUser) );

            if (cognitoUser.isAuthenticated())
            {
                returnUrl = "module/qsentinel_control_room/analytics";
            }
            else
            {
                returnUrl = "error/access-denied";
            }


        } catch (Exception e)
        {
            LOGGER.info(e.getLocalizedMessage());
            LOGGER.info(e.getMessage());
            LOGGER.info(e.getCause());

        }



        return returnUrl;
    }

    @RequestMapping(value = "/view", method = RequestMethod.GET)
    protected String view(final HttpServletRequest req,
                               final HttpServletResponse res,
                               Model model)
    {

        LOGGER.info("home");

        String returnUrl = "error/404";

        String [] pageAccessLevel = {"ALL","TEAM-MEMBER"};

        CognitoUser cognitoUser = null;


        try
        {
            cognitoUser = authenticationService.authorize(req, pageAccessLevel);
            LOGGER.info("cognitoUser = "+cognitoUser);

            cognitoUser.setArea_id("sys_pa_machine_vision");

            model.addAttribute("userinfo",cognitoUser);

            model.addAttribute("path_js",PATH_JS);

            model.addAttribute("category",CATEGORY);

            model.addAttribute("module_name",MODULE_NAME);

//			model.addAttribute("userinfo", (new ObjectMapper()).writeValueAsString(cognitoUser) );

            if (cognitoUser.isAuthenticated())
            {
                returnUrl = "module/qsentinel_control_room/view";
            }
            else
            {
                returnUrl = "error/access-denied";
            }


        } catch (Exception e)
        {
            LOGGER.info(e.getLocalizedMessage());
            LOGGER.info(e.getMessage());
            LOGGER.info(e.getCause());

        }



        return returnUrl;
    }







}
