package qsentinel.controller;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import qsentinel.service.AuthenticationService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class PageController {


    private static final Logger LOGGER = LogManager.getLogger(PageController.class);

    @Autowired
    private AuthenticationService authenticationService;



    @RequestMapping(value = "/", method = RequestMethod.GET)
    protected String home(final HttpServletRequest req,
                                       final HttpServletResponse res,
                                       Model model)
    {
        String returnUrl = "home";

        return returnUrl;

    }

    @RequestMapping(value = "/healthcheck", method = RequestMethod.GET)
    protected ResponseEntity<String> healthcheck()
    {

        return ResponseEntity.ok().build();

    }



}
