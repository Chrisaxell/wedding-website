'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type Bank = { bank: string; number: string; owner: string };
export function AccountAccordion({ groom, bride }: { groom: Bank[]; bride: Bank[] }) {
    const t = useTranslations('WeddingInvite');
    return (
        <Accordion type="multiple" className="w-full">
            <AccordionItem value="groom">
                <AccordionTrigger>{t('ACCOUNTS_GROOM_TITLE')}</AccordionTrigger>
                <AccordionContent className="space-y-3">
                    {groom.map((g, i) => (
                        <div key={i} className="rounded-md border p-3 text-sm">
                            <div>
                                <span className="font-medium">{g.bank}</span> • <span>{g.number}</span>
                            </div>
                            <div className="text-zinc-500">{g.owner}</div>
                            <div className="mt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigator.clipboard.writeText(`${g.bank} ${g.number} (${g.owner})`)}
                                >
                                    {t('ACCOUNTS_COPY')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bride">
                <AccordionTrigger>{t('ACCOUNTS_BRIDE_TITLE')}</AccordionTrigger>
                <AccordionContent className="space-y-3">
                    {bride.map((b, i) => (
                        <div key={i} className="rounded-md border p-3 text-sm">
                            <div>
                                <span className="font-medium">{b.bank}</span> • <span>{b.number}</span>
                            </div>
                            <div className="text-zinc-500">{b.owner}</div>
                            <div className="mt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigator.clipboard.writeText(`${b.bank} ${b.number} (${b.owner})`)}
                                >
                                    {t('ACCOUNTS_COPY')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
