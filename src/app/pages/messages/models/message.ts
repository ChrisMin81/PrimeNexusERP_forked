import { Attachment } from './attachment';

export interface Message {
    id: number;
    subject: string;
    content: string;
    sender: string;
    recipients: string[];
    timestamp: Date;
    attachments: Attachment[];
    isRead: boolean;
}
