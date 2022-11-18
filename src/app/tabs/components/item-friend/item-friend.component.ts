import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-friend',
  templateUrl: './item-friend.component.html',
  styleUrls: ['./item-friend.component.scss'],
})
export class ItemFriendComponent implements OnInit {
  @Input() usersList: any[];
  @Input() type: number;

  constructor() { }

  ngOnInit() {}

}
