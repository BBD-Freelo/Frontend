export interface AddBoardRequest {
  boardCollaborators: number[];
  boardName: string;
  isPublic: boolean | false
}
