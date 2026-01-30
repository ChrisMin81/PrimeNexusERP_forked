import { filterMessagesByTerm } from './message-filter';
import { Message } from 'api';

describe('filterMessagesByTerm', () => {
    const messages: Message[] = [
        { auditUuid: '1', subject: 'Hello World', body: 'Body', senderAddress: 'a@b.com', messageDate: '' } as Message,
        { auditUuid: '2', subject: 'Another', body: 'Second', senderAddress: 'x@y.com', messageDate: '' } as Message
    ];

    it('returns all messages when term is empty', () => {
        expect(filterMessagesByTerm(messages, '   ', ['subject'])).toEqual(messages);
    });

    it('filters messages by matching fields', () => {
        const result = filterMessagesByTerm(messages, 'hello', ['subject', 'senderAddress']);
        expect(result.length).toBe(1);
        expect(result[0].auditUuid).toBe('1');
    });

    it('returns empty list for no messages', () => {
        expect(filterMessagesByTerm(undefined, 'test', ['subject'])).toEqual([]);
    });
});
