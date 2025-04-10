import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RitListItemComponent } from './rit-list-item.component';
import { Rit } from '../../../model/rit';
import { By } from '@angular/platform-browser';

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
    const chipElements = fixture.debugElement.queryAll(By.css('ion-chip'));

    expect(titleEl.textContent).toContain(testRit.name);
    expect(chipElements.length).toBe(testRit.tags.length);
    chipElements.forEach((chipEl, index) => {
      expect(chipEl.nativeElement.textContent).toContain(testRit.tags[index]);
    });
  });

  // TODO: Rating not yet implemented
  // it('should display the correct rating', () => {
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.ratingButton'));
  //   expect(buttonElement.nativeElement.textContent).toContain('4');
  // });
});
