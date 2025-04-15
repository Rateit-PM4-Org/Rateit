import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { FabButton, FabComponent } from '../fab/fab.component';
import { ModalViewComponent } from '../modal-view/modal-view.component';
import { Rit } from '../../../model/rit';
import { Observable } from 'rxjs';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';
import { RateComponent } from '../../rit/rate/rate.component';

@Component({
  selector: 'app-fab-integration',
  templateUrl: './fab-integration.component.html',
  styleUrls: ['./fab-integration.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports, FabComponent, ModalViewComponent, RitCreateComponent, RateComponent],
  standalone: true,
})
export class FabIntegrationComponent  implements OnInit {
  @Input() rit!: Observable<Rit|null> | null;
  private ritSubscription: any;
  protected currentRit: Rit|null = null;
  @ViewChild(FabComponent) fabComponent!: FabComponent;
  @ViewChild("ritCreateModal") ritCreateModalComponent!: ModalViewComponent;
  @ViewChild("rateModal") ratingCreateModalComponent!: ModalViewComponent;

  protected buttons: FabButton[] = [];
  
  ngOnInit() {
    this.updateButtons();
    this.ritSubscription = this.rit?.subscribe((data) => {
      this.currentRit = data;
      this.updateButtons();
    })
  }

  ngOnDestroy() {
    if (this.ritSubscription) {
      this.ritSubscription.unsubscribe();
    }
  }

  updateButtons() {
    this.buttons = [
      {
        icon: 'add-outline',
        action: () => this.ritCreateModalComponent.modal.present(),
      },
    ];
    if (this.currentRit) {
      this.buttons.push({
        icon: 'star-outline',
        action: () => this.ratingCreateModalComponent.modal.present(),
      });
    }
  }

}
