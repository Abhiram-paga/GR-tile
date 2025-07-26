import { inject, Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { IUserLogin, IUser, IUserLoginRes } from '../models/user.interface';
import { Observable } from 'rxjs';
import { SqliteService } from './sqlite.service';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService: ApiRequestService = inject(ApiRequestService);
  private sqliteService: SqliteService = inject(SqliteService);
  private commonService: CommunicationService = inject(CommunicationService);

  userLoginResponseResponsibilities: IUserLoginRes[] = [];
  // userResponsibilitiesSub = new BehaviorSubject<IData[]>([]);
  // userResponsibilities$: Observable<IData[]> =
  //   this.userResponsibilitiesSub.asObservable();
  // constructor() {}

  loginUser(user: IUser): Observable<IUserLogin> {
    return this.apiService.request<IUserLogin>('POST', '/EBS/20D/login', {
      ...user,
      isSSO: 'N',
    });
  }

  async handelLoginResponse(res: IUserLogin) {
    try {
      await this.sqliteService.createTable(res.metadata, 'responsibilities');
      await this.sqliteService.deleteAllRows('responsibilities');
      let chunks = this.commonService.divideResponseIntoChunks(res.data, 50);
      await Promise.all(
        chunks.map((chunk) =>
          this.sqliteService.insertValuesToTable(
            'responsibilities',
            chunk,
            res.metadata
          )
        )
      );

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
