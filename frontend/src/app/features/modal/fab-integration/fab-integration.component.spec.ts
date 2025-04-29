import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FabIntegrationComponent } from './fab-integration.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../../shared/services/user.service';
import { of } from 'rxjs';
import { RitService } from '../../../shared/services/rit.service';
import { ActivatedRoute } from '@angular/router';
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
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        provideHttpClient(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FabIntegrationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add rating Button if currentRit is null', () => {
    component.currentRit = null;
    component.updateButtons();
    expect(component.buttons.length).toBe(1);
  });

  it('should add rating Button if currentRit is not null', () => {
    component.currentRit = {id: '1', name: 'Test Rit', details: 'Some details', tags: ['tag1', 'tag2'], codes: ['code1', 'code2']};
    component.updateButtons();
    expect(component.buttons.length).toBe(1);
  });
});
