export interface AddBoard {
  boardCollaborators: string[];
  boardName: string | null;
  isPublic: boolean | false
}