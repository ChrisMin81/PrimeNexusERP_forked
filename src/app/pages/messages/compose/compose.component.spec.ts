import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { Compose } from './compose.component';
import { MailService } from '@/pages/messages/services/mail.service';
import { LoadingService } from '@/services/loading/loading.service';

describe('Compose', () => {
    let fixture: ComponentFixture<Compose>;
    let component: Compose;
    let mailService: jasmine.SpyObj<MailService>;
    let loadingService: jasmine.SpyObj<LoadingService>;
    let router: jasmine.SpyObj<Router>;

    const setup = async (queryParams: Record<string, string | null> = {}) => {
        mailService = jasmine.createSpyObj<MailService>('MailService', ['sendMail']);
        loadingService = jasmine.createSpyObj<LoadingService>('LoadingService', ['loading']);
        loadingService.loading.and.returnValue(false);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        router.navigate.and.resolveTo(true);

        await TestBed.configureTestingModule({
            imports: [Compose],
            providers: [
                { provide: MailService, useValue: mailService },
                { provide: LoadingService, useValue: loadingService },
                { provide: Router, useValue: router },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: convertToParamMap(queryParams)
                        }
                    }
                }
            ]
        })
            .overrideComponent(Compose, {
                set: {
                    template: ''
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(Compose);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('initializes from query params with trimmed recipients and subject', async () => {
        await setup({
            recipients: '  a@test.com , b@test.com  ',
            subject: '  hello  ',
            content: '  body  ',
            draftId: 'not-a-uuid'
        });

        expect(component.form.controls.recipients.value).toEqual(['a@test.com', 'b@test.com']);
        expect(component.form.controls.subject.value).toBe('hello');
        expect(component.form.controls.content.value).toBe('  body  ');
    });

    it('ignores non-input targets when updating recipient input', async () => {
        await setup();

        component.onRecipientInput(new Event('input'));

        expect(component.recipientInput()).toBe('');
    });

    it('prevents send when loading', async () => {
        await setup();
        loadingService.loading.and.returnValue(true);

        component.send();

        expect(mailService.sendMail).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('sanitizes recipients and subject on send', async () => {
        await setup();

        component.recipientInput.set('  user@test.com  ');
        component.form.controls.subject.setValue('  subject  ');
        component.form.controls.content.setValue('message body');

        component.send();

        expect(mailService.sendMail).toHaveBeenCalledWith({
            recipients: ['user@test.com'],
            subject: 'subject',
            body: 'message body',
            auditUuid: (component as unknown as { draftId: () => string }).draftId()
        });
        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/sent']);
    });

    it('blocks send when no recipients are provided', async () => {
        await setup();

        component.form.controls.subject.setValue('subject');
        component.form.controls.content.setValue('message body');

        component.send();

        expect(mailService.sendMail).not.toHaveBeenCalled();
        expect(component.sendError()).toBe('Add at least one recipient.');
    });
});

