import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import {RatingListItemComponent} from './rating-list-item.component';
import {Rating} from '../../../model/rating';

describe('RatingListItemComponent', () => {
  let component: RatingListItemComponent;
  let fixture: ComponentFixture<RatingListItemComponent>;

  const testRating: Rating = {
    id: '1',
    value: 'rating',
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [RatingListItemComponent, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingListItemComponent);
    component = fixture.componentInstance;
    component.rating = testRating;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render rating title and value', () => {
    const titleElement = fixture.debugElement.query(By.css('.title')).nativeElement;
    const valueElements = fixture.debugElement.queryAll(By.css('ion-text'));

    expect(titleElement.textContent).toContain(testRating.id);
    valueElements.forEach((valElement) => {
      expect(valElement.nativeElement.textContent).toContain(testRating.value);
    });
  });
});
