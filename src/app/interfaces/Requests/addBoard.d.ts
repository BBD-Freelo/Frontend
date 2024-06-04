export interface AddBoardRequest {
  boardId?: number;
  boardCollaborators: string[];
  boardName: string;
  isPublic: boolean | false
}
