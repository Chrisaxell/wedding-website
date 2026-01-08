'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type Bank = { bank: string; number: string; owner: string };
type Props = {
    brideGroom: Bank[];
    brideParents?: Bank[];
};

export function AccountAccordion({ brideGroom, brideParents }: Props) {
    const t = useTranslations('WeddingInvite');
    return (
        <Accordion type="multiple" className="w-full">
            <AccordionItem value="bride-groom">
                <AccordionTrigger>{t('ACCOUNTS_BRIDE_GROOM_TITLE')}</AccordionTrigger>
                <AccordionContent className="space-y-3">
                    {brideGroom.map((account, i) => (
                        <div key={i} className="rounded-md border p-3 text-sm">
                            <div>
                                <span className="font-medium">{account.bank}</span> • <span>{account.number}</span>
                            </div>
                            <div className="text-zinc-500">{account.owner}</div>
                            <div className="mt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            `${account.bank} ${account.number} (${account.owner})`,
                                        )
                                    }
                                >
                                    {t('ACCOUNTS_COPY')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>

            {brideParents && brideParents.length > 0 && (
                <AccordionItem value="bride-parents">
                    <AccordionTrigger>{t('ACCOUNTS_BRIDE_PARENTS_TITLE')}</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        {brideParents.map((account, i) => (
                            <div key={i} className="rounded-md border p-3 text-sm">
                                <div>
                                    <span className="font-medium">{account.bank}</span> • <span>{account.number}</span>
                                </div>
                                <div className="text-zinc-500">{account.owner}</div>
                                <div className="mt-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                `${account.bank} ${account.number} (${account.owner})`,
                                            )
                                        }
                                    >
                                        {t('ACCOUNTS_COPY')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            )}
        </Accordion>
    );
}
