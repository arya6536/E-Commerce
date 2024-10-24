package com.practice.ecom.controller;

import com.practice.ecom.dto.AuthenticationRequest;
import com.practice.ecom.dto.SignupRequest;
import com.practice.ecom.dto.UserDto;
import com.practice.ecom.entity.User;
import com.practice.ecom.repository.UserRepository;
import com.practice.ecom.services.auth.AuthService;
import com.practice.ecom.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;

    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    private  static final String TOKEN_PREFIX = "Bearer ";
    private static final String HEADER_STRING = "Authorization";

    private final AuthService authService;

//    @PostMapping("/authenticate")
//    public void createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest,
//                                          HttpServletResponse response) throws IOException, JSONException {
//
//        try{
//            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken( authenticationRequest.getUsername(),
//                    authenticationRequest.getPassword()));
//        } catch (BadCredentialsException e){
//            throw new BadCredentialsException("Incorrect username or password ");
//        }
//
//        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
//        Optional<User> optionalUser = userRepository.findFirstByEmail(userDetails.getUsername());
//        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
//
//        if(optionalUser.isPresent()){
//            response.getWriter().write(new JSONObject()
//                    .put("userId", optionalUser.get().getId())
//                            .put("role",optionalUser.get().getRole())
//                            .toString()
//                    );
//            response.addHeader("Access-Control-Expose_headers","Authorization");
//            response.addHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept");
////            response.addHeader("Access-Control-Allow-Headers","Authorization, X-PINGOTHER, Origin, " +
////                    "X-Request-With, Content-Type, Accept, X-Custom-header");
//            response.addHeader("Authorization", "Bearer " + jwt);
//                    response.addHeader(HEADER_STRING, TOKEN_PREFIX + jwt);
//        }
//    }
//

    @PostMapping("/authenticate")
    public void createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest,
                                          HttpServletResponse response) throws IOException ,JSONException{

        try {
            // Attempt to authenticate the user
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            // Respond with unauthorized status if authentication fails
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Incorrect username or password");
            return;
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        Optional<User> optionalUser = userRepository.findFirstByEmail(userDetails.getUsername());

        // Check if user is present
        if (optionalUser.isPresent()) {
            final String jwt = jwtUtil.generateToken(userDetails.getUsername());

            // Set user ID and role in the response body
            response.getWriter().write(new JSONObject()
                    .put("userId", optionalUser.get().getId())  // Check if getId() is valid
                    .put("role", optionalUser.get().getRole())
                    .toString()
            );

            // Properly configure CORS headers
            response.addHeader("Access-Control-Expose-Headers", "Authorization");
            response.addHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept");
            response.addHeader("Authorization", "Bearer " + jwt); // Set the Authorization header
        } else {
            // Handle the case where the user is not found
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
        }
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest){
         if(authService.hasUserWithEmail(signupRequest.getEmail())){
             return new ResponseEntity<>("User already exists", HttpStatus.NOT_ACCEPTABLE);
         }
         UserDto userDto = authService.createUser(signupRequest);
         return new ResponseEntity<>(userDto,HttpStatus.OK);
    }
}
