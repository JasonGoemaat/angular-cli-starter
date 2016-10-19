import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedComponent } from './shared.component';

@NgModule({
  declarations: [
    SharedComponent
  ],
  imports: [
    FormsModule
  ],
  exports: [
    SharedComponent
  ],
  providers: []
})
export class SharedModule { }
