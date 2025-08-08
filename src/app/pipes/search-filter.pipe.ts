import { Pipe, PipeTransform } from '@angular/core';
import { IDocs4ReceivingItems } from '../models/docs4receiving.interface';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(
    allItems: IDocs4ReceivingItems[],
    searchText: string
  ): IDocs4ReceivingItems[] {
    return allItems.filter(
      (items) =>
        items.ItemNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        items.ItemDesc.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
