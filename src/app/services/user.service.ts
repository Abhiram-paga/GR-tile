import { inject, Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { IRoot, IUser } from '../models/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService: ApiRequestService = inject(ApiRequestService);
  constructor() {}

  loginUser(user: IUser): Observable<IRoot> {
    return this.apiService.request<IRoot>('POST', '20D/login', {
      ...user,
      isSSO: 'N',
    });
  }
}
