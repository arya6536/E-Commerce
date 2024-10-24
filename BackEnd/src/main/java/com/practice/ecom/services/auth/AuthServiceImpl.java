package com.practice.ecom.services.auth;

import com.practice.ecom.dto.SignupRequest;
import com.practice.ecom.dto.UserDto;
import com.practice.ecom.entity.Order;
import com.practice.ecom.entity.User;
import com.practice.ecom.enums.OrderStatus;
import com.practice.ecom.enums.UserRole;
import com.practice.ecom.repository.OrderRepository;
import com.practice.ecom.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private OrderRepository orderRepository;

    public UserDto createUser(SignupRequest signupRequest){
        User user = new User();

        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        if (signupRequest.getPassword() == null || signupRequest.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        user.setRole(UserRole.CUSTOMER);
        User createUser = userRepository.save(user);

        Order order = new Order();
        order.setAmount(0L);
        order.setTotalAmount(0L);
        order.setUser(createUser);
        order.setOrderStatus(OrderStatus.Pending);
        orderRepository.save(order);

        UserDto userDto = new UserDto();
        userDto.setId(createUser.getId());

        return userDto;
    }

    @Override
    public boolean hasUserWithEmail(String email) {
        return userRepository.findFirstByEmail(email).isPresent();
    }

    @PostConstruct
    public void createAdminAccount(){
        User adminAccount = userRepository.findByRole(UserRole.ADMIN);
        if(null == adminAccount){
            User user = new User();
            user.setEmail("admin@test.com");
            user.setName("admin");
            user.setRole(UserRole.ADMIN);
            user.setPassword(new BCryptPasswordEncoder().encode("admin123"));
            userRepository.save(user);
        }
    }
}
