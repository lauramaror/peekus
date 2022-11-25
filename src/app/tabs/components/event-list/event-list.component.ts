import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventPeekus } from 'src/app/models/event.model';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  @Input() events: EventPeekus[];
  @Input() userId: string;
  @Input() search: boolean;

  @Output() filterByType = new EventEmitter<boolean[]>();

  ascDate = true;
  ascName = true;
  publicCheck = true;
  privateCheck = true;

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

  orderByDate(){
    this.events = this.ascDate ? this.events.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                          : this.events.sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    this.ascDate = !this.ascDate;
  }

  orderByName(){
    this.events = this.ascName ? this.events.sort((a,b) => a.name.localeCompare(b.name))
                          : this.events.sort((a,b) => b.name.localeCompare(a.name));
    this.ascName = !this.ascName;
  }

  setPublic(){
    this.publicCheck = !this.publicCheck;
    this.privateCheck = !this.publicCheck && !this.privateCheck ? true : this.privateCheck;
    this.filterByType.emit([this.publicCheck, this.privateCheck]);
  }

  setPrivate(){
    this.privateCheck = !this.privateCheck;
    this.publicCheck = !this.privateCheck && !this.publicCheck ? true : this.publicCheck;
    this.filterByType.emit([this.publicCheck, this.privateCheck]);
  }

}
