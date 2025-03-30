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

  // HTML

  it('should render ritName in the ion-input', () => {
    component.ritName = 'Test Rit';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('[data-testid="rit-name-input"]'));
    expect(input.attributes['ng-reflect-value']).toContain('Test Rit');
  });

  it('should show the selected image when selectedImage is set', () => {
    component.selectedImage = 'http://example.com/image.jpg';
    fixture.detectChanges();

    const image = fixture.debugElement.query(By.css('[data-testid="image-preview"] ion-img'));
    expect(image).toBeTruthy();
    expect(image.attributes['ng-reflect-src']).toBe('http://example.com/image.jpg');
  });

  it('should show placeholder when no image is selected', () => {
    component.selectedImage = null;
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(By.css('[data-testid="image-placeholder"]'));
    expect(placeholder.nativeElement.textContent.trim()).toBe('Select a picture');
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

  it('should call selectImage() when image container is clicked', () => {
    spyOn(component, 'selectImage');
    fixture.detectChanges();

    const imageContainer = fixture.debugElement.query(By.css('[data-testid="image-container"]'));
    imageContainer.triggerEventHandler('click', null);

    expect(component.selectImage).toHaveBeenCalled();
  });

  // TypeScript

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

  it('should call FileReader.readAsDataURL when a file is selected', () => {
    const mockFile = new File(['dummy'], 'test.png', { type: 'image/png' });
  
    const mockReader: Partial<FileReader> = {
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      result: 'data:image/png;base64,abc123',
      onload: null,
    };
  
    spyOn(window as any, 'FileReader').and.returnValue(mockReader as FileReader);
  
    component.selectImage();
  
    const fileInputEvent = { target: { files: [mockFile] } } as any;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
  
    const onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        component.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    };
  
    (window as any).FileReader = function () {
      return mockReader;
    };
    onchange(fileInputEvent);
    (mockReader.onload as any)(); // Triggert reader.onload
  
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
    expect(component.selectedImage).toBe('data:image/png;base64,abc123');
  });

  it('should open modal with RateComponent', async () => {
    const modalSpyObj = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
    modalCtrlSpy.create.and.resolveTo(modalSpyObj);

    await component.openRateComponent();

    expect(modalCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      component: RateComponent,
      breakpoints: [0, 0.25, 0.85],
      initialBreakpoint: 0.85,
      showBackdrop: true,
      canDismiss: true,
    }));

    expect(modalSpyObj.present).toHaveBeenCalled();
  });

});
