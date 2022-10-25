import {EventType, EventStatus} from '../helpers/enums';

export class Event {
  constructor(
    public id: string,
    public name: string,
    public createdDate: Date,
    public startDate: Date,
    public creator: string,
    public type: EventType,
    public status: EventStatus,
    public endDate?: Date,
    public description?: string,
    public capacity?: number,
    public collage?: string,
    public participants?: number,
    public likes?: number,
    public comments?: number,
  ) {}
}
