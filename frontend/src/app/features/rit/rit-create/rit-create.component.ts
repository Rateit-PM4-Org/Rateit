import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonBackButton, IonInput } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RitService } from '../../../shared/services/rit.service';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [IonBackButton, CommonModule, ...IonicStandaloneStandardImports],
})
export class RitCreateComponent implements OnInit {

  constructor(
    private readonly ritService: RitService,
    private readonly route: ActivatedRoute
  ) { }

  @Input() mode?: 'create' | 'edit' | 'view';
  @Input() ritId: string | undefined;

  tags: string[] = []
  tagsErrorMessage?: string
  ritName?: string
  ritNameErrorMessage?: string
  details?: string
  detailsErrorMessage?: string

  newTag?: string

  ngOnInit(): void {
    this.ritId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.ritId) {
      this.mode = 'view';
      this.ritService.getRit(this.ritId).subscribe((rit) => {
        this.ritName = rit.name;
        this.details = rit.details ?? '';
        this.tags = [...(rit.tags ?? [])];
      });
    } else {
      this.mode = 'create';
    }
  }

  setRitName(event: any) {
    this.ritName = event.target.value
  }

  setDetails(event: any) {
    this.details = event.target.value
  }

  setNewTag(event: any) {
    let input = event.target.value
    if (input) {
      this.newTag = input
    }
  }

  addTag(inputEl: IonInput, action: string) {
    const tag = this.newTag?.trim();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag)
      if (action === 'enter') {
        setTimeout(() => inputEl.setFocus(), 100)
      }
    }
    this.newTag = ''
  }

  removeTag(index: number) {
    this.tags.splice(index, 1)
  }

}
