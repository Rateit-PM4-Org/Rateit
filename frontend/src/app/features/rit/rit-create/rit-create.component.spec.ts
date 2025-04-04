import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RitCreateComponent } from './rit-create.component';
import { ModalController } from '@ionic/angular/standalone';
import { RateComponent } from '../rate/rate.component';

describe('RitCreateComponent', () => {
  let component: RitCreateComponent;
  let fixture: ComponentFixture<RitCreateComponent>;
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitCreateComponent, IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RitCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render ritName in the ion-input', () => {
    component.ritName = 'Test Rit';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('[data-testid="rit-name-input"]'));
    expect(input.attributes['ng-reflect-value']).toContain('Test Rit');
  });


  it('should display all tag chips', () => {
    component.tags = ['red', 'blue', 'green'];
    fixture.detectChanges();

    component.tags.forEach((tag, i) => {
      const chip = fixture.debugElement.query(By.css(`[data-testid="tag-chip-${i}"]`));
      expect(chip.nativeElement.textContent).toContain(tag);
    });
  });

  it('should show the new tag input value', () => {
    component.newTag = 'hafermilch';
    fixture.detectChanges();

    const newTagInput = fixture.debugElement.query(By.css('[data-testid="new-tag-input"]'));
    expect(newTagInput.attributes['ng-reflect-value']).toContain('hafermilch');
  });

  it('should render the details text in ion-textarea', () => {
    component.details = 'Here are the details.';
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('[data-testid="details-textarea"]'));
    expect(textarea.attributes['ng-reflect-value']).toContain('Here are the details.');
  });

  it('should set ritName', () => {
    const event = { target: { value: 'My Rit' } };
    component.setRitName(event);
    expect(component.ritName).toBe('My Rit');
  });

  it('should set details', () => {
    const event = { target: { value: 'Details here' } };
    component.setDetails(event);
    expect(component.details).toBe('Details here');
  });

  it('should set new tag', () => {
    const event = { target: { value: 'TestTag' } };
    component.setNewTag(event);
    expect(component.newTag).toBe('TestTag');
  });

  it('should add new tag', () => {
    component.newTag = 'NewTag';
    component.addTag();
    expect(component.tags.includes('NewTag')).toBeTrue();
  });

  it('should not add empty tag', () => {
    component.newTag = '   ';
    component.addTag();
    expect(component.tags.includes('')).toBeFalse();
  });

  it('should remove tag', () => {
    const initialLength = component.tags.length;
    component.removeTag(0);
    expect(component.tags.length).toBe(initialLength - 1);
  });

});
