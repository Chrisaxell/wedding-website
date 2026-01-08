'use client';

import { RsvpDialog } from './RsvpDialog';
import { useEffect, useRef, useState } from 'react';

type Props = {
    guestName?: string;
    hasSeenRsvp: boolean;
};

export function RsvpSection({ guestName, hasSeenRsvp }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const hasTriggered = useRef(false);

    useEffect(() => {
        // Don't auto-open if user has already seen RSVP
        if (hasSeenRsvp || hasTriggered.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // When section becomes visible and user hasn't seen RSVP yet
                    if (entry.isIntersecting && !hasTriggered.current) {
                        hasTriggered.current = true;
                        // Small delay to let user see the section first
                        setTimeout(() => {
                            setDialogOpen(true);
                        }, 800);
                    }
                });
            },
            {
                threshold: 0.3, // Trigger when 30% of the section is visible
            },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [hasSeenRsvp]);

    return (
        <div ref={sectionRef} className="mt-4 flex justify-center">
            <RsvpDialog guestName={guestName} open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    );
}
