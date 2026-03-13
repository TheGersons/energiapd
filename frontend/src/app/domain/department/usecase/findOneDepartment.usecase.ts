import { inject, Injectable } from "@angular/core";
import { UseCase } from "@base/use-case";
import { DepartmentModel } from "../department.model";
import { DepartmentRepository } from "../department.repository";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FindOneDepartmentUseCase implements UseCase<string, DepartmentModel> {
    private repository = inject(DepartmentRepository)

    execute(params: string): Observable<DepartmentModel> {
        return this.repository.findOneDepartment(params)
    }
}