import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { type Hero } from '../../../model/hero.model';
import { type CreateHeroDto } from '../../../model/createHeroDto.model';


@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private apiUrl = `${environment.apiUrl}/heroes`;

  constructor(private http: HttpClient) {}

  
  getRegisteredHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/public`);
  }

  codenameExists(codename: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${codename}`);
  }

  getAll(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl);
  }

  getById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  createHero(dto: CreateHeroDto): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, dto);
  }

  registerHero(id: number): Observable<Hero> {
    return this.http.patch<Hero>(`${this.apiUrl}/${id}/register`, {});
  }

  retireHero(id: number): Observable<Hero> {
    return this.http.patch<Hero>(`${this.apiUrl}/${id}/retire`, {});
  }

  deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
