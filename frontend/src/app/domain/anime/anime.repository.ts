import { Observable } from 'rxjs';
import { AnimeModel } from './anime.model';

export abstract class AnimeRepository {
  abstract getAnime(): Observable<AnimeModel>;
}
