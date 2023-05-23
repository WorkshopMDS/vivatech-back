import type { IUpdatedBy, ITimestamp } from './global.type';
import type { IUser } from './user.type';

export interface IParcours extends ITimestamp {
  title: string;
  description?: string;
  interests: string[];
  createdBy: IUser | string;
  updatedBy: IUpdatedBy[];
}
