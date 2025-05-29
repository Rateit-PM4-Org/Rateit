package ch.zhaw.rateit.api.config.db.migration;

import ch.zhaw.rateit.api.logic.rit.entity.Rit;
import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import ch.zhaw.rateit.api.util.AbstractBaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class BarcodeFieldsRitChangelogTest extends AbstractBaseIntegrationTest {

    @Autowired
    RitRepository ritRepository;

    @BeforeEach
    void init() {
        ritRepository.deleteAll();
    }

    @Test
    void testAddVerificationFields() {
        Rit testRit = new Rit("Testrit", "Testdetails", List.of(), null, null);
        Rit testRitNotChanged = new Rit("TestritNotChanged", "Testdetails", List.of(), null, null);

        testRitNotChanged.setCodes(List.of("code1", "code2"));

        ritRepository.save(testRit);
        ritRepository.save(testRitNotChanged);

        new BarcodeFieldsRitChangelog().addBarcodeFields(ritRepository);

        Rit rit = ritRepository.findById(testRit.getId()).get();
        Rit ritNotChanged = ritRepository.findById(testRitNotChanged.getId()).get();

        assertNotNull(rit.getCodes());
        assertEquals(0, rit.getCodes().size());
        assertNotNull(ritNotChanged.getCodes());
        assertEquals(2, ritNotChanged.getCodes().size());

        ritRepository.deleteAll();
    }
}
