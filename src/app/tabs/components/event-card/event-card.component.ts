import { Component, Input, OnInit } from '@angular/core';
import { EventPeekusStatus, EventPeekusType } from 'src/app/helpers/enums';
import { EventPeekus } from 'src/app/models/event.model';
import { optionsByStatusMap, optionsByTypeMap } from 'src/app/helpers/options-maps';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: EventPeekus;

  eventStatus = EventPeekusStatus;
  optionsByStatusMap = optionsByStatusMap;
  optionsByTypeMap = optionsByTypeMap;
  photo: any;

  constructor(
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.deleteAllFiles();
  }

  async deleteAllFiles(){
    await this.imageService.loadFiles();
    await this.imageService.deleteImages();
  }

  async takePhoto(){
    await this.imageService.takePhoto();
    this.photo = this.imageService.images[0];
  }

}
