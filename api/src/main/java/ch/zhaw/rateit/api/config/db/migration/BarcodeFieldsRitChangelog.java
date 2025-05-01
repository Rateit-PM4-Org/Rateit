package ch.zhaw.rateit.api.config.db.migration;

import ch.zhaw.rateit.api.logic.rit.repository.RitRepository;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;

import java.util.List;

/**
 * Neue Felder für Barcodes auf Rits:
 * - auf vorhandenen Rits leere Barcode List hinzufügen
 *
 * @author Nicolas Zillig
 */
@ChangeUnit(id = "barcodeFieldsRitChangelog", order = "003", author = "Nicolas Zillig")
public class BarcodeFieldsRitChangelog {
    @Execution
    public void addBarcodeFields(RitRepository ritRepository) {
        // Add barcode fields to rits
        ritRepository.findAll().forEach(rit -> {
            if(rit.getCodes() == null){
                rit.setCodes(List.of());
                ritRepository.save(rit);
            }
        });
    }

    @RollbackExecution
    public void rollbackVerificationFields() {
        // not reversable
    }
}
