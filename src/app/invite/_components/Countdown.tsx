'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { AddCalendarButton } from './AddCalendarButton';
import { useText } from '@/components/TranslatedText';

function getParts(targetISO: string) {
    const target = new Date(targetISO).getTime();
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    return { days, hours, mins, secs };
}

export interface CountdownProps {
    dateISO: string;
    padDays?: boolean;
    padTime?: boolean;
}

export function Countdown({ dateISO, padDays = true, padTime = true }: CountdownProps) {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const text = useText();

    useEffect(() => {
        setMounted(true);
        setTime(getParts(dateISO));
        const id = setInterval(() => setTime(getParts(dateISO)), 1000);
        return () => clearInterval(id);
    }, [dateISO]);

    return (
        <section className="px-6 pt-8 pb-6">
            <Card className="bg-zinc-50">
                <CardContent className="p-6">
                    <div className="mb-4 text-center text-base text-sm font-medium text-zinc-700">
                        {text('COUNTDOWN_HEADER', { days: time.days })}
                    </div>
                    <div className="flex justify-center">
                        <div className="flex items-stretch justify-center gap-2">
                            <TimeBlock
                                label={text('COUNTDOWN_DAYS_LABEL')}
                                value={padDays ? time.days.toString().padStart(2, '0') : time.days.toString()}
                                mounted={mounted}
                            />
                            <TimeBlock
                                label={text('COUNTDOWN_HOURS_LABEL')}
                                value={padTime ? time.hours.toString().padStart(2, '0') : time.hours.toString()}
                                mounted={mounted}
                            />
                            <TimeBlock
                                label={text('COUNTDOWN_MINS_LABEL')}
                                value={padTime ? time.mins.toString().padStart(2, '0') : time.mins.toString()}
                                mounted={mounted}
                            />
                            <TimeBlock
                                label={text('COUNTDOWN_SEC_LABEL')}
                                value={padTime ? time.secs.toString().padStart(2, '0') : time.secs.toString()}
                                mounted={mounted}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <div className="w-[250px]">
                            <AddCalendarButton />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

function TimeBlock({ label, value, mounted }: { label: string; value: string; mounted: boolean }) {
    return (
        <div className="flex min-w-[58px] flex-col items-center justify-center rounded-md border border-zinc-200 bg-white px-2 py-2 font-sans shadow-sm">
            <span className="flex h-8 items-center text-2xl leading-none font-semibold lining-nums tabular-nums">
                {mounted ? value : '00'}
            </span>
            <span className="mt-1 text-[9px] tracking-wide text-zinc-500 uppercase">{label}</span>
        </div>
    );
}
