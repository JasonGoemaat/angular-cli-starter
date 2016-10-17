import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'acs-shared',
  templateUrl: 'shared.component.html'
})
export class SharedComponent implements OnInit {
  @Input() name: string = "world";

  constructor() { }

  ngOnInit() { }
}
