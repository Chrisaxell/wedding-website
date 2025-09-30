'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

type Bank = { bank: string; number: string; owner: string };
export function AccountAccordion({ groom, bride }: { groom: Bank[]; bride: Bank[] }) {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="groom">
        <AccordionTrigger>신랑측 계좌번호</AccordionTrigger>
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
                  onClick={() =>
                    navigator.clipboard.writeText(`${g.bank} ${g.number} (${g.owner})`)
                  }
                >
                  복사
                </Button>
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="bride">
        <AccordionTrigger>신부측 계좌번호</AccordionTrigger>
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
                  onClick={() =>
                    navigator.clipboard.writeText(`${b.bank} ${b.number} (${b.owner})`)
                  }
                >
                  복사
                </Button>
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
