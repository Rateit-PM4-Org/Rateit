import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FabIntegrationComponent } from './fab-integration.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../../shared/services/user.service';
import { of } from 'rxjs';
import { RitService } from '../../../shared/services/rit.service';
const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('FabIntegrationComponent', () => {
  let component: FabIntegrationComponent;
  let fixture: ComponentFixture<FabIntegrationComponent>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;

  beforeEach(waitForAsync(() => {
    ritServiceSpy = jasmine.createSpyObj('RitService', ['createRit', 'getRits', 'getRitsErrorStream']);
    ritServiceSpy.getRits.and.returnValue(of([]));
    ritServiceSpy.getRitsErrorStream.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [FabIntegrationComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
                  { provide: RitService, useValue: ritServiceSpy },
        provideHttpClient(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FabIntegrationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
