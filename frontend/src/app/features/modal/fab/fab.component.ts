import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {UserService} from '../../../shared/services/user.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports],
  standalone: true,
})
export class FabComponent implements OnInit {
  @Input() buttons: FabButton[] = [];
  isLoggedIn$!: Observable<boolean>;

  constructor(private readonly userService: UserService) {
  }

  ngOnInit() {
    this.isLoggedIn$ = this.userService.isLoggedIn();
  }

}

export type FabButton = {
  icon: string;
  action: () => Promise<void>;
};
