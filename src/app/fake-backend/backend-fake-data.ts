import { Message } from 'api';

export const backendFakeData: {
    inboxMessages: Message[];
    sentMessages: Message[];
    draftMessages: Message[];
} = {
    inboxMessages: [
        {
            auditUuid: '1fa06eac-c744-4087-96d1-495e5d8681af',
            subject: 'Welcome to Comino',
            body: 'Thanks for joining. Here are a few tips to get started with your workspace.',
            senderName: 'Comino Team',
            recipientName: 'you@comino.app',
            messageDate: '2026-01-23T08:30:00Z',
            attachments: []
        },
        {
            auditUuid: '23cea578-9673-4f0c-826c-a790d944dd52',
            subject: 'Weekly status report',
            body: 'Your weekly report is ready. Review project health, blockers, and recent activity.',
            senderName: 'Automations',
            recipientName: 'you@comino.app',
            messageDate: '2026-01-22T14:12:00Z',
            attachments: [
                {
                    auditUuid: '52f4d893-8f39-44b8-a780-0a25ebc86c11',
                    baseName: 'status-report.pdf',
                    sizeInBytes: 1024,
                    mimeType: 'application/pdf'
                }
            ]
        },
        {
            auditUuid: '33cea578-9673-4f0c-826c-a790d944dd53',
            subject: 'Design review feedback',
            body: 'Nice progress on the inbox UX. A few notes on spacing and empty states are attached.',
            senderName: 'Elena Roberts',
            recipientName: 'you@comino.app',
            messageDate: '2026-01-21T18:45:00Z',
            attachments: [
                {
                    auditUuid: 'b8d0c3ea-91aa-4a46-a1ae-d9b1262723d5',
                    baseName: 'feedback.txt',
                    sizeInBytes: 123,
                    mimeType: 'text/plain'
                }
            ]
        },
        {
            auditUuid: '43cea578-9673-4f0c-826c-a890d944dd52',
            subject: 'Client kickoff notes',
            body: 'Great meeting today. Sharing the summary and next steps for the kickoff.',
            senderName: 'Project Ops',
            recipientName: 'you@comino.app',
            messageDate: '2026-01-21T09:05:00Z',
            attachments: []
        }
    ],
    sentMessages: [
        {
            auditUuid: '8c8a0f0c-3e70-4a96-8d75-1a4411c2f1aa',
            subject: 'Re: Design review feedback',
            body: 'Thanks! I will incorporate the spacing changes and send an updated mock later today.',
            senderAddress: 'you@comino.app',
            recipientName: 'elena@studio.example',
            messageDate: '2026-01-21T19:12:00Z',
            attachments: []
        },
        {
            auditUuid: 'c40c0d6d-91a9-4c9d-8f7e-d808e8894329',
            subject: 'Kickoff follow-up',
            body: 'Attached are the draft milestones and the proposed delivery timeline for review.',
            senderAddress: 'you@comino.app',
            recipientName: 'project.ops@example.com',
            messageDate: '2026-01-21T10:30:00Z',
            attachments: [
                {
                    auditUuid: 'f3e7e669-131b-4e5a-8c3d-5e5ffb6c7150',
                    baseName: 'milestones.xlsx',
                    sizeInBytes: 1024,
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ]
        },
        {
            auditUuid: 'f2f6e9c8-5f7c-44ef-9c56-1b0d9b1e9c70',
            subject: 'Workspace access',
            body: 'Can you grant access to the new workspace for the onboarding run?',
            senderAddress: 'you@comino.app',
            recipientName: 'admin@example.com',
            messageDate: '2026-01-20T16:05:00Z',
            attachments: []
        }
    ],
    draftMessages: [
        {
            auditUuid: 'd1f9b6a2-4c2f-4d1e-9fa6-2c0f5f4e9d11',
            subject: 'Product launch outline',
            body: 'Drafting the outline for the launch announcement. Add metrics and CTA links.',
            senderAddress: 'you@comino.app',
            recipientName: 'marketing@example.com',
            messageDate: '2026-01-22T12:15:00Z',
            attachments: []
        },
        {
            auditUuid: 'd2c4e7b5-7f3a-4e6e-8c1d-6a2b1f3e4c55',
            subject: 'Onboarding checklist',
            body: 'Checklist draft: accounts, environments, permissions, intro calls. Please review.',
            senderAddress: 'you@comino.app',
            recipientName: 'ops@example.com',
            messageDate: '2026-01-21T08:50:00Z',
            attachments: []
        }
    ]
};
