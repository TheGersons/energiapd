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
  private baseURL = `${environment.baseURL}tool`;

  override createTool(param: {
    tool: ToolModel;
    image?: File;
  }): Observable<ToolModel> {
    const entity = this.toolMapper.mapTo(param.tool);

    const formData = new FormData();

    Object.entries(entity).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (param.image) {
      formData.append('image', param.image);
    }

    return this.http
      .post<ToolEntity>(`${this.baseURL}`, formData)
      .pipe(map(this.toolMapper.mapFrom));
  }

  override findAllTools(): Observable<ToolModel[]> {
    return this.http
      .get<ToolEntity[]>(`${this.baseURL}`)
      .pipe(map(this.toolsMapper.mapFrom));
  }

  override findOneTool(tool: Partial<ToolModel>): Observable<ToolModel> {
    return this.http
      .get<ToolEntity>(`${this.baseURL}/one`, {
        params: this.partialToolMapper.mapTo(tool),
      })
      .pipe(map(this.toolMapper.mapFrom));
  }

  override updateTool(param: {
    tool: ToolModel;
    image?: File;
  }): Observable<number> {
    console.log(param);
    const entity = this.toolMapper.mapTo(param.tool);

    const formData = new FormData();

    Object.entries(entity).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (param.image) {
      formData.append('image', param.image);
    }

    return this.http.put<number>(`${this.baseURL}`, formData);
  }

  override deleteTool(id: string): Observable<number> {
    return this.http.delete<number>(`${this.baseURL}`, {
      params: { id },
    });
  }
}
