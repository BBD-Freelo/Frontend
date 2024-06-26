import { User } from "../entities/user";
export interface TicketData {
    id: number;
    title: string;
    description: string;
    created: string;
    updated: string;
    due: string;
    assigned?: User;
    collaborators: User[];
}