import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {TagSelectorComponent} from './tag-selector.component';
import {RitService} from '../../../shared/services/rit.service';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

describe('TagSelectorComponent', () => {
  let component: TagSelectorComponent;
  let fixture: ComponentFixture<TagSelectorComponent>;
  let mockRitService: jasmine.SpyObj<RitService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTags: string[];

  beforeEach(waitForAsync(() => {
    mockTags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];

    mockRitService = jasmine.createSpyObj('RitService', ['getAllTags']);
    mockRitService.getAllTags.and.returnValue(of(mockTags));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        TagSelectorComponent,
        FormsModule,
        IonicModule
      ],
      providers: [
        {provide: RitService, useValue: mockRitService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TagSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load available tags on initialization', () => {
    expect(mockRitService.getAllTags).toHaveBeenCalled();
    expect(component.availableTags).toEqual(mockTags);
  });

  it('should filter available tags on initialization', () => {
    expect(component.filteredTags).toEqual(mockTags);
  });

  it('should not show already selected tags in filtered tags', () => {
    component.selectedTags = ['Tag1'];
    component.filterTags();
    fixture.detectChanges();

    expect(component.filteredTags).toContain('Tag2');
    expect(component.filteredTags).not.toContain('Tag1');
  });

  it('should filter tags based on input', () => {
    component.newTag = '1';
    component.filterTags();
    fixture.detectChanges();

    expect(component.filteredTags).toContain('Tag1');
    expect(component.filteredTags).not.toContain('nonexistingTag');
  });

  it('should select a tag when clicked', () => {
    spyOn(component.tagsChange, 'emit');
    component.selectTag('newTag');

    expect(component.selectedTags).toContain('newTag');
    expect(component.tagsChange.emit).toHaveBeenCalledWith(component.selectedTags);
  });

  it('should add a new tag when entered', () => {
    spyOn(component.tagsChange, 'emit');
    component.newTag = 'newTag';

    const inputEl = {value: ''} as any;
    component.addNewTag(inputEl, 'enter');

    expect(component.selectedTags).toContain('newTag');
    expect(component.tagsChange.emit).toHaveBeenCalledWith(component.selectedTags);
    expect(component.newTag).toBe('');
  });

  it('should not add empty or whitespace tags', () => {
    spyOn(component.tagsChange, 'emit');
    component.newTag = '   ';

    const inputEl = {value: ''} as any;
    component.addNewTag(inputEl, 'enter');

    expect(component.selectedTags.length).toBe(0);
    expect(component.tagsChange.emit).not.toHaveBeenCalled();
  });

  it('should not add duplicate tags', () => {
    component.selectedTags = ['Tag1'];
    spyOn(component.tagsChange, 'emit');
    component.newTag = 'Tag1';

    const inputEl = {value: ''} as any;
    component.addNewTag(inputEl, 'enter');

    expect(component.selectedTags.length).toBe(1);
    expect(component.tagsChange.emit).not.toHaveBeenCalled();
  });

  it('should remove a tag when clicked', () => {
    component.selectedTags = ['Tag1', 'Tag2'];
    spyOn(component.tagsChange, 'emit');

    component.removeTag('Tag1');

    expect(component.selectedTags).not.toContain('Tag1');
    expect(component.selectedTags).toContain('Tag2');
    expect(component.tagsChange.emit).toHaveBeenCalledWith(component.selectedTags);
  });

  it('should not remove tags when component is disabled', () => {
    component.selectedTags = ['Tag1', 'Tag2'];
    component.disabled = true;
    spyOn(component.tagsChange, 'emit');

    component.removeTag('Tag1');

    expect(component.selectedTags).toContain('Tag1');
    expect(component.tagsChange.emit).not.toHaveBeenCalled();
  });

  it('should update filteredTags when selectedTags changes', () => {
    spyOn(component, 'filterTags');
    component.selectedTags = ['Tag1'];

    component.ngOnChanges({
      selectedTags: {} as any
    });

    expect(component.filterTags).toHaveBeenCalled();
  });

  it('should update filteredTags when disabled status changes', () => {
    spyOn(component, 'filterTags');
    component.disabled = true;

    component.ngOnChanges({
      disabled: {} as any
    });

    expect(component.filterTags).toHaveBeenCalled();
  });

  it('should not navigate to the tag route when not disabled', () => {
    const tagName = 'Tag1';
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.disabled = false;
    component.navigateToTag(tagName, event);

    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/tabs/rits'], {queryParams: {tag: tagName}});
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should navigate when disabled is true', () => {
    const tagName = 'Tag1';
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.disabled = true;
    component.navigateToTag(tagName, event);

    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

});
