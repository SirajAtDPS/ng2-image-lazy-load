import {
  async,
  inject,
  describe,
  xdescribe,
  it,
  xit,
  expect,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import {Injector, provide} from '@angular/core';
import {BaseRequestOptions, ConnectionBackend, Http, HTTP_PROVIDERS, Response, ResponseOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {WebWorkerService} from './web-worker.provider';
import {WebWorkerStub} from './web-worker.provider.stub';
import {ImageLazyLoaderService} from './image-lazy-load.provider';

export function main() {
  describe('ImageLazyLoader Service', () => {
    const URL = 'http://www.example.com/test';
    
    let testResponse = new Response(new ResponseOptions({body: ''}));
    
    beforeEachProviders(() => {
      return [
        provide(WebWorkerService, { useClass: WebWorkerStub }),
        ImageLazyLoaderService,
        HTTP_PROVIDERS,
        BaseRequestOptions,
        MockBackend,
        provide(Http, {
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        })
      ];
    });

    // afterEach(() => backend.verifyNoPendingRequests());

    it('should have imageCache', inject([ImageLazyLoaderService], (imageLazyLoader) => {
      expect(imageLazyLoader.imageCache).toEqual({});  
    }));
    
    it('should load a url, set imageCache and resolve when complete', async(inject([MockBackend, ImageLazyLoaderService, WebWorkerService], (mockBackend, imageLazyLoader, webWorker) => {
      return new Promise((resolve, reject) => {
        mockBackend.connections.subscribe((c: any) => {
          c.mockRespond(testResponse);
        });
        imageLazyLoader.load(URL).then(() => {
          expect(imageLazyLoader.imageCache).toEqual({ 'http://www.example.com/test': true });
          //expect(webWorker.workersCalled).toBe(1);
          expect(webWorker.activeWorkers.length).toBe(0);
          resolve();
        }, (err) => {
          reject(err);
        });
      });
    })));
    
    it('should allow loading a url via WebWorker directly', async(inject([MockBackend, ImageLazyLoaderService, WebWorkerService], (mockBackend, imageLazyLoader, webWorker) => {
      return new Promise((resolve, reject) => {
        mockBackend.connections.subscribe((c: any) => {
          c.mockRespond(testResponse);
        });
        imageLazyLoader.loadViaWorker(URL).then(() => {
          expect(imageLazyLoader.imageCache).toEqual({'http://www.example.com/test':true});
          //expect(webWorker.workersCalled).toBe(1);
          expect(webWorker.activeWorkers.length).toBe(0);
          resolve();
        }, (err) => {
          reject(err);
        });
      });
    })));
    
    it('should allow loading a url via Http directly', async(inject([MockBackend, ImageLazyLoaderService, WebWorkerService], (mockBackend, imageLazyLoader, webWorker) => {
      return new Promise((resolve, reject) => {
        mockBackend.connections.subscribe((c: any) => {
          expect(c.request.headers.get('custom')).toBe(null);
          expect(c.request.url).toBe(URL);
          c.mockRespond(testResponse);
        });
        imageLazyLoader.loadViaHttp(URL).then(() => {
          expect(imageLazyLoader.imageCache).toEqual({ 'http://www.example.com/test': true });
          resolve();
        }, (err) => {
          reject(err);
        });
      });
    })));
    
    it('should allow custom headers', async(inject([MockBackend, ImageLazyLoaderService, WebWorkerService], (mockBackend, imageLazyLoader, webWorker) => {
      return new Promise((resolve, reject) => {
        mockBackend.connections.subscribe((c: any) => {
          expect(c.request.headers.get('custom')).toBe('header');
          expect(c.request.url).toBe(URL);
          c.mockRespond(testResponse);
        });
        imageLazyLoader.loadViaHttp(URL, {'custom':'header'}).then(() => {
          expect(imageLazyLoader.imageCache).toEqual({ 'http://www.example.com/test': true });
          resolve();
        }, (err) => {
          reject(err);
        });
      });
    })));
  });
}
