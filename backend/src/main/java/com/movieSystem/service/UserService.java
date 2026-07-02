package com.movieSystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.movieSystem.entity.User;
import com.movieSystem.repository.UserRepository;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 📝 STORES NEW USER IN MONGO DB
    public User register(User user) throws Exception {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new Exception("Email is already registered!");
        }
        return userRepository.save(user); // Saves document inside MongoDB
    }

    // 🔐 VALIDATES USER ON LOGIN
    public User login(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Invalid Email or Password!"));

        if (!user.getPassword().equals(password)) {
            throw new Exception("Invalid Email or Password!");
        }
        
        return user; // Returns user data to frontend if passwords match
    }
}