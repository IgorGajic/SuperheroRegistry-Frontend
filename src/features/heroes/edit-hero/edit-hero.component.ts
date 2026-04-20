import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeroService } from '../../../core/services/hero/hero.service';
import { Hero } from '../../../model/hero.model';
import { CreateHeroDto } from '../../../model/createHeroDto.model';
import { Alignment } from '../../../model/alignment.enum';
import { Race } from '../../../model/race.enum';
import { ManagePowersComponent } from '../manage-powers/manage-powers.component';

@Component({
  selector: 'app-edit-hero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ManagePowersComponent],
  templateUrl: './edit-hero.component.html',
  styleUrl: './edit-hero.component.css',
})
export class EditHeroComponent implements OnInit {
  heroForm!: FormGroup;
  isLoading = true;
  isSaving = false;
  isDeleting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hero: Hero | null = null;
  heroId!: number;

  alignmentOptions = Object.values(Alignment);
  raceOptions = Object.values(Race);

  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.heroId = params['id'];
      this.loadHero();
    });
  }

  private loadHero(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.heroService.getById(this.heroId).subscribe({
      next: (hero: Hero) => {
        this.hero = hero;
        this.initializeForm(hero);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load hero. Please try again.';
        console.error('Error loading hero:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private initializeForm(hero: Hero): void {
    this.heroForm = this.formBuilder.group({
      codename: [
        hero.codename,
        [Validators.required, Validators.minLength(1), Validators.maxLength(30)],
      ],
      originStory: [
        hero.originStory,
        [Validators.required, Validators.minLength(30), Validators.maxLength(100)],
      ],
      race: [hero.race, [Validators.required]],
      alignment: [hero.alignment, [Validators.required]],
    });
  }

  onSaveHero(): void {
    if (this.heroForm.invalid || !this.hero) {
      return;
    }

    this.isSaving = true;
    this.disableForm();
    this.errorMessage = null;
    this.successMessage = null;

    const updateDto = {
      ...this.heroForm.value,
      id: this.heroId,
      userId: this.hero.userId,
    };

    this.heroService.updateHero(updateDto).subscribe({
      next: (updatedHero: Hero) => {
        this.isSaving = false;
        this.successMessage = `Hero "${updatedHero.codename}" updated successfully!`;
        this.hero = updatedHero;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/heroes/my-heroes']);
        }, 1500);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Failed to update hero. Please try again.';
        this.isSaving = false;
        this.enableForm();
        this.cdr.detectChanges();
      },
    });
  }

  onDeleteHero(): void {
    if (!confirm(`Are you sure you want to delete "${this.hero?.codename}"? This action cannot be undone.`)) {
      return;
    }

    this.isDeleting = true;
    this.disableForm();
    this.errorMessage = null;

    this.heroService.deleteHero(this.heroId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.router.navigate(['/heroes/my-heroes']);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Failed to delete hero. Please try again.';
        this.isDeleting = false;
        this.enableForm();
        this.cdr.detectChanges();
      },
    });
  }

  private disableForm(): void {
    Object.keys(this.heroForm.controls).forEach((key) => {
      this.heroForm.get(key)?.disable();
    });
  }

  private enableForm(): void {
    Object.keys(this.heroForm.controls).forEach((key) => {
      this.heroForm.get(key)?.enable();
    });
  }

  onPowersUpdated(updatedHero: Hero): void {
    this.hero = updatedHero;
    this.cdr.detectChanges();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.heroForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.heroForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    if (field.errors['minlength']) {
      return `${this.formatFieldName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field.errors['maxlength']) {
      return `${this.formatFieldName(fieldName)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
    }
    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, (str) => str.toUpperCase());
  }

  navigateBack(): void {
    this.router.navigate(['/heroes/my-heroes']);
  }

  getStatusClass(): string {
    if (!this.hero || !this.hero.status) return '';
    return String(this.hero.status).toLowerCase();
  }
}
