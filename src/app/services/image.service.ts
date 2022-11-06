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

  async selectImage() {
    const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos // Camera, Photos or Prompt!
    });

    if (image) {
        await this.saveImage(image);
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
			.then((_) => {
        // console.log('se acabo el then de loading');
			});
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

  // async startUpload(file: LocalFile) {
  //   const response = await fetch(file.data);
  //   const blob = await response.blob();
  //   const formData = new FormData();
  //   formData.append('file', blob, file.name);
  //   this.saveImageAPI(formData,'');
  // }

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

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
        directory: Directory.Data,
        path: file.path
    });
  }

  async deleteImages() {
    await Filesystem.readdir({
			path: this.photoStorage,
			directory: Directory.Data
		})
			.then(
				async (result) => {
          for(const f of this.images){
            await this.deleteImage(f);
          }
				}
			)
			.then((_) => {
			});

    this.images = [];
  }

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

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

}

interface LocalFile {
  name: string;
  path: string;
  data: string;
}
