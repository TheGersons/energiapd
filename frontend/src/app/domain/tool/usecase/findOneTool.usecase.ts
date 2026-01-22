import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { ToolRepository } from '../tool.repository';
import { ToolModel } from '../tool.model';

@Injectable({
  providedIn: 'root',
})
export class FindOneToolUseCase implements UseCase<{}, Partial<ToolModel>> {
  private toolRepository = inject(ToolRepository);

  execute(params: Partial<ToolModel>): Observable<ToolModel> {
    return this.toolRepository.findOneTool(params);
  }
}
