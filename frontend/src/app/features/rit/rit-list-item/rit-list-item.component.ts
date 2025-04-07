import { Component, Input } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports'; 
import { CommonModule } from '@angular/common';
import { Rit } from '../../../model/rit';

@Component({
  selector: 'app-rit-list-item',
  templateUrl: './rit-list-item.component.html',
  styleUrls: ['./rit-list-item.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})

export class RitListItemComponent {
  @Input() rit!: Rit;
}