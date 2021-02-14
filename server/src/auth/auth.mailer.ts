import { Injectable } from '@nestjs/common';
import { sendMail } from 'common/mailer';
import { signJWT } from 'common/jwt';
import { resetPasswordLink, verifyEmailLink } from 'common/links';

@Injectable()
export class AuthMailer {
  sendConfirmationInstructions({ email }: { email: string }) {
    const token = signJWT({ email });
    const link = verifyEmailLink(token);

    return sendMail({
      to: email,
      subject: 'Confirmation instructions',
      html: `
        <p>Welcome ${email}!</p>
        <p>You can confirm your account email through the link below:</p>
        <p><a href="${link}">Confirm my account</a></p>
      `,
    });
  }

  sendResetPasswordInstructions({ email }: { email: string }) {
    const token = signJWT({ email });
    const link = resetPasswordLink(token);

    return sendMail({
      to: email,
      subject: 'Reset password instructions',
      html: `
        <p>Hello ${email}</p>

        <p>Someone has requested a link to change your password. You can do this through the link below.</p>

        <p><a href="${link}">Change my password</a></p>

        <p>If you didn't request this, please ignore this email.</p>
        <p>Your password won't change until you access the link above and create a new one.</p>
      `,
    });
  }
}
