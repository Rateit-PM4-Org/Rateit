import {Component, OnInit} from '@angular/core';
import {VERSION} from '../../../../environments/version';
import {CommonModule} from '@angular/common';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {ApiService} from '../../../shared/services/api.service';

@Component({
  selector: 'app-app-build-info',
  templateUrl: './app-build-info.component.html',
  styleUrls: ['./app-build-info.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})
export class AppBuildInfoComponent implements OnInit {

  version = VERSION;
  backend: any = null;

  constructor(private readonly apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.get("/actuator/info").subscribe((data) => {
      this.backend = data;
    });
  }

}
