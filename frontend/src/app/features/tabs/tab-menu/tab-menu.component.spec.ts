import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuComponent } from './tab-menu.component';

describe('TabMenuComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TabMenuComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TabMenuComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
