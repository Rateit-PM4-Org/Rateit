import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FabComponent } from './fab.component';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../../shared/services/user.service';

const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('FabComponent', () => {
  let component: FabComponent;
  let fixture: ComponentFixture<FabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FabComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        provideHttpClient(),
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(FabComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
