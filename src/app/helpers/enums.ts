/* eslint-disable @typescript-eslint/naming-convention */
enum EventPeekusStatus {
  ONGOING = 'ONGOING',
  NEXT = 'NEXT',
  FINISHED = 'FINISHED'
}

enum EventPeekusType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  EXCLUSIVE = 'EXCLUSIVE'
}

enum CodeType {
  QR = 'QR',
  NUMERIC = 'NUMERIC',
  INVITE = 'INVITE'
}

enum FriendStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

enum NotificationType {
  FRIEND_REQUEST = 'PENDING',
  EVENT_START = 'EVENT_START',
  EVENT_FINISHED = 'EVENT_FINISHED'
}

enum ImageType {
  PROFILE = 'PROFILE',
  COLLAGE = 'COLLAGE',
  EVENT = 'EVENT'
}

export {
  EventPeekusStatus,
  EventPeekusType,
  CodeType,
  FriendStatus,
  NotificationType,
  ImageType,
};
