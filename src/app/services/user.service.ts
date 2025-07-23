import { inject, Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { IData, IRoot, IUser } from '../models/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService: ApiRequestService = inject(ApiRequestService);
  private sqliteService:SqliteService=inject(SqliteService);

  userResponsibilitiesSub = new BehaviorSubject<IData[]>([]);
  userResponsibilities$: Observable<IData[]> =
    this.userResponsibilitiesSub.asObservable();
  constructor() {}

  loginUser(user: IUser): Observable<IRoot> {
    return this.apiService.request<IRoot>('POST', '20D/login', {
      ...user,
      isSSO: 'N',
    });
  }

   async handelLoginResponse(res: IRoot) {
    await this.sqliteService.createTable(res.metadata, 'responsibilities');
    await this.sqliteService.deleteAllRows('responsibilities');
    await this.sqliteService.insertValuesToTable(
      'responsibilities',
      res.data,
      res.metadata
    );
  }

}
