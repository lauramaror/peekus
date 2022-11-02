/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable arrow-body-style */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { optionsByTypeMap } from 'src/app/helpers/options-maps';
import { CommentPeekus } from 'src/app/models/comment.model';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  optionsByTypeMap = optionsByTypeMap;

  loading = true;
  eventId = '';
  eventData: EventPeekus;
  backButtonText = 'Eventos';
  userId = '';
  createdDate = '';
  startDayWeek = '';
  startDayMonth = '';
  eventParticipants = [];
  eventComments = [];
  commentToPost = '';
  loadingComments = false;
  participantActions = [{id: 0, buttonText: 'CANCELAR INSCRIPCIÓN', active: false},{id: 1, buttonText: 'INSCRIBIRSE', active: false}];
  currentAction = 0;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private eventService: EventService,
    private datePipe: DatePipe
    ) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.params.id;
    this.getEvent();
  }

  getEvent(){
    this.loading = true;
    this.storageService.getUserInfo().pipe(map(userInfo=>{
      this.userId = userInfo.id;
      return '?user='+userInfo.id+'&id='+this.eventId;
    }), mergeMap(params=> {
      return zip(
        this.eventService.getEvents(params),
        this.eventService.getParticipantsByEvent('?idEvent='+this.eventId),
        this.eventService.getCommentsByEvent('?idEvent='+this.eventId)
      );
    })).subscribe(([event, participants, comments])=>{
      this.eventData = event[0] as EventPeekus;
      this.eventParticipants = participants as [];
      this.eventComments = comments as [];

      this.buildComments();
      this.currentAction = this.eventParticipants.find(p=>p.idParticipant===this.userId) ? 0 : 1;
      this.participantActions[this.currentAction].active = true;

      const createdDateToFormat = new Date(this.eventData.createdDate);
      const createdMonth = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(createdDateToFormat);
      this.createdDate = createdDateToFormat.getDate() + ' '+createdMonth+'. ' + createdDateToFormat.getFullYear();
      const startDateToFormat = new Date(this.eventData.startDate);
      this.startDayMonth = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(startDateToFormat);
      this.startDayWeek = this.dayWeekName(startDateToFormat);

      this.loading = false;
    });
  }

  dayWeekName = fecha => [
    'DOM',
    'LUN',
    'MAR',
    'MIE',
    'JUE',
    'VIE',
    'SÁB',
  ][new Date(fecha).getDay()];

  buildComments(){
    this.eventComments.forEach(c=>{
      const commentDate = new Date(c.commentDate);
      c['formattedDate'] = this.datePipe.transform(commentDate, 'HH:mm') + ' · ' + commentDate.getDate() + ' '
                          + new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(commentDate) + '. '
                          + commentDate.getFullYear();
    });
    this.eventComments.sort((a,b) => new Date(a.commentDate).getTime() - new Date(b.commentDate).getTime());
  }

  postComment(){
    if(this.commentToPost.trim()){
      this.loadingComments = true;
      const newComment = new CommentPeekus(this.commentToPost, this.userId, this.eventId);
      this.eventService.postComment(newComment).pipe(
        mergeMap(c=>this.eventService.getCommentsByEvent('?idEvent='+this.eventId))).subscribe(comments=>{
          this.eventComments = comments as [];
          this.buildComments();
          this.commentToPost = '';
          this.loadingComments = false;
      });
    }
  }

}
