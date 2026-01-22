import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { ToolModel } from '../tool.model';
import { ToolRepository } from '../tool.repository';

@Injectable({
  providedIn: 'root',
})
export class FindAllToolsUseCase implements UseCase<{}, ToolModel[]> {
  private toolRepository = inject(ToolRepository);

  execute(params: {}): Observable<ToolModel[]> {
    return this.toolRepository.findAllTools();
  }
}
