import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(allItems: any[] = [], searchText: string = ''): any[] {
    if (!allItems.length || !searchText.trim()) {
      return allItems;
    }

    const lowerSearch = searchText.toLowerCase();

    return allItems.filter((item) => {
      return (
        item?.ItemNumber?.toLowerCase().includes(lowerSearch) ||
        item?.ItemDesc?.toLowerCase().includes(lowerSearch) ||
        String(item?.SubInventoryCode).toLowerCase().includes(lowerSearch) ||
        item?.Locator_PK?.toLowerCase().includes(lowerSearch)
      );
    });
  }
}
