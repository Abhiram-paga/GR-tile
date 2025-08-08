import { Component, inject, Input, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { BackIconComponent } from '../back-icon/back-icon.component';
import { HomeIconComponent } from '../home-icon/home-icon.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, BackIconComponent, HomeIconComponent],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() class: string = 'itemDetailsHeader';

  private navController: NavController = inject(NavController);
  constructor() {}

  ngOnInit() {}

  handleBackIconClick() {
    this.navController.back();
  }
  handleHomeIconClick(){
    this.navController.navigateRoot('/home');
  }
}
