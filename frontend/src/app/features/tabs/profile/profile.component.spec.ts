import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
