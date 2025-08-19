import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { BackIconComponent } from '../back-icon/back-icon.component';
import { HomeIconComponent } from '../home-icon/home-icon.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { syncOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, BackIconComponent, HomeIconComponent, CommonModule],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() class: string = 'itemDetailsHeader';
  @Input() showSyncIcon: boolean = false;
  @Output() clickedSyncIcon = new EventEmitter();

  private navController: NavController = inject(NavController);
  constructor() {
    addIcons({ syncOutline });
  }

  ngOnInit() {}

  handleBackIconClick() {
    this.navController.back();
  }
  handleHomeIconClick() {
    this.navController.navigateRoot('/home');
  }

  handleSyncIconClick() {
    this.clickedSyncIcon.emit();
  }
}
