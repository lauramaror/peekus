import {EventPeekusType, EventPeekusStatus} from '../helpers/enums';

export class EventPeekus {
  constructor(
    public id: string,
    public name: string,
    public createdDate: Date,
    public startDate: Date,
    public creator: string,
    public type: EventPeekusType,
    public status: EventPeekusStatus,
    public endDate?: Date,
    public description?: string,
    public capacity?: number,
    public collage?: string,
    public participants?: number,
    public likes?: number,
    public comments?: number,
    public creatorName?: string,
    public creatorUsername?: string,
    public completedByUser?: boolean,
    public likedByUser?: boolean,
    public userImage?: string,
  ) {}
}
