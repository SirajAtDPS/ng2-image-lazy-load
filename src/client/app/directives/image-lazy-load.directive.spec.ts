import {
  async,
  describe,
  expect,
  inject,
  it,
  xit
} from '@angular/core/testing';
import {
  TestComponentBuilder
} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {IMAGELAZYLOAD_DIRECTIVES} from './image-lazy-load.directive';

export function main() {
  describe('image-lazy-load directives', () => {
    
    // xit('should setup correctly', inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder, async) => {
    //   // TODO: work out testing the directives
    //   var html = `
    //     <div imageLazyLoadArea>
    //       <div *ngFor="#image of images">
    //         <img [imageLazyLoadItem]="image.url"/>
    //       </div>
    //     </div>
    //   `;

    //   tcb.overrideTemplate(TestComponent, html)
    //       .createAsync(TestComponent)
    //       .then((fixture) => {
    //         fixture.detectChanges();
    //         expect(DOM.querySelectorAll(fixture.debugElement.nativeElement, 'image-lazy-load-area').length)
    //             .toEqual(1);
    //         //expect(fixture.debugElement.nativeElement).toHaveText('');
    //         async.done();
    //       });
    // }));
  });
}

@Component({
  selector: 'test-cmp',
  directives: [IMAGELAZYLOAD_DIRECTIVES]  
})
class TestComponent {
  public images: Array<any> = [
    {
      name:`Oneonta Falls 1`,
      url:`assets/img/oneonta.jpg`
    },
    {
      name:`Oneonta Falls 2`,
      url:`assets/img/DSC01920-L.jpg`
    }
  ];
}
