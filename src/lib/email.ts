import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail({
    to,
    name,
    status,
}: {
    to: string;
    name: string;
    status: 'yes' | 'no' | 'maybe';
}) {
    // Map status to subject and html body
    let subject = 'RSVP Confirmation';
    let htmlBody = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.6;">
      <p>Hi ${name},</p>
  `;

    if (status === 'yes') {
        subject = 'Thank you — we can’t wait to celebrate with you!';
        htmlBody += `
      <p>Thank you for coming — we're so happy you'll be joining us 🎉</p>
    `;
    } else if (status === 'no') {
        subject = "We're sorry you can't make it";
        htmlBody += `
      <p>We're sorry you can't make it — you can always reconsider. Please respond before 28 February.</p>
    `;
    } else {
        // maybe
        subject = 'Thanks for your RSVP — please decide by 28 February';
        htmlBody += `
      <p>Thank you for RSVPing. Please make a decision before 28 February — we'll send a reminder before then.</p>
    `;
    }

    htmlBody += `
      <p>Love,<br/>Chris & Scarlett</p>
    </div>
  `;

    try {
        await resend.emails.send({
            from: 'Chris & Scarlett <rsvp@hong.axell.no>',
            to,
            subject,
            html: htmlBody,
        });
    } catch (err: unknown) {
        // Don't throw — caller can decide whether to surface email errors. Log for diagnostics.
        console.error('Failed to send RSVP confirmation email', err);
    }
}
