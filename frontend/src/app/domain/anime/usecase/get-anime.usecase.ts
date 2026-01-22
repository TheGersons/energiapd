import { Observable } from 'rxjs';
import { UseCase } from '@base/use-case';
import { AnimeModel } from '@domain/anime/anime.model';
import { AnimeRepository } from '@domain/anime/anime.repository';
import { inject, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class GetAnimeUseCase implements UseCase<{}, AnimeModel> {
  constructor(private _animeRepository: AnimeRepository) {}

  execute(): Observable<AnimeModel> {
    return this._animeRepository.getAnime();
  }
}
