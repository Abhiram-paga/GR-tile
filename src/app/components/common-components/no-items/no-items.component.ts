import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircle } from 'ionicons/icons';

@Component({
  selector: 'app-no-items',
  templateUrl: './no-items.component.html',
  styleUrls: ['./no-items.component.scss'],
  imports: [IonicModule],
})
export class NoItemsComponent {
  constructor() {
    addIcons({
      alertCircle,
    });
  }
}
