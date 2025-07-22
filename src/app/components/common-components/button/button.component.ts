import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [IonicModule],
})
export class ButtonComponent {
  @Input() label: String = 'Click';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() fill: 'clear' | 'outline' | 'solid' = 'solid';
  @Input() expand:'full' | 'block'='block';
  @Input() class:string='';
}
