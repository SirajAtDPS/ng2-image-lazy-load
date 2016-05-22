[![Dependency Status](https://david-dm.org/NathanWalker/ng2-image-lazy-load.svg)](https://david-dm.org/NathanWalker/ng2-image-lazy-load)
[![devDependency Status](https://david-dm.org/NathanWalker/ng2-image-lazy-load/dev-status.svg)](https://david-dm.org/NathanWalker/ng2-image-lazy-load#info=devDependencies)

# ng2-image-lazy-load

Demo: https://ng2-image-lazy-load-demo.herokuapp.com

## Installation
```sh
npm i ng2-image-lazy-load --save
```

## Example implementation

You will need to add `IMAGELAZYLOAD_PROVIDERS` in the bootstrap of your application.

This library utilizes `WebWorkers` (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) for background loading of images. 

By default, the location of the worker file is `assets/js/xhrWorker.js`. You can copy the `xhrWorker.js` file for your own use from this repo or you can create your own.

To set a custom path to load your worker file:
```
WebWorker.workerUrl = 'path/to/your/custom_worker.js'
```
The example below will help illustrate this.

Also, ensure you've loaded the angular2/http bundle as well as this library falls back to using `Http` wherever `Worker` is not supported.

```js
import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {
  IMAGELAZYLOAD_PROVIDERS, 
  IMAGELAZYLOAD_DIRECTIVES, 
  WebWorkerService} from 'ng2-image-lazy-load/ng2-image-lazy-load';

@Component({
    selector: 'app',
    template: `
      <div imageLazyLoadArea>
        <div *ngFor="let image of images">
          <img [imageLazyLoadItem]="image.url"/>
        </div>
      </div>
    `,
    directives: [IMAGELAZYLOAD_DIRECTIVES]
})
export class App {
    public images: Array<any> = [
      {
        name:`image 1`,
        url:`image.jpg`
      },
      {
        name:`image 2`,
        url:`image_2.jpg`
      }
    ];
    constructor() {
        // defaults to 'assets/js/xhrWorker.js'
        WebWorkerService.workerUrl = 'path/to/your/custom_worker.js'; 
    }
}

bootstrap(App, [
    HTTP_PROVIDERS,
    IMAGELAZYLOAD_PROVIDERS
]);
```

## API
### ImageLazyLoaderService
#### Properties:
- `imageCache:any`: Object where the key is the url of the image the library has already loaded and doesn't need to be loaded again. i.e., {'http://domain.com/image.png':true}
    
#### Methods:
- `load(url: string, headers?: any): Promise<any>`: Load url with optional custom headers
- `loadViaWorker(url: string, headers?: any): Promise<any>`: Use a webworker directly to load url with optional custom headers
- `loadViaHttp(url: string, headers?: any): Promise<any>`: Use the `Http` service directly to load url with optional custom headers

### WebWorkerService
##### This is a helper service used by the library that wraps the usage of the browser's `Worker` api, however you can use it directly if you'd like to interact with it.
#### Properties:
- `static supported: boolean`: Determine if workers are supported
- `static workerUrl: string`: Used to set the path to a worker file. Defaults to 'assets/js/xhrWorker.js'
- `activeWorkers: Array<any>`: At any given moment, this can be checked to see how many workers are currently activated
    
#### Methods:
- `load(config: any, msgFn: any, errorFn?: any):number`: Load a configuration with your worker and wire it to a `message` function and/or an `error` function. Returns an `id` which can be used to terminate the worker.
- `terminate(id: number)`: Terminate the worker 


# How to contribute

See [CONTRIBUTING](https://github.com/NathanWalker/ng2-image-lazy-load/blob/master/CONTRIBUTING.md)

# Big Thank You

This library was made possible with help from this article by [Olivier Combe](https://github.com/ocombe):
https://medium.com/@OCombe/how-to-publish-a-library-for-angular-2-on-npm-5f48cdabf435

Also, this project setup is based on the excellent [angular2-seed](https://github.com/mgechev/angular2-seed) by [Minko Gechev](https://github.com/mgechev).

# License

MIT
