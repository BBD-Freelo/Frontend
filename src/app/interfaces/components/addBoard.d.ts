export interface AddBoard {
  boardId?: number;
  boardCollaborators: string[];
  boardName: string | null;
  isPublic: boolean | false
}