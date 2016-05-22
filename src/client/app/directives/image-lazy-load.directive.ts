import {Directive, Query, QueryList, Input, ElementRef, Renderer, forwardRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import {ImageLazyLoaderService} from '../providers/image-lazy-load.provider';

@Directive({
  selector: '[imageLazyLoadArea]'
})
export class ImageLazyLoadAreaDirective implements OnInit {
  @Input('imageLazyLoadArea') threshold: number;
  private items: QueryList<ImageLazyLoadItemDirective>;
  private itemsToLoad: Array<any>;
  private scrollSubscription: Subscription;

  constructor(@Query(forwardRef(() => ImageLazyLoadItemDirective), {descendants: true}) items: QueryList<ImageLazyLoadItemDirective>) {
    this.items = items;
  }
  loadInView(list?:Array<ImageLazyLoadItemDirective>):void {
    this.itemsToLoad = (list || this.itemsToLoad).filter((item) => !item.loaded && !item.loading);
    for (let item of this.itemsToLoad) {
      let ePos = item.getPosition();
      if (ePos.bottom > 0 && (ePos.bottom >= (window.pageYOffset - this.threshold)) && (ePos.top <= ((window.pageYOffset + window.innerHeight) + this.threshold))) {
        item.loadImage();
      }
    }
    if (this.itemsToLoad.length === 0) {
      // subscription is no longer needed
      this.scrollSubscription.unsubscribe();
      this.scrollSubscription = undefined;
    }
  }
  scrollSubscribe() {
    let scrollStream = Observable.fromEvent(window, 'scroll').debounceTime(250);

    this.scrollSubscription = scrollStream.subscribe(() => {
      this.loadInView();
    });
  }
  ngOnInit() {
    this.threshold = +this.threshold || 100;

    this.items.changes.subscribe((list) => {
      this.loadInView(list.toArray());
      if (!this.scrollSubscription) {
        this.scrollSubscribe();
      }
    });
  }
}

@Directive({
  selector: '[imageLazyLoadItem]'
})
export class ImageLazyLoadItemDirective {
  @Input('imageLazyLoadItem') imageLazyLoadItem: string;
  @Input() imageLazyLoadingContainer: string;
  @Input() imageLazyLoadConfig: any;
  public loading: boolean = false;
  public loaded: boolean = false;
  public error: boolean = false;
  private tagName: string;
  private loadingClass: string = 'loading';
  private loadedClass: string = 'loaded';
  private errorClass: string = 'error';

  constructor(private el: ElementRef, private renderer: Renderer, private lazyLoader: ImageLazyLoaderService) {
    this.tagName = el.nativeElement.tagName;

    if (typeof(this.imageLazyLoadConfig) === 'object') {
      this.loadingClass = this.imageLazyLoadConfig.loadingClass || this.loadingClass;
      this.loadedClass = this.imageLazyLoadConfig.loadedClass || this.loadedClass;
      this.errorClass = this.imageLazyLoadConfig.errorClass || this.errorClass;
    }
  }
  /*
  * @returns return position/dimension info as an Object `{top, left, bottom}`.
  */
  getPosition() {
    let box = this.el.nativeElement.getBoundingClientRect();
    let top = box.top + (window.pageYOffset - document.documentElement.clientTop);
    return { 
      top: top, 
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      bottom: top + this.el.nativeElement.clientHeight
    };
  }
  /*
  * @returns container target to place `loading`/`loaded` classes onto.
  */
  getLoadingContainer() {
    if (this.imageLazyLoadingContainer) {
      // find parent node with specified selector
      let collectionHas = (a:any, b:any) => {
        for(let i in a) {
          if(a[i] === b) return true;
        }
        return false;
      };
      let all = document.querySelectorAll(this.imageLazyLoadingContainer);
      let cur = this.el.nativeElement.parentNode;
      while(cur && !collectionHas(all, cur)) {
        cur = cur.parentNode; 
      }
      if (cur) {
        return cur;
      } else {
        // fallback to direct parentNode if not found
        return this.el.nativeElement.parentNode;  
      } 
    } else {
      // default is direct parentNode for IMG and the node itself for background-image
      if (this.tagName === 'IMG') {
        return this.el.nativeElement.parentNode;
      } else {
        return this.el.nativeElement;
      }
    }
  }
  hasClassName(name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(this.getLoadingContainer().className);
  }
  addClassName(name: string) {
    if (!this.hasClassName(name)) {
      let container = this.getLoadingContainer();
      container.className = container.className ? [container.className, name].join(' ') : name;
    }
  }
  removeClassName(name: string) {
    if (this.hasClassName(name)) {
      let container = this.getLoadingContainer();
      let c = container.className;
      container.className = c.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }
  toggleLoaded(enable:boolean) {
    this.loaded = enable;
    if (enable) {
      this.removeClassName(this.loadingClass);
      this.addClassName(this.loadedClass);
    } else {
      this.removeClassName(this.loadedClass);
    }
  }
  /*
  * starts loading the image in the background.
  */
  loadImage() {
    if (!this.loaded && !this.loading) {
      this.loading = true;
      this.addClassName(this.loadingClass);
      
      let customHeaders:any = this.imageLazyLoadConfig ? this.imageLazyLoadConfig.headers : null;
      this.lazyLoader.load(this.imageLazyLoadItem, customHeaders).then(() => {
        this.setImage();
      }, (err) => {
        this.error = true;
        this.loading = false;
        this.removeClassName(this.loadingClass);
        this.addClassName(this.errorClass);
      }); 
    }
  }
  /*
  * sets the image to `imageLazyLoadItem`.
  */
  setImage() {
    if (!this.loaded) {
      if (this.tagName === 'IMG') {
        this.renderer.setElementAttribute(this.el.nativeElement, 'src', this.imageLazyLoadItem);  
      } else {
        this.renderer.setElementAttribute(this.el.nativeElement, 'style', `background-image:url('${this.imageLazyLoadItem}')`);  
      }  
      this.loading = false;
      this.toggleLoaded(true); 
    }
  }
}

export const IMAGELAZYLOAD_DIRECTIVES: any[] = [ImageLazyLoadAreaDirective, ImageLazyLoadItemDirective];
