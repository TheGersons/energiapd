import { Observable } from 'rxjs';
import { ToolModel } from './tool.model';

export abstract class ToolRepository {
  abstract findAllTools(): Observable<ToolModel[]>;
  abstract findOneTool(tool: Partial<ToolModel>): Observable<ToolModel>;
  abstract createTool(param: {
    tool: ToolModel;
    image?: File;
  }): Observable<ToolModel>;
  abstract updateTool(param: {
    tool: ToolModel;
    image?: File;
  }): Observable<number>;
  abstract deleteTool(id: string): Observable<number>;
}
