import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { LoginFormComponent } from 'src/app/components/login-form/login-form.component';
import { LOGOS } from 'src/assets/logo';
import { UserService } from 'src/app/services/user.service';
import { IRoot, IUser } from 'src/app/models/user.interface';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { ModelLoaderService } from 'src/app/services/model-loader.service';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LoginFormComponent],
})
export class LoginPage {
  logoPath = LOGOS.companyLogo;

  private userService: UserService = inject(UserService);
  private communicationService: CommunicationService =
    inject(CommunicationService);
  private loaderService: ModelLoaderService = inject(ModelLoaderService);
  private sqliteService: SqliteService = inject(SqliteService);

  subscriptions: Subscription = new Subscription();

  ngOnInit() {
    const sub2 = this.communicationService.action$.subscribe({
      next: (res: IUser) => {
        this.handleFormSubmission(res);
      },
    });
    this.subscriptions.add(sub2);
  }

  async handleFormSubmission(user: IUser) {
    await this.loaderService.show();
    try {
      const sub1 = this.userService.loginUser(user).subscribe({
        next: async (res: IRoot) => {
          console.log(res);
          this.loaderService.hide();
          await this.sqliteService.createTable(
            res.metadata,
            'responsibilities'
          );
          await this.sqliteService.deleteAllRows('responsibilities');
          await this.sqliteService.insertValuesToTable(
            'responsibilities',
            res.data,
            res.metadata
          );
          this.sqliteService.getTableRows('responsibilities');
        },
        error: (err) => {
          console.log(err);
        },
      });
      this.subscriptions.add(sub1);
    } catch (err) {
      console.log(err);
    }
  }

  ionViewDidLeave() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
