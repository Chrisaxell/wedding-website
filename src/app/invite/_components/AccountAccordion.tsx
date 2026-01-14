'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useText, useRichText } from '@/components/TranslatedText';

type AccountItem = {
    bank: string;
    number: string;
    owner: string;
};

type Props = {
    brideGroomAccounts: AccountItem[];
    brideParentsAccounts: AccountItem[];
};

export function AccountAccordion({ brideGroomAccounts, brideParentsAccounts }: Props) {
    const text = useText();
    const richText = useRichText();

    const copyToClipboard = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <div className="space-y-4">
            <p className="text-center text-sm leading-relaxed text-zinc-600">{richText('ACCOUNTS_INTRO_TEXT')}</p>

            <Accordion type="multiple" className="w-full">
                {/* Bride & Groom Section */}
                <AccordionItem value="bride-groom">
                    <AccordionTrigger>{text('ACCOUNTS_BRIDE_GROOM_TITLE')}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            {brideGroomAccounts.map((account, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-md border bg-white p-3">
                                    <div className="flex-1 text-sm">
                                        <div className="text-zinc-800">
                                            {account.bank} <span className="font-medium">{account.number}</span>
                                        </div>
                                        <div className="mt-0.5 whitespace-pre-line text-zinc-600">{account.owner}</div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(account.number)}
                                        className="shrink-0 px-3"
                                    >
                                        {text('ACCOUNTS_COPY')}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Bride's Parents Section */}
                {brideParentsAccounts && brideParentsAccounts.length > 0 && (
                    <AccordionItem value="bride-parents">
                        <AccordionTrigger>{text('ACCOUNTS_BRIDE_PARENTS_TITLE')}</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-2">
                                {brideParentsAccounts.map((account, i) => (
                                    <div key={i} className="flex items-start gap-3 rounded-md border bg-white p-3">
                                        <div className="flex-1 text-sm">
                                            <div className="text-zinc-800">
                                                {account.bank} <span className="font-medium">{account.number}</span>
                                            </div>
                                            <div className="mt-0.5 whitespace-pre-line text-zinc-600">
                                                {account.owner}
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyToClipboard(account.number)}
                                            className="shrink-0 px-3"
                                        >
                                            {text('ACCOUNTS_COPY')}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );
}
