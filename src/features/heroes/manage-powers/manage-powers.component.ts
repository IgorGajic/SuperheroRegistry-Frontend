import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeroService } from '../../../core/services/hero/hero.service';
import { Hero } from '../../../model/hero.model';
import { CreatePowerDto } from '../../../model/createPowerDto.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-powers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-powers.component.html',
  styleUrl: './manage-powers.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ManagePowersComponent implements OnInit, OnDestroy {
  @Input() heroId!: number;
  @Input() hero!: Hero;
  @Input() onPowersUpdated!: (hero: Hero) => void;

  powerForm!: FormGroup;
  isLoading = false;
  isAddingPower = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  removingPowerId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.powerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
    });
    
    // Trigger change detection when form values change
    this.powerForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  onAddPower(): void {
    if (this.powerForm.invalid) {
      return;
    }

    this.isAddingPower = true;
    this.errorMessage = null;
    this.successMessage = null;

    const powerDto: CreatePowerDto = this.powerForm.value;

    this.heroService.addPower(this.heroId, powerDto).subscribe({
      next: (updatedHero: Hero) => {
        this.isAddingPower = false;
        this.successMessage = `Power "${powerDto.name}" added successfully!`;
        this.hero = updatedHero;
        this.powerForm.reset({ name: '', description: '' });
        this.onPowersUpdated(updatedHero);
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Failed to add power. Please try again.';
        this.isAddingPower = false;
        this.cdr.detectChanges();
      },
    });
  }

  onRemovePower(powerId: number): void {
    if (!confirm('Are you sure you want to remove this power?')) {
      return;
    }

    this.removingPowerId = powerId;

    this.heroService.removePower(this.heroId, powerId).subscribe({
      next: () => {
        this.heroService.getById(this.heroId).subscribe({
          next: (updatedHero: Hero) => {
            this.hero = updatedHero;
            this.removingPowerId = null;
            this.onPowersUpdated(updatedHero);
            this.cdr.detectChanges();
          },
        });
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Failed to remove power. Please try again.';
        this.removingPowerId = null;
        this.cdr.detectChanges();
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.powerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.powerForm.get(fieldName);
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

  get isAddButtonDisabled(): boolean {
    return !this.powerForm || this.powerForm.invalid || this.isAddingPower;
  }
}
