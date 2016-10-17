/* tslint:disable:no-unused-variable */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async } from '@angular/core/testing';
import { SharedComponent } from './shared.component';

    @Component({
      selector: 'test-component',
      template: `
        <acs-shared [(name)]='parentName'></acs-shared>
      `
    })
    class TestComponent {
      parentName: string;
    }

describe('SharedComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        SharedComponent
      ],
      imports: [
        FormsModule
      ]
    });
  });

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(SharedComponent);
    let component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it(`should have as default name 'world'`, async(() => {
    let fixture = TestBed.createComponent(SharedComponent);
    let component = fixture.debugElement.componentInstance;
    expect(component.name).toEqual('world');
  }));

  it('should render default message', async(() => {
    let fixture = TestBed.createComponent(SharedComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toEqual('Hello, world!');
  }));

  it('component should update with name from parent', async(() => {
    let fixture = TestBed.createComponent(TestComponent);
    let component = fixture.debugElement.componentInstance;
    component.parentName = 'should change';
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('h2 input').value().toEqual('should change');
  }));
});
