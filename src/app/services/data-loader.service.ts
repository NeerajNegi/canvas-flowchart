import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {

  filePath: string = '../../assets/doubly-linked-data.json';

  constructor(private http: HttpClient) { }

  public getJSON(): Observable<any> {
    return this.http.get(this.filePath);
  }
}
