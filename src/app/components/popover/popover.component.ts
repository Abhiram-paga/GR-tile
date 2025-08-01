import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { funnel, refresh, reload, swapVertical } from 'ionicons/icons';
import { HOME_PAGE } from 'src/app/constants/home-page';


@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class PopoverComponent implements OnInit {
  private popOverController: PopoverController = inject(PopoverController);

  popOverOptionsList: { name: string; iconName: string }[] = [];
  @Output() popoverOptionClick = new EventEmitter();

  constructor() {
    addIcons({
      refresh,
      reload,
      funnel,
      swapVertical,
    });
  }

  ngOnInit() {
    this.popOverOptionsList = HOME_PAGE.POP_OVER_OPTIONS;
  }

  handlePopOverOptionClick(name: string) {
    this.popOverController.dismiss();
    this.popoverOptionClick.emit(name);
  }
}
