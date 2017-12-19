import { Injectable } from '@angular/core';

import { Item } from './item';
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

  private itemsUrl = 'api/items'; // 'api/items';  // URL to web api
  private filtersUrl = 'api/filters'; // 'api/items';  // URL to web api
  private selectedId: number;
  private filterOptions: any;

  //used Angular Dependency Injection to inject it into a component
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  //message sent from filter modal (on dashboard)
  setFilterOptions(opts: any): void {
    this.filterOptions = opts;
  }

  //message sent from details->goPrev() -> dashboard
  setSelectedItem(id: number): void {
    this.selectedId = id;
  }

  /** GET items from the server */
  getItems (): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsUrl).pipe(
        tap(items => this.log(`fetched items`)),
        catchError(this.handleError('getItems', []))
      );
  }

  /** GET items from the server 
  /api/itemsMapBounds?east=-115.2125930786133&west=-115.45291900634767&north=51.11279084899698&south=51.026496667384635 */
  getItemsWithinBounds (bounds: string): Observable<Item[]> {
    //return this.http.get(this.itemsUrl + bounds)
    return this.http.get<Item[]>(this.itemsUrl + 'MapBounds' + bounds).pipe(
        tap(items => this.log(`fetched items ` )),//+ this.itemsUrl + bounds
        catchError(this.handleError('getItems', []))
      );
  }

  /** GET item by id. Will 404 if id not found */
  getItem(id: number): Observable<Item> {
    this.selectedId = id;

    //only get item if one has been set
    if (id) {
      const url = `${this.itemsUrl}/${id}`;
      return this.http.get<Item>(url).pipe(
        tap(_ => this.log(`fetched item id=${id}`)),
        catchError(this.handleError<Item>(`getItem id=${id}`))
      );
    }
  }

  //message sent from details->goPrev() -> dashboard
  getPrevItem(): Observable<Item> {
    const url = `${this.itemsUrl}/prev/${this.selectedId}`;
    return this.http.get<Item>(url).pipe(
      tap(_ => this.log(`fetched prev item id=${this.selectedId}`)),
      catchError(this.handleError<Item>(`getHero id=${this.selectedId}`))
    );
  }

  //message sent from details->goNext() -> dashboard
  getNextItem(): Observable<Item> {
    const url = `${this.itemsUrl}/next/${this.selectedId}`;
    return this.http.get<Item>(url).pipe(
      tap(_ => this.log(`fetched next item id=${this.selectedId}`)),
      catchError(this.handleError<Item>(`getHero id=${this.selectedId}`))
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
  getFilterOptions(term: string): Observable<String[]> {
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
