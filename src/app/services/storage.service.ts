/* eslint-disable arrow-body-style */
/* eslint-disable eol-last */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storageReady = new BehaviorSubject(false);
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();
    this._storage = storage;
    this.storageReady.next(true);
  }

  getAccessToken(){
    return this.storageReady.pipe(
      filter(ready=>ready),
      switchMap(_ => {
        return from(this._storage.get('ACCESS_TOKEN'));
      })
    );
  }

  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  public async remove(key: string) {
    await this._storage?.remove(key);
  }

  public async clear() {
    await this._storage?.clear();
  }
}
