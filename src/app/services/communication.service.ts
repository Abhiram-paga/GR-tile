import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IUser } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private readonly actionSource = new Subject<IUser>();
  action$ = this.actionSource.asObservable();

  triggerAction(user:IUser) {
    this.actionSource.next(user);
  }
}
