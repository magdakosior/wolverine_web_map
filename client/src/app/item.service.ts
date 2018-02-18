import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Item } from './item';
import { Import } from './import';
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
  
  private itemsUrl = 'api/items'; // 'api/items';  // URL to web api
  private filtersUrl = 'api/filters'; // 'api/items';  // URL to web api
  private importsUrl = 'api/imports';

  private servicefilterOptions: any;
  private filterString: String;
  private serviceMapDetails: any;
  private serviceSelectedItemId: number;

  // Observable string streams
  allItems$ = this.allItemsSource.asObservable();
  selectedItem$ = this.selectedItemSource.asObservable();
  
  currImport: String = '';
  itemPresets = new Item();  //this is a holder for item-detail saving data
  importType: boolean;
  /* 
    called by temService.importFromFile
    load file into contents into photos and add entry to imports table
    http://localhost:3000/api/importfile 
    return success/fail message back to itemService.importFromFile
  */
  importFromFile(jsonData:any) {
    var today = new Date();
    var importId = today.toISOString().slice(0,19) + '_' + jsonData.session;
    jsonData.importId = importId;

    const url = `api/importfile?data=`+ JSON.stringify(jsonData);
    this.setImportDetails(jsonData.importId);
    
    return this.http.get<any>(url)
      .pipe(
        //map(this.extractResults),
        tap(_ => {this.log(`fetched importfile`)}),
        catchError(this.handleError<Item>(`error reading importfile`))
      );     
  }

  /* 
  called by importFromFile and import.components->importPhotos (when loading a previous import)
  sets up filter string and prompts for map redraw
  */
  setImportDetails(importId) {
    this.currImport = importId;
    this.filterString = '&importid=' + importId; 
  }

  // Service message commands
  setMapDetails(data: MapDetails) {
    //set the map details for the service to remember
    this.serviceMapDetails = data;
    
    //set map details for listeners ?? do we need this?
    this.redrawMap();
  }

  redrawMap() {
    var filterquery = '';
    if (!this.filterString)
      filterquery = '';
    else filterquery = String(this.filterString);
    
    var query = '?east=' + String(this.serviceMapDetails.ext_east) + 
      '&west=' + String(this.serviceMapDetails.ext_west) + 
      '&north=' + String(this.serviceMapDetails.ext_north) +  
      '&south=' + String(this.serviceMapDetails.ext_south) +  
      filterquery;

    this.getItemsWithinBounds(query) 
      .subscribe((items: Item[]) => {
          this.allItemsSource.next(items); 
        })
  }

  /*
    Sets selected marker on map (red)
    Called in import.component->importPhotos and map.component->createCustomMarker
  */
  setSelectedItem(id: number, importType?: boolean) {  
    //look through our items and find corresponding id to assign to selectedItemSource
    if (!id) {
      this.serviceSelectedItemId = null;
      this.selectedItemSource.next(null);
    }
    else {
      this.getItem(id) 
        .subscribe((item: Item) => {
          if (importType)
            this.importType = true;
          this.selectedItemSource.next(item[0]);
          this.serviceSelectedItemId = item[0].id;
        })
    }
  }

  //message sent from filter modal (on dashboard)
  setServicefilterOptions(opts: any): void {
    //{"filters":[{"itemStatus":"'deleted','loaded','verified'"},{"imgStatus":"'bad','good'"}]}
    var result = '';
    
    var result = '';
    for (var filterline in opts.filters) {
        if (!opts.filters.hasOwnProperty(filterline)) {
            continue;
        }
      for (var key in opts.filters[filterline]) {
        //check to make sure that a filter was selected
        if (opts.filters[filterline][key]) {
          result = result + '&filtercol=' + 
            key + '&values=' + 
            opts.filters[filterline][key]; 
        }
      }
    }  

    this.filterString = result; //"filter1col=itemStatus&filter1values='deleted','verified','another'";
    //re-draw map and items
    this.setSelectedItem(null);
    this.redrawMap();
  }

