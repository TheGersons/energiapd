import { Component, inject, OnInit, resource, signal } from '@angular/core';
import { AnimeModel } from '@domain/anime/anime.model';
import { GetAnimeUseCase } from '@domain/anime/usecase/get-anime.usecase';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-album',
  imports: [],
  templateUrl: './album.html',
  styleUrl: './album.scss',
})
export class Album {
  private album = inject(GetAnimeUseCase);

  anime = resource({
    loader: async () => await firstValueFrom(this.album.execute()),
  });
}
