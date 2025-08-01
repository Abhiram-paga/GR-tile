import { Component, EventEmitter, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-back-icon',
  templateUrl: './back-icon.component.html',
  styleUrls: ['./back-icon.component.scss'],
  imports: [IonicModule],
})
export class BackIconComponent {
  @Output() backIconClicked = new EventEmitter();

  handleIconClick() {
    this.backIconClicked.emit();
  }

  constructor() {
    addIcons({
      chevronBack,
    });
  }
}
