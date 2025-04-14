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

  it('should call navigateToRatings on button click', () => {
    spyOn(component, 'navigateToRatings');
    const button = fixture.debugElement.query(By.css('ion-button'));
    button.triggerEventHandler('click', null);
    expect(component.navigateToRatings).toHaveBeenCalled();
  });

  it('should calculate latest rating value correctly', () => {
    const ratings = [
      { id: '1', value: 4, createdAt: '2023-01-01' },
      { id: '2', value: 5, createdAt: '2023-02-01' },
    ];
    const latestRatingValue = component.calculateLatestRatingValue(ratings);
    expect(latestRatingValue).toBe(5);
  });

  it('should return 0 if no ratings are provided', () => {
    const latestRatingValue = component.calculateLatestRatingValue([]);
    expect(latestRatingValue).toBe(0);
  });


});
