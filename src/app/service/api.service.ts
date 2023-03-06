import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Contact } from '../model/contact';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private _http: HttpClient) {}

  //Post Get  Put Delete Methode

  postContact(data: Contact) {
    return this._http
      .post<Contact>('http://localhost:3000/contacts', data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getContactList(): Observable<Contact[]> {
    return this._http.get<Contact[]>('http://localhost:3000/contacts').pipe(
      map((res) => {
        return res;
      })
    );
  }

  putContact(data: Contact) {
    console.log('Data on the service ' + data);

    return this._http
      .put<Contact>(`http://localhost:3000/contacts/${data.id}`, data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  dalateContact(data: Contact) {
    return this._http
      .delete<Contact>(`http://localhost:3000/contacts/${data.id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
