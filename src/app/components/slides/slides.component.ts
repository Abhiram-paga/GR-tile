import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InputCustomEvent } from '@ionic/angular';
import { IDocs4ReceivingItems } from 'src/app/models/docs4receiving.interface';
import { ScanBarComponent } from '../scan-bar/scan-bar.component';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
  imports: [IonicModule, CommonModule, ScanBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SlidesComponent {
  @Input() items: IDocs4ReceivingItems[] = [];
  @Input() startIndex: number = 0;
  @Input() qtyValue:number|null=null;
  @Output() changeQuantity = new EventEmitter();


  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  constructor() {
    addIcons({ chevronForward });
  }

  ngAfterViewInit() {
    const swiperElement = this.swiperEl.nativeElement;
    const swiperInstance = swiperElement.swiper;
    if (swiperInstance) {
      swiperInstance.slideTo(this.startIndex);
    }
  }

  handleQuantityChange(event: InputCustomEvent<FocusEvent>) {
    this.changeQuantity.emit(event?.target?.value);
  }
}