/*
Called from item-detail.component->setNext
*/
  setNext(importType?: boolean) {
    this.getNextItem()
      .subscribe((item: Item) => {
        if (item[0] != null) {
          this.selectedItemSource.next(item[0]);
          this.serviceSelectedItemId = item[0].id;
          if (importType)
            this.importType = true;
        }
      })
  }

  setPrev(importType?: boolean) {
    this.getPrevItem()
      .subscribe((item: Item) => {
        if (item[0] != null) {
          item[0].datapreset = false;
          this.selectedItemSource.next(item[0]);
          this.serviceSelectedItemId = item[0].id;
          if (importType)
            this.importType = true;
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
    if (typeof this.filterString != 'undefined') 
      query = String(this.serviceSelectedItemId) + this.filterString;
    else
      query = String(this.serviceSelectedItemId);

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
    }
    else {
      query = String(this.serviceSelectedItemId);
    }

    const url = `${this.itemsUrl}/next/?id=`+ query;
    return this.http.get<Item>(url).pipe(
      tap(_ => this.log(`fetched next item id=${this.serviceSelectedItemId}`)),
      catchError(this.handleError<Item>(`getNextItem id=${this.serviceSelectedItemId}`))
    );
  }

  /*
    PUT: update the item on the server 
    Called from item-detail.component save 
  */
  updateItem (item: Item): Observable<any> {
    const url = `${this.itemsUrl}/${item.id}`;
    return this.http.put(url, item, httpOptions).pipe(
      tap(_ => this.log(`updated item id=${item.id}`)),
      catchError(this.handleError<any>('updateItem'))
    );
  }

  /** POST: add a new item to the server --post instead of put*/
  addItem (item: Item): Observable<Item> {
    console.log('calling addItem');    
    return this.http.post<Item>(this.itemsUrl, item, httpOptions).pipe(
      tap((item: Item) => this.log(`added item w/ id=${item.id}`)),
      catchError(this.handleError<Item>('addItem'))
    );
  }

  /** DELETE: delete the item from the server */
  deleteItem (item: Item | number): Observable<Item> {
    console.log('calling delete Item');    
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
    const url = `${this.filtersUrl}/${term}`;

    return this.http.get<String[]>(url).pipe(
      tap(_ => this.log(`found filters for "${term}"`)),
      catchError(this.handleError<String[]>('filterItems', []))
    );
  }

  /* Called from import.component import modal ngOnInit() */
  getImports(): Observable<any[]> {
    const url = `${this.importsUrl}`;

    return this.http.get<String[]>(url).pipe(
      tap(_ => this.log(`found imports"`)),
      catchError(this.handleError<String[]>('imports', []))
    );
  }

  /*
    Called from import.component importPhotos()
    To get last verified item id from imported batch
  */
  getImportsId(term: string): Observable<any> {
    const url = `${this.importsUrl}/${term}`;
    console.log(url);
    return this.http.get<String[]>(url).pipe(
      tap(_ => this.log(`getImportsId for "${term}"`)),
      catchError(this.handleError<String[]>('getImportsId', []))
    );
  }

  /*
    Called from import.component importPhotos()
    To set selected last verified import marker after initial import
  */
  updateImportsLastVerified(terms: any): Observable<any> {
    const url = `${this.importsUrl}/${terms.importid}`;
    
    return this.http.put(url, terms, httpOptions).pipe(
      tap(_ => this.log(`updated import importid=${terms.importid}`)),
      catchError(this.handleError<any>('updateImport'))
    );
  }

  /*
    saves preset item detail values to item.service
    Called from item-detail.component save 
  */
  savePresetData (item: Item) {
    this.itemPresets.itemstatus = item.itemstatus;
    this.itemPresets.checkcamera = item.checkcamera;
    this.itemPresets.marker = item.marker;
    this.itemPresets.indivname = item.indivname;
    this.itemPresets.specieswolv = item.specieswolv;
    this.itemPresets.speciesother = item.speciesother;
    this.itemPresets.numanimals = item.numanimals;
    this.itemPresets.age = item.age;
    this.itemPresets.sex = item.sex;
    this.itemPresets.behaviour = item.behaviour;
    this.itemPresets.vischest = item.vischest;
    this.itemPresets.vissex = item.vissex;
    this.itemPresets.vislactation = item.vislactation;
    this.itemPresets.visbait = item.visbait;
    this.itemPresets.removedbait = item.removedbait;
    this.itemPresets.daterembait = item.daterembait;
    this.itemPresets.datapreset = item.datapreset;
  }

/*
    saves preset item detail values to item.service
    Called from item-detail.component save 
  */
  retrievePresetData (): Item {
    return this.itemPresets;
  }

  getImportType (): boolean {
    return this.importType;
  }
  setImportType (value: boolean) {
    this.importType = value;
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
