package ch.zhaw.rateit.api.logic.test;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TestEntityRepository extends MongoRepository<TestEntity, String> {
    List<TestEntity> findByValue(String value);
}
