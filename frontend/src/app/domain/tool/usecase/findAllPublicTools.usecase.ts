import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { ToolModel } from '../tool.model';
import { ToolRepository } from '../tool.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllPublicToolsUseCase implements UseCase<void, ToolModel[]> {
  private repository = inject(ToolRepository);

  execute(params: void): Observable<ToolModel[]> {
    return this.repository.findAllPublicTools();
  }
}
