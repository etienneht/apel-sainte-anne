import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-need-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './need-card.html',
  styleUrl: './need-card.css',
})
export class NeedCard {
  @Input() need!: any;
  @Output() volunteer = new EventEmitter<number>();

  onClick() {
    this.volunteer.emit(this.need.id);
  }
}



