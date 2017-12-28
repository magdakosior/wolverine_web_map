import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Item } from './item';
import { MapDetails } from './mapDetails';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'

import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

//The items web API expects a special header in HTTP save requests. That header is in the httpOption constant defined in the HeroService.
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ItemService {

  // Observable  sources
  private allItemsSource = new Subject<Item[]>();
  private selectedItemSource = new Subject<Item>();
  //private mapDetailsSource = new Subject<MapDetails>();

  private itemsUrl = 'api/items'; // 'api/items';  // URL to web api
  private filtersUrl = 'api/filters'; // 'api/items';  // URL to web api

  private servicefilterOptions: any;
  private filterString: String;
  private serviceMapDetails: any;
  private serviceSelectedItemId: number;

  // Observable string streams
  allItems$ = this.allItemsSource.asObservable();
  selectedItem$ = this.selectedItemSource.asObservable();
  //mapDetails$ = this.mapDetailsSource.asObservable();

  // Service message commands
  setMapDetails(data: MapDetails) {
    console.log('in service got some map details');
    //set the map details for the service to remember
    this.serviceMapDetails = data;
    
    //set map details for listeners ?? do we need this?
    //this.mapDetailsSource.next(data);
    console.log(this.serviceMapDetails);
    this.redrawMap();
    
  }

  redrawMap() {
    var filterquery = '';
    if (!this.filterString)
      filterquery = '';
    else filterquery = String(this.filterString);
    //console.log(this.filterString);
    
    var query = '?east=' + String(this.serviceMapDetails.ext_east) + 
    '&west=' + String(this.serviceMapDetails.ext_west) + 
    '&north=' + String(this.serviceMapDetails.ext_north) +  
    '&south=' + String(this.serviceMapDetails.ext_south) +  
    filterquery;

    console.log(query);
    this.getItemsWithinBounds(query) 
      .subscribe((items: Item[]) => {
          this.allItemsSource.next(items); 
          //this.items = items;
        })
  }
  // Service message commands
  setSelectedItem(id: number) {
    //look through our items and find corresponding id to assign to selectedItemSource
    if (!id) {
      this.serviceSelectedItemId = null;
      this.selectedItemSource.next(null);
    }
    else {
      this.getItem(id) 
        .subscribe((item: Item) => {
          console.log(item[0]);
          this.selectedItemSource.next(item[0]);
          this.serviceSelectedItemId = item[0].id;
          console.log('iSERVICE SETTING ITEM');
          console.log(this.serviceSelectedItemId);
        })
    }
  }

  //message sent from filter modal (on dashboard)
  setServicefilterOptions(opts: any): void {
    //{"filters":[{"itemStatus":"'deleted','loaded','verified'"},{"imgStatus":"'bad','good'"}]}
    var result = '';
    console.log(opts);

    var result = '';
    for (var filterline in opts.filters) {
        if (!opts.filters.hasOwnProperty(filterline)) {
            continue;
        }
      //console.log(opts.filters[filterline]);
      for (var key in opts.filters[filterline]) {
        //console.log(key);
        //console.log(opts.filters[filterline][key]);

        //check to make sure that a filter was selected
        if (opts.filters[filterline][key]) {
          result = result + '&filtercol=' + 
            key + '&values=' + 
            opts.filters[filterline][key]; 
        }
      }
      //console.log(result); 
    }  



    //var filterJsonArray = opts;

    //this.servicefilterOptions = opts;
    //console.log('service - setting filter options');
    //console.log(JSON.stringify(this.servicefilterOptions));

    

    this.filterString = result; //"filter1col=itemStatus&filter1values='deleted','verified','another'";
    //re-draw map and items
    //console.log(this.filterString);
    this.setSelectedItem(null);
    this.redrawMap();
  }

  setNext() {
    console.log('in set next');
    console.log(this.serviceSelectedItemId);
    this.getNextItem()
      .subscribe((item: Item) => {
        if (item[0] != null) {
          this.selectedItemSource.next(item[0]);
          this.serviceSelectedItemId = item[0].id;
          console.log('iSERVICE SETTING ITEM');
          console.log(this.serviceSelectedItemId);
    
        }
      })
  }

  setPrev() {
    this.getPrevItem()
      .subscribe((item: Item) => {
        if (item[0] != null) {
          this.selectedItemSource.next(item[0]);
          this.serviceSelectedItemId = item[0].id;
        }
      })
  }
  //used Angular Dependency Injection to inject it into a component
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET items from the server */
  getItems (): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsUrl).pipe(
        tap(items => this.log(`fetched items`)),
        catchError(this.handleError('getItems', []))
      );
  }

  /** GET items from the server 
  /api/itemsMapBounds?east=-115.2125930786133&west=-115.45291900634767&north=51.11279084899698&south=51.026496667384635 */
  getItemsWithinBounds (query: string): Observable<Item[]> {
    //apply filters if any WHERE "geo_items"."itemStatus" in ('deleted', 'loaded') 
    /*var filters = '&east=' + String(this.servicefilterOptions) + 
      '&west=' + String(this.serviceMapDetails.ext_west) + 
      '&north=' + String(this.serviceMapDetails.ext_north) + 
      '&south=' + String(this.serviceMapDetails.ext_south);
    */
    return this.http.get<Item[]>(this.itemsUrl + 'MapBounds' + query).pipe(
        tap(items => this.log(`fetched items ` )),//+ this.itemsUrl + bounds
        catchError(this.handleError('getItems', []))
      );
  }

  /** GET item by id. Will 404 if id not found */
  getItem(id: number): Observable<Item> {
    this.serviceSelectedItemId = id;
    console.log('iSERVICE SETTING ITEM');
    console.log(this.serviceSelectedItemId);
    
    //only get item if one has been set
    if (id) {
      const url = `${this.itemsUrl}/?id=`+id;
      return this.http.get<Item>(url).pipe(
        tap(_ => this.log(`fetched item id=${id}`)),
        catchError(this.handleError<Item>(`getItem id=${id}`))
      );
    }
  }

  //message sent from details->goPrev() -> dashboard
  getPrevItem(): Observable<Item> {
    var query = '';
    console.log('in get prevItem');
    console.log(this.filterString);
    if (typeof this.filterString != 'undefined') 
      query = String(this.serviceSelectedItemId) + this.filterString;
    else
      query = String(this.serviceSelectedItemId);

    console.log('in getPrevItem() ' + query);
    const url = `${this.itemsUrl}/prev/?id=`+ query;
    return this.http.get<Item>(url).pipe(
      tap(_ => this.log(`fetched prev item id=${this.serviceSelectedItemId}`)),
      catchError(this.handleError<Item>(`getPrevItem id=${this.serviceSelectedItemId}`))
    );
  }

  //message sent from details->goNext() -> dashboard
  getNextItem(): Observable<Item> {
    var query = '';
    if (typeof this.filterString != 'undefined') {
      query = String(this.serviceSelectedItemId) + this.filterString;
      console.log(this.filterString);
    }
    else {
      query = String(this.serviceSelectedItemId);
      console.log(String(this.serviceSelectedItemId));
    }

    const url = `${this.itemsUrl}/next/?id=`+ query;
    console.log('in getNextItem() ' + url);
    return this.http.get<Item>(url).pipe(
      tap(_ => this.log(`fetched next item id=${this.serviceSelectedItemId}`)),
      catchError(this.handleError<Item>(`getNextItem id=${this.serviceSelectedItemId}`))
    );
  }

  /** PUT: update the item on the server */
  updateItem (item: Item): Observable<any> {
    const url = `${this.itemsUrl}/${item.id}`;
    return this.http.put(url, item, httpOptions).pipe(
      tap(_ => this.log(`updated item id=${item.id}`)),
      catchError(this.handleError<any>('updateItem'))
    );
  }

  /** POST: add a new item to the server --post instead of put*/
  addItem (item: Item): Observable<Item> {
    return this.http.post<Item>(this.itemsUrl, item, httpOptions).pipe(
      tap((item: Item) => this.log(`added item w/ id=${item.id}`)),
      catchError(this.handleError<Item>('addItem'))
    );
  }

  /** DELETE: delete the item from the server */
  deleteItem (item: Item | number): Observable<Item> {
    const id = typeof item === 'number' ? item : item.id;
    const url = `${this.itemsUrl}/${id}`;

    return this.http.delete<Item>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted item id=${id}`)),
      catchError(this.handleError<Item>('deleteItem'))
    );
  }

  /* GET items whose name contains search term */
  searchItems(term: string): Observable<Item[]> {
    if (!term.trim()) {
      // if not search term, return empty item array.
      return of([]);
    }
    return this.http.get<Item[]>(`api/items/?name=${term}`).pipe(
      tap(_ => this.log(`found items matching "${term}"`)),
      catchError(this.handleError<Item[]>('searchItems', []))
    );
  }

  //message sent from filter modal (on dashboard)
  getFilterOptions(term: string): Observable<any[]> {
    //console.log('getting item status filter opts');
    const url = `${this.filtersUrl}/${term}`;

    return this.http.get<String[]>(url).pipe(
      tap(_ => this.log(`found filters for "${term}"`)),
      catchError(this.handleError<String[]>('filterItems', []))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('ItemService: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
