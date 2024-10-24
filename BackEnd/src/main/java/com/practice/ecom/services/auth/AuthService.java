package com.practice.ecom.services.auth;

import com.practice.ecom.dto.SignupRequest;
import com.practice.ecom.dto.UserDto;

public interface AuthService {
    UserDto createUser(SignupRequest signupRequest);

    boolean hasUserWithEmail(String email);
}
