import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {

  constructor(private http: HttpClient) { }

  public getJSON(): Observable<any> {
    return this.http.get('../../assets/data.json');
  }

  public getNewJSON(): Observable<any> {
    return this.http.get('../../assets/new-data.json');
  }
}
