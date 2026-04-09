import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroService } from '../../core/services/hero/hero.service';
import { Hero } from '../../model/hero.model';

@Component({
  selector: 'app-home.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  heroes: Hero[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private heroService: HeroService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRegisteredHeroes();
  }

  private loadRegisteredHeroes(): void {
    this.loading = true;
    this.error = null;
    this.heroService.getRegisteredHeroes().subscribe({
      next: (data) => {
        this.heroes = data.sort((a, b) => 
          a.codename.localeCompare(b.codename)
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading heroes:', err);
        this.error = 'Failed to load heroes. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
