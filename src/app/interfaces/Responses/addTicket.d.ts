export interface AddTicketResponse {
  ticketId: number;
  listId: number;
  ticketName: string;
  ticketDescription: string;
  ticketCreateDate: Date;
  ticketUpdateDate: Date;
  ticketDueDate: Date;
}
