import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { MailService } from '@/pages/messages/services/mail.service';
import { LoadingService } from '@/services/loading/loading.service';

@Component({
    selector: 'app-compose',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, TextareaModule, TagModule],
    templateUrl: './compose.html',
    styleUrl: './compose.scss'
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

    private draftId = signal<number | null>(null);

    constructor() {
        this.prefillFromQuery();
    }

    onRecipientInput(event: Event) {
        const value = (event.target as HTMLInputElement | null)?.value ?? '';
        this.recipientInput.set(value);
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

        this.mailService.sendMail({
            recipients,
            subject,
            content,
            draftId: this.draftId() ?? undefined
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
            this.form.controls.subject.setValue(subjectParam);
        }
        const contentParam = params.get('content');
        if (contentParam) {
            this.form.controls.content.setValue(contentParam);
        }
        const draftIdParam = params.get('draftId');
        if (draftIdParam) {
            const parsed = Number(draftIdParam);
            if (!Number.isNaN(parsed)) {
                this.draftId.set(parsed);
            }
        }
    }
}
