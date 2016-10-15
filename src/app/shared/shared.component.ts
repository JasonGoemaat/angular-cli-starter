import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'acs-shared',
  templateUrl: 'shared.component.html'
})
export class SharedComponent implements OnInit {
  name: string = "world";

  constructor() { }

  ngOnInit() { }

}
