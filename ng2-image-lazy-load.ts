import {ImageLazyLoaderService} from './src/client/app/providers/image-lazy-load.provider';
import {WebWorkerService} from './src/client/app/providers/web-worker.provider';
import {IMAGELAZYLOAD_DIRECTIVES} from './src/client/app/directives/image-lazy-load.directive';

export * from './src/client/app/providers/image-lazy-load.provider';
export * from './src/client/app/providers/web-worker.provider';
export * from './src/client/app/directives/image-lazy-load.directive';

export const IMAGELAZYLOAD_PROVIDERS: any[] = [
  ImageLazyLoaderService,
  WebWorkerService
];

export default {
  directives: [IMAGELAZYLOAD_DIRECTIVES],
  providers: [IMAGELAZYLOAD_PROVIDERS]
}

