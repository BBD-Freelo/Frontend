export interface AddBoard {
  boardId?: number;
  boardCollaborators: User[];
  boardName: string | null;
  isPublic: boolean | false
}