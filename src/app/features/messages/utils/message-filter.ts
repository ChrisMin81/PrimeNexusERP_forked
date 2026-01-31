import { Message } from 'api';

type MessageField = Extract<keyof Message, string> | 'body';

export function filterMessagesByTerm(messages: Message[] | undefined | null, term: string, fields: MessageField[]): Message[] {
    if (!messages) {
        return [];
    }
    const query = term.trim().toLowerCase();
    if (!query) {
        return messages;
    }
    return messages.filter((message) =>
        fields.some((field) => {
            const value = (message as Record<string, unknown>)[field];
            if (Array.isArray(value)) {
                return value.some((entry) => `${entry}`.toLowerCase().includes(query));
            }
            if (typeof value === 'string') {
                return value.toLowerCase().includes(query);
            }
            return false;
        })
    );
}
