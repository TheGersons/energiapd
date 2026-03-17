import { Component } from '@angular/core';
import { Create } from '../create/create';

@Component({
  selector: 'app-public',
  imports: [Create],
  templateUrl: './public.html',
  styleUrl: './public.scss',
})
export class Public {}
