import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { ToolRepository } from '../tool.repository';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeleteToolUseCase implements UseCase<string, number> {
  private repository = inject(ToolRepository);

  execute(id: string): Observable<number> {
    return this.repository.deleteTool(id);
  }
}
