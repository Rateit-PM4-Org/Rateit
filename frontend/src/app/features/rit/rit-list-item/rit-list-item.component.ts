import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Rit } from '../../../model/rit';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-rit-list-item',
  templateUrl: './rit-list-item.component.html',
  styleUrls: ['./rit-list-item.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})

export class RitListItemComponent {
  @Input() rit!: Rit;

  constructor(
    private readonly router: Router,
  ) { }

  goToRit() {
    this.router.navigate(['/rits/view/' + this.rit.id]);
  }
}