'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useText } from '@/components/TranslatedText';
import { trackEvent } from '@/components/AnalyticsTracker';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onContinue: (email: string, existingName?: string) => void;
};

export function EmailCheckDialog({ open, onOpenChange, onContinue }: Props) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [existingRsvp, setExistingRsvp] = useState<{ name: string; status: string } | null>(null);
    const text = useText();

    async function handleContinue() {
        if (!email || !email.includes('@')) {
            // No email or invalid email, just continue
            onContinue(email);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/rsvp/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (data.exists) {
                // Found existing RSVP - show confirmation
                setExistingRsvp({ name: data.name, status: data.status });
                setShowUpdateConfirmation(true);

                // Track identified user by email
                trackEvent('existing_rsvp_detected', {
                    guest_name: data.name,
                    email: email,
                });

                // Update analytics tracking with email-based name
                document.cookie = `guest_name=${encodeURIComponent(data.name)}; path=/; max-age=${60 * 60 * 24 * 365}`;
                document.cookie = `guest_email=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 365}`;
            } else {
                // No existing RSVP, continue with form
                onContinue(email);
            }
        } catch (error) {
            console.error('Failed to check email:', error);
            // If check fails, just continue
            onContinue(email);
        } finally {
            setLoading(false);
        }
    }

    function handleUpdateConfirmation(shouldUpdate: boolean) {
        if (!shouldUpdate) {
            // User doesn't want to update, close everything
            onOpenChange(false);
            setShowUpdateConfirmation(false);
            setEmail('');
            setExistingRsvp(null);
            trackEvent('rsvp_update_declined', {
                guest_name: existingRsvp?.name || 'unknown',
                email: email,
            });
        } else {
            // User wants to update, continue to RSVP form
            trackEvent('rsvp_update_confirmed', {
                guest_name: existingRsvp?.name || 'unknown',
                email: email,
            });
            onContinue(email, existingRsvp?.name);
            setShowUpdateConfirmation(false);
            setEmail('');
            setExistingRsvp(null);
        }
    }

    function handleSkip() {
        // User wants to skip email and go directly to form
        onContinue('');
        setEmail('');
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{text('RSVP_DIALOG_TITLE')}</DialogTitle>
                </DialogHeader>

                {showUpdateConfirmation && existingRsvp ? (
                    <div className="space-y-4 pb-4">
                        <p className="text-sm text-zinc-600">
                            {text('RSVP_EXISTING_FOUND', { name: existingRsvp.name })}
                        </p>
                        <p className="text-sm text-zinc-500">{text('RSVP_UPDATE_QUESTION')}</p>
                        <div className="flex flex-col gap-2">
                            <Button onClick={() => handleUpdateConfirmation(true)} className="w-full">
                                {text('RSVP_UPDATE_YES')}
                            </Button>
                            <Button
                                onClick={() => handleUpdateConfirmation(false)}
                                variant="outline"
                                className="w-full"
                            >
                                {text('RSVP_UPDATE_NO')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 pb-4">
                        <p className="text-sm text-zinc-600">{text('RSVP_EMAIL_CHECK_PROMPT')}</p>
                        <div className="space-y-2">
                            <Label htmlFor="email-check">{text('RSVP_EMAIL_LABEL')}</Label>
                            <Input
                                id="email-check"
                                type="email"
                                placeholder={text('RSVP_EMAIL_PLACEHOLDER')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleContinue();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleContinue} disabled={loading} className="w-full">
                                {loading ? '...' : text('RSVP_EMAIL_CHECK_CONTINUE')}
                            </Button>
                            <Button onClick={handleSkip} variant="outline" className="w-full">
                                {text('RSVP_EMAIL_CHECK_SKIP')}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
