import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-user',
  imports: [FormsModule, NgSelectModule],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {}
