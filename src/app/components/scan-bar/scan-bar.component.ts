import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  IDocs4ReceivingItems,
  IUniqueDocs,
} from 'src/app/models/docs4receiving.interface';
import { ISubInventory } from 'src/app/models/subinventories.interface';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-scan-bar',
  templateUrl: './scan-bar.component.html',
  styleUrls: ['./scan-bar.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ScanBarComponent {
  private toastController: ToastService = inject(ToastService);
  @Input() docsList: IUniqueDocs[] | IDocs4ReceivingItems[] | ISubInventory[] =
    [];
  @Input() matchField:
    | 'PoNumber'
    | 'ASNNumber'
    | 'RMANumber'
    | 'ItemNumber'
    | 'SubInventoryCode' = 'PoNumber';
  @Input() placeHolderText: string = 'Scan Doc';
  @Input() value: string | number = '';
  @Output() docFound = new EventEmitter();

  searchInput: string | number = '';
  timer: any;

  handleInputChange() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      const matchedDoc = this.docsList.find((doc: any) => {
        const value = doc[this.matchField];
        return String(value) === this.searchInput;
      });
      if (matchedDoc) {
        this.docFound.emit(this.searchInput);
        this.searchInput = '';
        this.value = '';
      } else {
        this.toastController.showToast(
          `Invalid #${this.searchInput}`,
          'alert',
          'danger'
        );
        this.searchInput = '';
        this.value = '';
      }
    }, 1000);
  }
}
