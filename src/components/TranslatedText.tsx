'use client';

import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

type TranslatedTextProps = {
    /** The translation key to look up */
    tKey: string;
    /** The namespace for the translation (default: 'WeddingInvite') */
    ns?: string;
    /** Optional className for the wrapper element */
    className?: string;
    /** Optional tag to wrap the content (default: 'span') */
    as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** Additional values to interpolate into the translation */
    values?: Record<string, string | number>;
};

// Rich text formatting tags for use in translation strings
// Supported tags: <b>, <i>, <u>, <br/>, <p>, <strong>, <em>, <span>
const richTextComponents = {
    b: (chunks: ReactNode) => <b className="font-semibold">{chunks}</b>,
    strong: (chunks: ReactNode) => <strong className="font-semibold">{chunks}</strong>,
    i: (chunks: ReactNode) => <i className="italic">{chunks}</i>,
    em: (chunks: ReactNode) => <em className="italic">{chunks}</em>,
    u: (chunks: ReactNode) => <u className="underline">{chunks}</u>,
    p: (chunks: ReactNode) => <p>{chunks}</p>,
    span: (chunks: ReactNode) => <span>{chunks}</span>,
    br: () => <br />,
};

/**
 * useText - Hook for getting plain text translations
 *
 * Usage:
 *   const text = useText();
 *   <span>{text('LOCATION_HEADING')}</span>
 *   <span>{text('COUNTDOWN_HEADER', { days: 42 })}</span>
 */
export function useText(ns: string = 'WeddingInvite') {
    const t = useTranslations(ns);
    return (key: string, values?: Record<string, string | number>) => {
        return values ? t(key, values) : t(key);
    };
}

/**
 * useRichText - Hook for getting rich text translations with formatting
 *
 * Usage:
 *   const richText = useRichText();
 *   <div>{richText('INVITATION_BODY')}</div>
 *   <div>{richText('COUNTDOWN_HEADER', { days: 42 })}</div>
 */
export function useRichText(ns: string = 'WeddingInvite') {
    const t = useTranslations(ns);
    return (key: string, values?: Record<string, string | number>) => {
        return t.rich(key, { ...richTextComponents, ...values });
    };
}

/**
 * TranslatedText - A flexible component for rendering translated text with rich formatting
 *
 * Usage:
 *   <TranslatedText tKey="INVITATION_PARENTS" />
 *   <TranslatedText tKey="COUNTDOWN_HEADER" values={{ days: 42 }} />
 *   <TranslatedText tKey="HEADING" as="h2" className="text-lg" />
 *
 * In your translation JSON, use tags like:
 *   "KEY": "Normal text <b>bold text</b><br/>New line <i>italic</i>"
 */
export function TranslatedText({
    tKey,
    ns = 'WeddingInvite',
    className,
    as: Tag = 'span',
    values = {},
}: TranslatedTextProps) {
    const t = useTranslations(ns);

    // Check if the translation exists and is not empty
    let rawText: string;
    try {
        rawText = t.raw(tKey);
    } catch {
        // Key doesn't exist
        return null;
    }

    // Don't render if the translation is empty
    if (!rawText || rawText.trim() === '') {
        return null;
    }

    return <Tag className={className}>{t.rich(tKey, { ...richTextComponents, ...values })}</Tag>;
}

/**
 * Helper function to get rich text components for inline use with t.rich()
 * Usage: t.rich('KEY', getRichTextComponents())
 */
export function getRichTextComponents() {
    return richTextComponents;
}

/**
 * Helper function to merge rich text components with custom values
 * Usage: t.rich('KEY', withRichText({ days: 42 }))
 */
export function withRichText(values: Record<string, unknown> = {}) {
    return { ...richTextComponents, ...values };
}

export default TranslatedText;
