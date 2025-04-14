import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { FabComponent } from '../fab/fab.component';
import { RitCreateModalComponent } from '../rit-create-modal/rit-create-modal.component';

@Component({
  selector: 'app-fab-integration',
  templateUrl: './fab-integration.component.html',
  styleUrls: ['./fab-integration.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports, FabComponent, RitCreateModalComponent],
  standalone: true,
})
export class FabIntegrationComponent  implements OnInit {
  @ViewChild(FabComponent) fabComponent!: FabComponent;
  @ViewChild(RitCreateModalComponent) ritCreateModalComponent!: RitCreateModalComponent;

  protected buttons = [
    {
      icon: 'add-outline',
      action: () => this.ritCreateModalComponent.modal.present(),
    },
  ];

  constructor() { }

  ngOnInit() {}

}
