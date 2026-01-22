import { Observable } from 'rxjs';
import { ToolModel } from './tool.model';

export abstract class ToolRepository {
  abstract findAllTools(): Observable<ToolModel[]>;
  abstract findOneTool(tool: Partial<ToolModel>): Observable<ToolModel>;
  abstract createTool(tool: ToolModel): Observable<ToolModel>;
  abstract updateTool(role: ToolModel): Observable<number>;
}
