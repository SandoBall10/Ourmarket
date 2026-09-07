package com.inmobiliaria.inmobiliariaspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.inmobiliaria.inmobiliariaspring.config.DatabaseBootstrap;

@SpringBootApplication
public class InmobiliariaSpringApplication {

	public static void main(String[] args) {
		DatabaseBootstrap.ensureDatabaseExists();
		SpringApplication.run(InmobiliariaSpringApplication.class, args);
	}

}