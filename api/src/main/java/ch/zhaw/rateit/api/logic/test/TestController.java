package ch.zhaw.rateit.api.logic.test;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestController {

    private TestEntityRepository testEntityRepository;

    @Autowired
    public TestController(TestEntityRepository testEntityRepository) {
        this.testEntityRepository = testEntityRepository;
    }

    @PostConstruct
    public void init() {
        TestEntity testEntity = new TestEntity();
        testEntity.setValue("Hello World");
        testEntityRepository.save(testEntity);
    }

    @RequestMapping(path = "/test", method = RequestMethod.GET)
    public List<TestEntity> getAll() {
        return testEntityRepository.findAll();
    }

}
