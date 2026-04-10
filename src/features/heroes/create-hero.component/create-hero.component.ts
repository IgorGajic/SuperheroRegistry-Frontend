import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeroService } from '../../../core/services/hero/hero.service';
import { CreateHeroDto } from '../../../model/createHeroDto.model';
import { Alignment } from '../../../model/alignment.enum';
import { Race } from '../../../model/race.enum';

@Component({
  selector: 'app-create-hero.component',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './create-hero.component.html',
  styleUrl: './create-hero.component.css',
})
export class CreateHeroComponent implements OnInit {
  heroForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  codenameExists = false;
  checkingCodename = false;

  alignmentOptions = Object.values(Alignment);
  raceOptions = Object.values(Race);

  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.heroForm = this.formBuilder.group({
      codename: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      originStory: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      race: ['', [Validators.required]],
      alignment: ['', [Validators.required]],
    });
  }

  onCodenameChange(): void {
    const codename = this.heroForm.get('codename')?.value;

    if (codename && codename.length >= 2) {
      this.checkingCodename = true;
      this.codenameExists = false;
      this.heroService.codenameExists(codename).subscribe({
        next: (exists) => {
          this.codenameExists = exists;
          this.checkingCodename = false;
        },
        error: (err) => {
          console.error('Error checking codename:', err);
          this.checkingCodename = false;
        },
      });
    } else {
      this.codenameExists = false;
    }
  }

  onCreateHero(): void {
    if (this.heroForm.invalid || this.codenameExists) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const createHeroDto: CreateHeroDto = this.heroForm.value;

    this.heroService.createHero(createHeroDto).subscribe({
      next: (hero) => {
        this.isLoading = false;
        this.successMessage = `Hero "${hero.codename}" created successfully!`;
        this.heroForm.reset();
        setTimeout(() => {
          this.router.navigate(['/my-heroes']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create hero. Please try again.';
        this.isLoading = false;
      },
    });
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
    return fieldName.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, (str) => str.toUpperCase());
  }

  navigateToMyHeroes(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/my-heroes']);
  }
}
