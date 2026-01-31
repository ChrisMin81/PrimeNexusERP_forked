import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { MailService } from '@/features/messages/services/mail.service';
import { LoadingService } from '@/core/services/loading/loading.service';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const generateDraftId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
@Component({
    selector: 'app-compose',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, TextareaModule, TagModule],
    templateUrl: './compose.component.html',
    styleUrl: './compose.component.scss'
})
export class Compose {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private mailService = inject(MailService);
    loadingService = inject(LoadingService);

    sendError = signal<string | null>(null);
    recipientInput = signal('');

    form = this.fb.nonNullable.group({
        recipients: this.fb.nonNullable.control<string[]>([]),
        subject: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(3)] }),
        content: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(5)] })
    });

    hasRecipient = computed(() => this.form.controls.recipients.value.length > 0 || this.recipientInput().trim().length > 0);
    canSubmit = computed(() => this.hasRecipient() && this.form.controls.subject.valid && this.form.controls.content.valid && !this.loadingService.loading());

    private draftId = signal<string>(generateDraftId());

    constructor() {
        this.prefillFromQuery();
    }

    onRecipientInput(event: Event) {
        const target = event.target;
        const rawValue = target instanceof HTMLInputElement ? target.value : '';
        this.recipientInput.set(rawValue);
    }

    send() {
        if (this.loadingService.loading()) {
            return;
        }

        if (this.recipientInput().trim()) {
            this.addRecipient();
        }

        if (!this.form.controls.recipients.value.length) {
            this.sendError.set('Add at least one recipient.');
            return;
        }

        this.sendError.set(null);

        const { recipients, subject, content } = this.form.getRawValue();
        const sanitizedRecipients = recipients.map((recipient) => recipient.trim()).filter(Boolean);
        const sanitizedSubject = subject.trim();

        this.mailService.sendMail({
            recipients: sanitizedRecipients,
            subject: sanitizedSubject,
            body: content,
            auditUuid: this.draftId()
        });

        this.router.navigate(['/pages/messages/sent']);
    }

    addRecipient(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        const value = this.recipientInput().trim();
        if (!value) {
            return;
        }
        const current = this.form.controls.recipients.value;
        if (current.includes(value)) {
            this.recipientInput.set('');
            return;
        }
        this.form.controls.recipients.setValue([...current, value]);
        this.recipientInput.set('');
    }

    removeRecipient(recipient: string) {
        const filtered = this.form.controls.recipients.value.filter((r) => r !== recipient);
        this.form.controls.recipients.setValue(filtered);
    }

    private prefillFromQuery() {
        const params = this.route.snapshot.queryParamMap;
        const recipientsParam = params.get('recipients');
        if (recipientsParam) {
            const parsed = recipientsParam
                .split(',')
                .map((r) => r.trim())
                .filter(Boolean);
            this.form.controls.recipients.setValue(parsed);
        }
        const subjectParam = params.get('subject');
        if (subjectParam) {
            this.form.controls.subject.setValue(subjectParam.trim());
        }
        const contentParam = params.get('content');
        if (contentParam) {
            this.form.controls.content.setValue(contentParam);
        }
        const draftIdParam = params.get('draftId');
        if (draftIdParam && uuidPattern.test(draftIdParam)) {
            this.draftId.set(draftIdParam!);
        }
    }
}

