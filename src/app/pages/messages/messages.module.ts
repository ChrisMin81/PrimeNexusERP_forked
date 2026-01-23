import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MailToolbar } from './components/mail-toolbar/mail-toolbar';
import { MailService } from './services/mail.service';
import { MESSAGES_ROUTES } from './messages.routes';

@NgModule({
  imports: [RouterModule.forChild(MESSAGES_ROUTES), MailToolbar],
  exports: [RouterModule, MailToolbar],
  providers: [MailService],
})
export class MessagesModule {}
