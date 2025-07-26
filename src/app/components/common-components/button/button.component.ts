import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [IonicModule],
})
export class ButtonComponent {
  @Input() label: string = 'Click';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() fill: 'clear' | 'outline' | 'solid' = 'solid';
  @Input() expand: 'full' | 'block' = 'block';
  @Input() class: string = '';
  @Input() disabled: boolean = false;
  @Output() buttonClicked = new EventEmitter<any>();

  handleClick() {
    this.buttonClicked.emit();
  }
}
