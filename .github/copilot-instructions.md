# GitHub Copilot Instructions

## General Guidelines
- Follow best practices for Next.js, TypeScript, and Tailwind CSS
- Write clean, maintainable, and well-documented code
- Make reusable components. Avoid duplication. Use shadcn/ui components when possible

## Shell
- **Always use PowerShell** for terminal commands, NOT cmd or bash

## Translations (i18n)

### Critical Rules
1. **Don't modify Korean (`messages/ko.json`) you can add variables but keep them empty**
2. **Only work in English (`messages/en.json`)** by default
3. **Wait for explicit instruction** before updating other languages (es, pt, de, sv, da, nb, ar, ca, zh, gn)
4. **Base all translation on english except korean** (es, pt, de, sv, da, nb, ar, ca, zh, gn)
5. When adding new translation keys:
   - Add to English first
   - Wait for user to request other language updates
   - DO NOT automatically update all languages

### Language Priority
- Default language for changes: **English**
- Only change Korean if explicitly told "work with Korean"
- Other languages: only update when specifically asked

## Tech Stack
- Next.js 16 (App Router), TypeScript, Prisma, next-intl, Tailwind CSS v4
- Location: `messages/[locale].json`
- Use Server Components by default, add `"use client"` only when needed
- **Use shadcn/ui components wherever possible** to increase reusability and reduce complexity

