import { Observable } from 'rxjs';
import { Album } from '@domain/album/album.model';

export abstract class AlbumGateway {
  abstract getByID(id: String): Observable<Album>;
  abstract getAll(): Observable<Array<Album>>;
  abstract saveNew(_alb: Album): Observable<void>;
}
