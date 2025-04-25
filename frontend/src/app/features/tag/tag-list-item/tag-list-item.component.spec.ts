import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TagListItemComponent } from './tag-list-item.component';

describe('TagListItemComponent', () => {
    let component: TagListItemComponent;
    let fixture: ComponentFixture<TagListItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TagListItemComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(TagListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeFalsy();
    });

    it('should render the tag name and ritCount in the template', () => {
        component.tag = { name: 'Test Tag', ritCount: 5 };
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Test Tag');
        expect(compiled.textContent).toContain('4');
    });
});