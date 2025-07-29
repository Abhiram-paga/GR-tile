import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteService } from './services/sqlite.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private sqliteService: SqliteService = inject(SqliteService);
  private platform: Platform = inject(Platform);
  constructor() {
    this.initializeDB();
  }

  async initializeDB() {
    await this.platform.ready();
    await this.sqliteService.initDB();
  }
}
