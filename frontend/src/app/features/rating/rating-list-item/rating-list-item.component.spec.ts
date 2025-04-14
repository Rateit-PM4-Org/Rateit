import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import {RatingListItemComponent} from './rating-list-item.component';
import {Rating} from '../../../model/rating';

describe('RatingListItemComponent', () => {
  let component: RatingListItemComponent;
  let fixture: ComponentFixture<RatingListItemComponent>;

  const testRating: Rating = {
    value: 5,
    positiveComment: 'positive',
    negativeComment: 'negative'
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

  it('should render positive and negative comment', () => {
    const positiveComment = fixture.debugElement.query(By.css('.rating-positive ion-text')).nativeElement;
    const negativeComment = fixture.debugElement.query(By.css('.rating-negative ion-text')).nativeElement;

    expect(positiveComment.textContent).toContain(testRating.positiveComment);
    expect(negativeComment.textContent).toContain(testRating.negativeComment);
  });
});
