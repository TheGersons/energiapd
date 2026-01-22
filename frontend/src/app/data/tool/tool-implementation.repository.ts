import { inject, Injectable } from '@angular/core';
import { ToolMapper } from './mapper/tool.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { ToolModel } from '@domain/tool/tool.model';
import { map, Observable } from 'rxjs';
import { ToolEntity } from './tool.entity';
import { ToolsMapper } from './mapper/tools.mapper';
import { ToolRepository } from '@domain/tool/tool.repository';
import { PartialToolMapper } from './mapper/partial-tool.mapper';

@Injectable({
  providedIn: 'root',
})
export class ToolImplementation extends ToolRepository {
  private toolMapper = new ToolMapper();
  private toolsMapper = new ToolsMapper();
  private partialToolMapper = new PartialToolMapper();
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}tool/`;

  override createTool(tool: ToolModel): Observable<ToolModel> {
    return this.http
      .post<ToolEntity>(`${this.baseURL}tool`, {
        tool: this.toolMapper.mapTo(tool),
      })
      .pipe(map(this.toolMapper.mapFrom));
  }

  override findAllTools(): Observable<ToolModel[]> {
    return this.http
      .get<ToolEntity[]>(`${this.baseURL}tools`)
      .pipe(map(this.toolsMapper.mapFrom));
  }

  override findOneTool(tool: Partial<ToolModel>): Observable<ToolModel> {
    return this.http
      .get<ToolEntity>(`${this.baseURL}tool`, {
        params: this.partialToolMapper.mapTo(tool),
      })
      .pipe(map(this.toolMapper.mapFrom));
  }

  override updateTool(tool: ToolModel): Observable<number> {
    return this.http.put<number>(`${this.baseURL}tool`, {
      tool: this.toolMapper.mapTo(tool),
    });
  }
}
