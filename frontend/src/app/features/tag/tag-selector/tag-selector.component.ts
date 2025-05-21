import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonInput} from '@ionic/angular/standalone';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {RitService} from '../../../shared/services/rit.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ...IonicStandaloneStandardImports],
})
export class TagSelectorComponent implements OnChanges {
  @Input() selectedTags: string[] = [];
  @Input() disabled: boolean = false;
  @Output() tagsChange = new EventEmitter<string[]>();
  @ViewChild('tagInput') tagInput!: IonInput;

  filteredTags: string[] = [];
  newTag: string = '';
  availableTags: string[] = [];

  constructor(private readonly ritService: RitService, private readonly router: Router) {
    // Get tags from rit service
    this.ritService.getAllTags().subscribe(tags => {
      this.availableTags = tags;
      this.filterTags();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled'] || changes['selectedTags']) {
      this.filterTags();
    }
  }

  filterTags() {
    if (!this.newTag?.trim()) {
      this.filteredTags = this.availableTags.filter(tag =>
        !this.selectedTags.includes(tag)
      );
    } else {
      this.filteredTags = this.availableTags.filter(tag =>
        tag.toLowerCase().includes(this.newTag.toLowerCase()) &&
        !this.selectedTags.includes(tag)
      );
    }
  }

  selectTag(tag: string) {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.tagsChange.emit(this.selectedTags);
      this.filterTags();
    }
    this.newTag = '';

    setTimeout(() => this.tagInput.setFocus(), 100);
  }

  navigateToTag(tagName: string, event: Event): void {
    if (this.disabled) {
      this.router.navigate(['/tabs/rits'], {
        queryParams: {tag: tagName}
      });
    }
    event.stopPropagation();
  }

  addNewTag(inputEl: IonInput, action: string) {
    const tag = this.newTag?.trim();
    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.tagsChange.emit(this.selectedTags);
    }
    this.newTag = '';
    this.filterTags();
  }

  removeTag(tag: string) {
    if (!this.disabled) {
      const index = this.selectedTags.indexOf(tag);
      if (index > -1) {
        this.selectedTags.splice(index, 1);
        this.tagsChange.emit(this.selectedTags);

        if (this.availableTags.includes(tag)) {
          this.filterTags();
        }
      }
    }
  }
}
