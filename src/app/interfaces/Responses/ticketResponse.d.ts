import { User } from "../entities/user";

export interface RemoveTicketResponse {
    isEdit: boolean;
    ticketId: number;
}

export interface UpdateTicketResponse {
    isEdit: boolean;
    ticketId: number;
    ticketName: string;
    ticketDescription: string;
    assignedUser: number | undefined;
    ticketDueDate: Date;
}