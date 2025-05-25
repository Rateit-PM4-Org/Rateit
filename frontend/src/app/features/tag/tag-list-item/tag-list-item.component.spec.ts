import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TagListItemComponent} from './tag-list-item.component';

describe('TagListItemComponent', () => {
  let component: TagListItemComponent;
  let fixture: ComponentFixture<TagListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagListItemComponent);
    component = fixture.componentInstance;
    component.tag = {name: 'Test Tag', ritCount: 4};
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the tag name and ritCount in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Tag');
    expect(compiled.textContent).toContain('4');
  });
});
