import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export type RsvpStatus = 'yes' | 'no' | 'maybe';

function wrapRsvpHtml(name: string, bodyHtml: string) {
    return `
      <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${name},</p>
        ${bodyHtml}
        <p>Love,<br/>Chris &amp; Scarlett</p>
      </div>
    `;
}

function buildRsvpEmail(status: RsvpStatus, name: string) {
    // Only the unique paragraph(s) per status are defined here — styling lives in wrapRsvpHtml
    let subject: string = '';
    let body: string = '';

    if (status === 'yes') {
        subject = 'Thank you — we can’t wait to celebrate with you!';
        body = `<p>Thank you for coming — we're so happy you'll be joining us 🎉</p>`;
    }

    if (status === 'no') {
        subject = "We're sorry you can't make it";
        body = `<p>We're sorry you can't make it — you can always reconsider. Please respond before 28 February.</p>`;
    }

    if (status === 'maybe') {
        // maybe
        subject = 'Thanks for your RSVP — please decide by 28 February';
        body = `<p>Thank you for RSVPing. Please make a decision before 28 February — we'll send a reminder before then.</p>`;
    }

    return {
        subject,
        html: wrapRsvpHtml(name, body),
    };
}

export async function sendConfirmationEmail({ to, name, status }: { to: string; name: string; status: RsvpStatus }) {
    const { subject, html } = buildRsvpEmail(status, name);

    try {
        await resend.emails.send({
            from: 'Chris & Scarlett <rsvp@hong.axell.no>',
            to,
            subject,
            html,
        });
    } catch (err: unknown) {
        // Log errors but don't rethrow so RSVP flow isn't blocked by email problems
        console.error('Failed to send RSVP confirmation email', err);
    }
}
