import { Component, ViewEncapsulation } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import {ImageLazyLoaderService} from './providers/image-lazy-load.provider';
import {WebWorkerService} from './providers/web-worker.provider';
import {IMAGELAZYLOAD_DIRECTIVES} from './directives/image-lazy-load.directive';
import {Observable as RxObservable} from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  viewProviders: [HTTP_PROVIDERS, ImageLazyLoaderService, WebWorkerService],
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [IMAGELAZYLOAD_DIRECTIVES]
})
export class AppComponent {
  public atTop: boolean = true;
  public images: Array<any> = [
    {
      id: 1,
      name:`Oneonta Falls 1`,
      url:`/dist/dev/assets/img/oneonta.jpg`
    },
    {
      id: 2,
      name:`Oneonta Falls 2`,
      url:`/dist/dev/assets/img/DSC01920-L.jpg`
    },
    {
      id: 3,
      name:`Oneonta Falls 3`,
      url:`/dist/dev/assets/img/oneonta-gorge-800x600.jpg`
    },
    {
      id: 4,
      name:`Oneonta Falls 4`,
      url:`/dist/dev/assets/img/oneonta-gorge-11.jpg`
    },
    {
      id: 5,
      name:`Oneonta Falls 5`,
      url:`/dist/dev/assets/img/IMG_2039.jpg`
    },
    {
      id: 6,
      name:`Oneonta Falls 6`,
      url:`/dist/dev/assets/img/horsetail_falls_9-b.jpg`
    },
    {
      id: 7,
      name:`Oneonta Falls 7`,
      url:`/dist/dev/assets/img/P1000662-L.jpg`
    },
    {
      id: 8,
      name:`Oneonta Falls 8`,
      url:`/dist/dev/assets/img/DSC01920-L.jpg`
    },
    {
      id: 9,
      name:`Oneonta Falls 9`,
      url:`/dist/dev/assets/img/IMG_8356_Medium.JPG`
    },
    {
      id: 10,
      name:`Oneonta Falls 10`,
      url:`/dist/dev/assets/img/IMG_2036.jpg`
    }
  ];
  constructor() {
    let scrollStream = RxObservable.fromEvent(window, 'scroll').debounceTime(500);
      
    scrollStream.subscribe(() => {
      this.atTop = window.pageYOffset < 25;   
    });
  }
  addImage(): void {
    this.images.push({
      id: 11,
      name: `Simpsons as the ${this.images.length+1}th image!`,
      url: `/dist/dev/assets/img/The-Simpsons-post2.jpg`,
      added: true
    });
    if (window.confirm(`You added an image dynamically, click "Ok" to scroll down to see it load in when you get there!`)) {
      setTimeout(function(){
        location.hash = '#11'; 
      }, 100);
      
    }
  }
}
