import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bug, eye, lockClosed, person } from 'ionicons/icons';
import { ButtonComponent } from '../common-components/button/button.component';
import { ToastService } from 'src/app/services/toast.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { SqliteService } from 'src/app/services/sqlite.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [IonicModule, FormsModule, ButtonComponent, ReactiveFormsModule],
})
export class LoginFormComponent {
  loginForm = new FormGroup({
    username: new FormControl<string | null>('smith', [Validators.required]),
    password: new FormControl<string | null>('Propel@123', [
      Validators.required,
    ]),
  });

  private toastService: ToastService = inject(ToastService);
  private communicationService: CommunicationService =
    inject(CommunicationService);
  private sqliteService:SqliteService=inject(SqliteService);

  constructor() {
    addIcons({
      person,
      eye,
      lockClosed,
    });
  }

  handleSubmit() {
    const username = this.loginForm.get('username')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';
    if (this.loginForm.get('username')?.value === null) {
      this.toastService.showToast('Enter username', bug, 'danger');
    } else if (this.loginForm.get('password')?.value === null) {
      this.toastService.showToast('Enter password', bug, 'danger');
    } else {
      this.communicationService.triggerAction({ username, password });
    }
  }

  handleDemoClick(){
    this.sqliteService.getTableRows('responsibilities')
  }
}
