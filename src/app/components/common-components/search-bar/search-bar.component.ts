import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [IonicModule],
})
export class SearchBarComponent implements OnInit {
  @Output() searchInputChanged = new EventEmitter<any>();
  @Input() searchTxt:string='';

  constructor() {}

  ngOnInit() {}

  handleSearchChange(event: any) {
    this.searchInputChanged.emit(event.target.value);
  }
}
