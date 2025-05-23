package com.inmobiliaria.inmobiliariaspring.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;

import com.inmobiliaria.inmobiliariaspring.service.CustomerUserDetailsService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customerUserDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf().disable()
        .authorizeHttpRequests()
            // Solo ADMIN puede gestionar roles y administradores
            .requestMatchers("/api/roles/**", "/api/administradores/**").hasRole("ADMIN")
            // Solo ADMIN puede autorizar publicaciones
            .requestMatchers("/api/publicaciones/*/autorizar").hasRole("ADMIN")
            // ADMIN y CLIENTE pueden gestionar inmuebles, publicaciones, mensajes, favoritos
            .requestMatchers("/api/inmuebles/**", "/api/publicaciones/**", "/api/mensajes/**", "/api/favoritos/**")
                .hasAnyRole("ADMIN", "CLIENTE")
            // Registro e inicio de sesión de clientes es público
            .requestMatchers("/api/clientes/registrar", "/api/clientes/login").permitAll()
            // Cualquier otra petición requiere autenticación
            .anyRequest().authenticated()
        .and()
        .httpBasic();
    return http.build();
    }
}
