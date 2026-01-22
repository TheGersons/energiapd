import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-computer-inventory',
  imports: [],
  templateUrl: './computer-inventory.html',
  styleUrl: './computer-inventory.scss',
})
export class ComputerInventory {
  toggleModal = signal<boolean>(false);
}
