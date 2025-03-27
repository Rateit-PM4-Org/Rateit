package ch.zhaw.rateit.api;

import io.mongock.runner.springboot.EnableMongock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableMongock
@SpringBootApplication
public class RateitAPIApplication {

	public static void main(String[] args) {
		SpringApplication.run(RateitAPIApplication.class, args);
	}

}
