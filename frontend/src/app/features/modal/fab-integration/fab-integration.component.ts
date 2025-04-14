import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { FabButton, FabComponent } from '../fab/fab.component';
import { RitCreateModalComponent } from '../rit-create-modal/rit-create-modal.component';
import { RatingCreateModalComponent } from '../rating-create-modal/rating-create-modal.component';
import { Rit } from '../../../model/rit';

@Component({
  selector: 'app-fab-integration',
  templateUrl: './fab-integration.component.html',
  styleUrls: ['./fab-integration.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports, FabComponent, RitCreateModalComponent, RatingCreateModalComponent],
  standalone: true,
})
export class FabIntegrationComponent  implements OnInit {
  @Input() currentRit!: Rit|null;
  @ViewChild(FabComponent) fabComponent!: FabComponent;
  @ViewChild(RitCreateModalComponent) ritCreateModalComponent!: RitCreateModalComponent;
  @ViewChild(RatingCreateModalComponent) ratingCreateModalComponent!: RitCreateModalComponent;

  protected buttons: FabButton[] = [
    {
      icon: 'add-outline',
      action: () => this.ritCreateModalComponent.modal.present(),
    },
    {
      icon: 'add-outline',
      action: () => this.ratingCreateModalComponent.modal.present(),
    },
  ];

  constructor() { }

  ngOnInit() {}

}
