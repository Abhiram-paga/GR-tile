import { Component, EventEmitter, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { IonicModule } from '@ionic/angular';
import { home } from 'ionicons/icons';

@Component({
  selector: 'app-home-icon',
  templateUrl: './home-icon.component.html',
  styleUrls: ['./home-icon.component.scss'],
  imports: [IonicModule],
})
export class HomeIconComponent {
  @Output() homeIconClicked = new EventEmitter();

  constructor() {
    addIcons({ home });
  }

  handleHomeClick() {
    this.homeIconClicked.emit();
  }
}
