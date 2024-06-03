export interface AddBoard {
  boardCollaborators: number[];
  boardName: string | null;
  isPublic: boolean | false
}