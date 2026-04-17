import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeroService } from '../../../core/services/hero/hero.service';
import { Hero } from '../../../model/hero.model';

@Component({
  selector: 'app-my-heroes-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-heroes-component.html',
  styleUrl: './my-heroes-component.css',
})
export class MyHeroesComponent implements OnInit {
  heroes: Hero[] = [];
  loading = true;
  error: string | null = null;

  constructor(private heroService: HeroService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMyHeroes();
  }

  private loadMyHeroes(): void {
    this.loading = true;
    this.error = null;

    this.heroService.getMyHeroes().subscribe({
      next: (data) => {
        try {
          this.heroes = data.sort((a, b) => 
            a.codename.localeCompare(b.codename)
          );
          this.loading = false;
          this.cdr.detectChanges();
        } catch (err) {
          console.error('Error processing heroes:', err);
          this.error = 'Error processing heroes data';
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading heroes:', err);
        this.error = 'Failed to load your heroes. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreateHero(): void {
    this.router.navigate(['/heroes/new']);
  }

  onEditHero(heroId: number): void {
    this.router.navigate(['/heroes', heroId, 'edit']);
  }

  onRegisterHero(heroId: number): void {
    this.heroService.registerHero(heroId).subscribe({
      next: () => {
        this.loadMyHeroes();
      },
      error: (err) => {
        console.error('Error registering hero:', err);
        alert('Failed to register hero. ' + (err.error?.message || ''));
      }
    });
  }

  onRetireHero(heroId: number): void {
    if (confirm('Are you sure you want to retire this hero?')) {
      this.heroService.retireHero(heroId).subscribe({
        next: () => {
          this.loadMyHeroes();
        },
        error: (err) => {
          console.error('Error retiring hero:', err);
          alert('Failed to retire hero. ' + (err.error?.message || ''));
        }
      });
    }
  }

  onDeleteHero(heroId: number): void {
    if (confirm('Are you sure you want to delete this hero? This action cannot be undone.')) {
      this.heroService.deleteHero(heroId).subscribe({
        next: () => {
          this.loadMyHeroes();
        },
        error: (err) => {
          console.error('Error deleting hero:', err);
          alert('Failed to delete hero. ' + (err.error?.message || ''));
        }
      });
    }
  }

  canRegister(hero: Hero): boolean {
    return hero.status ? hero.status === 'Draft' : false;
  }

  canRetire(hero: Hero): boolean {
    return hero.status ? hero.status === 'Registered' : false;
  }

  canDelete(hero: Hero): boolean {
    return hero.status ? hero.status === 'Draft' : false;
  }

  getStatusClass(status: any): string {
    if (!status) return '';
    return String(status).toLowerCase();
  }
}
