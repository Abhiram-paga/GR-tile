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
import { ISubInventory } from 'src/app/models/subinventories.interface';

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
  @Input() qtyValue: number | null | string = null;
  @Input() selectedSubInventory: string = '';
  @Input() selectedLocator: string = '';
  @Input() selectedUom: string = '';
  @Input() subInventories: ISubInventory[] = [];
  @Output() changeQuantity = new EventEmitter();
  @Output() subInvClick = new EventEmitter();
  @Output() locClick = new EventEmitter();
  @Output() changeCOO = new EventEmitter();
  @Output() slideChange = new EventEmitter<IDocs4ReceivingItems>();

  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  constructor() {
    addIcons({ chevronForward });
  }

  ngAfterViewInit() {
    const swiperElement = this.swiperEl.nativeElement;
    const swiperInstance = swiperElement.swiper;
    if (swiperInstance) {
      swiperInstance.slideTo(this.startIndex);

      swiperInstance.on('slideChange', () => {
        const activeIndex = swiperInstance.activeIndex;
        const currentItem: IDocs4ReceivingItems = this.items[activeIndex];
        if (currentItem) {
          this.slideChange.emit(currentItem);
        }
      });
    }
  }

  handelSubInvClick(i: number) {
    this.subInvClick.emit(i);
  }

  handleLocatorsClick(i: number) {
    this.locClick.emit(i);
  }

  handleChangeCOO(event: any) {
    this.changeCOO.emit(event.target.value);
  }

  handleQuantityChange(event: InputCustomEvent<FocusEvent>, i: number) {
    this.changeQuantity.emit({ value: event?.target?.value, index: i });
  }
}
