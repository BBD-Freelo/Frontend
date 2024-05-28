import { User } from './user';
import { List } from './list';

export interface Board {
  collaborators: User[];
  lists: List[];
}
