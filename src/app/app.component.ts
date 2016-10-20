import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mydate: string = "2016-12-25T00:00";
  title = 'app works!';

  constructor() {
    window['CAPP'] = this;
  }
}
