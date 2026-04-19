import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { type Hero } from '../../../model/hero.model';
import { type CreateHeroDto } from '../../../model/createHeroDto.model';
import { type CreatePowerDto } from '../../../model/createPowerDto.model';
import { type Power } from '../../../model/power.model';


@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  
  getRegisteredHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes/public`);
  }

  codenameExists(codename: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/heroes/exists/${codename}`);
  }

  getAll(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`);
  }

  getMyHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes/my-heroes`);
  }

  getById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/heroes/${id}`);
  }

  createHero(dto: CreateHeroDto): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/heroes`, dto);
  }

  updateHero(dto: CreateHeroDto & { id: number; userId: string }): Observable<Hero> {
    return this.http.post<Hero>(`${this.apiUrl}/heroes`, dto);
  }

  registerHero(id: number): Observable<Hero> {
    return this.http.post<Hero>(`${this.apiUrl}/heroes/${id}/register`, {});
  }

  retireHero(id: number): Observable<Hero> {
    return this.http.post<Hero>(`${this.apiUrl}/heroes/${id}/retire`, {});
  }

  deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/heroes/${id}`);
  }

  addPower(heroId: number, dto: CreatePowerDto): Observable<Power> {
    return this.http.post<Power>(`${this.apiUrl}/powers/${heroId}`, dto);
  }

  removePower(heroId: number, powerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/powers/${heroId}/${powerId}`);
  }
}
