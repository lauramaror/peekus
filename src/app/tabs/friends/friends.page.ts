/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss']
})
export class FriendsPage implements OnInit {

  usersList = [];
  friendsList = [];
  friendRequests = [];
  loading = true;
  userId = '';
  myFriends = false;
  params = '';

  constructor(
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void{
    this.getFriendRequests();
  }

  getFriendRequests(){
    this.loading = true;
    this.storageService.getUserInfo().pipe(mergeMap(u=>{
      this.userId=u.id;
      return this.userService.getFriends('?id='+this.userId);
    })).subscribe(f=>{
      this.friendRequests = (f as []).filter(u=>u['status']==='PENDING' && u['idSolicitant']!==this.userId).flatMap(u=>u['friendData']);
      this.friendsList = (f as []).flatMap(u=>u['friendData']);
      this.loading = false;
    });
  }

  getUsers(textToSearch?: string){
    this.loading = true;
    if(textToSearch){
      this.params='?text='+textToSearch;
    }
    if(this.myFriends){
      this.userService.getFriends(this.params).subscribe(e=>{
        this.usersList = (e as []).flatMap(u=>u['friendData']);
        this.friendsList = this.usersList;
        this.loading = false;
      });
    } else{
      this.userService.getUsers(this.params).subscribe(e=>{
        this.usersList = (e as []).filter(u=>!this.friendsList.flatMap(f=>f.id).includes(u['id']) && u['id']!==this.userId);
        this.loading = false;
      });
    }

  }

  searchUser(event) {
    const query = event.target.value.toLowerCase();
    this.usersList = [];
    if(this.myFriends){
      this.usersList = this.friendsList.filter(f=>f.name.startsWith(query) || f.username.startsWith(query));
    }else if(query!==''){
      this.params = '';
      this.getUsers(query);
    }
  }

  changeTab(fromTab: number){
    this.friendRequests = [];
    this.usersList = [];
    this.myFriends = fromTab===2;
    this.params= this.myFriends ? '?id='+this.userId+'&status=ACCEPTED' : '';
    if(this.myFriends){
      this.getUsers();
    } else{
      this.getFriendRequests();
    }
  }

  updateUserList(newUsers: any[]){
    this.getFriendRequests();
  }

}
