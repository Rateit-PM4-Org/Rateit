import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RitListItemComponent } from './rit-list-item.component';
import { Rit } from '../../../model/rit';
import { By } from '@angular/platform-browser';
import { RitService } from '../../../shared/services/rit.service';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { provideHttpClient } from '@angular/common/http';

describe('RitListItemComponent', () => {
  let component: RitListItemComponent;
  let fixture: ComponentFixture<RitListItemComponent>;

  const testRit: Rit = {
    id: '1',
    name: 'Test Rit',
    details: 'Some details',
    tags: ['tag1', 'tag2'],
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [RitListItemComponent, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RitListItemComponent);
    component = fixture.componentInstance;
    component.rit = testRit;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render rit name and tags', () => {
    const titleEl = fixture.debugElement.query(By.css('.title')).nativeElement;
    const tagsEl = fixture.debugElement.query(By.css('.tags')).nativeElement;

    expect(titleEl.textContent).toContain(testRit.name);
    expect(tagsEl.textContent).toContain(testRit.tags.join(','));
  });

  it('should show the rating button with icon', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button')).nativeElement;
    const iconEl = fixture.debugElement.query(By.css('ion-icon')).nativeElement;

    expect(buttonEl.textContent).toContain('4');
    expect(iconEl.getAttribute('name')).toBe('star');
  });

  // TODO: Rating not yet implemented
  // it('should display the correct rating', () => {
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.ratingButton'));
  //   expect(buttonElement.nativeElement.textContent).toContain('4');
  // });
});
