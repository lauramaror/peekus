import { EventPeekusStatus, EventPeekusType } from './enums';

const optionsByStatusMap = new Map<EventPeekusStatus, any>([
  [EventPeekusStatus.NEXT, {bgColor: '#789FD9', iconBar: 'time', colorDate: '#6B6B6B'}],
  [EventPeekusStatus.ONGOING, {bgColor: '#BD2742', iconBar: 'alert', colorDate: '#BD2742',
                        bgColorCompleted:'#E7CC6F', iconBarCompleted: 'camera', colorDateCompleted: '#6B6B6B'}],
  [EventPeekusStatus.FINISHED, {bgColor: '#6F4970', iconBar: 'checkmark', colorDate: '#6B6B6B'}]
]);

const optionsByTypeMap = new Map<EventPeekusType, any>([
  [EventPeekusType.EXCLUSIVE, {icon: 'star'}],
  [EventPeekusType.PRIVATE, {icon: 'lock-closed'}],
  [EventPeekusType.PUBLIC, {icon: 'earth'}],
]);

export {
  optionsByStatusMap,
  optionsByTypeMap
};
