package ch.zhaw.rateit.api;

import io.mongock.runner.springboot.EnableMongock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@EnableMongock
@EnableMongoAuditing
@SpringBootApplication
public class RateitAPIApplication {

	public static void main(String[] args) {
		SpringApplication.run(RateitAPIApplication.class, args);
	}

}
