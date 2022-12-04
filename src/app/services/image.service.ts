/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, mergeMap, tap } from  'rxjs/operators';
import { StorageService } from './storage.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Media } from '@capacitor-community/media';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  images: LocalFile[] = [];
  private photoStorage = 'stored-photos';
  private platform: Platform;

  constructor(
    platform: Platform,
    private http: HttpClient,
    private storageService: StorageService
    ) {
      this.platform = platform;
    }

  getImages(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/image${params}`,options);
    }));
  }

  saveImageAPI(imageData: any, params: string): Observable<object> {
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/image${params}`, imageData, options);
    }));
  }

  updateImageAPI(imageData: any, params: string): Observable<object> {
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/image${params}`, imageData, options);
    }));
  }

  generateCollage(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/image/collage${params}`,{},options);
    }));
  }

  async selectImage() {
    const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
    });

    if (image) {
        await this.saveImage(image);
    }
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image) {
          await this.saveImage(image);
      }

    } catch (error) {
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
        path: `${this.photoStorage}/${fileName}`,
        data: base64Data,
        directory: Directory.Data
    });

    await this.loadFiles();
  }

  async loadFiles() {
		this.images = [];

		await Filesystem.readdir({
			path: this.photoStorage,
			directory: Directory.Data
		})
			.then(
				async (result) => {
					await this.loadFileData(result.files.map(f=>f.name));
				},
				async (err) => {
					await Filesystem.mkdir({
						path: this.photoStorage,
						directory: Directory.Data
					});
				}
			)
			.then((_) => {});
	}

  async loadFileData(fileNames: string[]) {
		for (const f of fileNames) {
			const filePath = `${this.photoStorage}/${f}`;

			const readFile = await Filesystem.readFile({
				path: filePath,
				directory: Directory.Data
			});

			this.images.push({
				name: f,
				path: filePath,
				data: `data:image/jpeg;base64,${readFile.data}`
			});
		}
	}

  startUpload(file: LocalFile, params: string) {
    return from(fetch(file.data))
    .pipe(mergeMap(response=> {
      return from(response.blob());
    })).pipe(mergeMap(blob=> {
      const formData = new FormData();
      formData.append('image', blob, file.name);
      return this.saveImageAPI(formData,params);
    }));
  }

  updatPictureUpload(file: LocalFile, params: string) {
    return from(fetch(file.data))
    .pipe(mergeMap(response=> {
      return from(response.blob());
    })).pipe(mergeMap(blob=> {
      const formData = new FormData();
      formData.append('image', blob, file.name);
      return this.updateImageAPI(formData,params);
    }));
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
        directory: Directory.Data,
        path: file.path
    });
  }

  async deleteImages() {
    for await (const f of this.images){
      await this.deleteImage(f);
    }

    this.images = [];
  }

  async saveCollagesToGallery(collages: string[]){
    let result = false;
    for await (const c of collages) {
      result = await this.saveImageToGallery(c);
    }
    return result;
  }

  async saveImageToGallery(photoBase: string) {
    let savedOk = false;
    try {
      const platform = Capacitor.getPlatform();
      const photoTempFile = `${new Date().getTime()}.jpeg`;
      const photoTemp = await Filesystem.writeFile({
        path: photoTempFile,
        data: photoBase,
        directory: Directory.Cache
      });
      const albumName = 'Peekus';
      let albumIdentifier = '';
      if (platform === 'ios') {
        let albums = await Media.getAlbums();
        albumIdentifier = albums.albums.find(a => a.name === albumName)?.identifier || null;

        if (!albumIdentifier) {
          await Media.createAlbum({ name: albumName });
          albums = await Media.getAlbums();
          albumIdentifier = albums.albums.find(a => a.name === albumName)?.identifier;
        }
      } else if (platform === 'android') {
        const albums = await Media.getAlbums();

        if (!albums.albums.find(a => a.name === albumName)) {
          await Media.createAlbum({ name: albumName });
        }
      }
      return Media.savePhoto({
        path: photoTemp.uri,
        album: (platform === 'ios') ? albumIdentifier : albumName
      })
      .then(() => {
        console.log('Image has been saved');
        savedOk = true;
        return savedOk;
      })
      .catch(e => {
        console.log('error',e);
        savedOk = false;
        return savedOk;
      });
    } catch (e) { console.error('error catch',e); return savedOk; }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });

      return file.data;
    }
    else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

}

interface LocalFile {
  name: string;
  path: string;
  data: string;
}
