# ReByte Tool Addition Rules

When the user asks to add a new ReByte tool and provides its name, category, and English/Indonesian copy, implement the complete tool without requiring a separate layout specification.

## Required Structure

- Add one metadata record to `lib/tools.ts`.
- Use a lowercase kebab-case `slug` and keep the slug identical in all registrations.
- Add the Indonesian `name`, `description`, and localized category to `lib/toolTranslations.ts`.
- Add a client component under `components/tools/<ToolName>Tool.tsx`.
- Register the component with `next/dynamic` and `toolComponents` in `components/ToolRenderer.tsx`.
- Add a matching logo under `public/icons/<name>.svg`.
- Add a tool-specific bilingual guide to `components/LocalizedToolContent.tsx`.

## Layout Rules

- Follow the existing tool shell: vertical `space-y-6` rhythm, rounded `3xl` controls, slate borders/backgrounds, sky focus states, and dark-mode classes.
- Build a usable interactive tool, not a placeholder. Keep all processing in the browser unless the user explicitly requests a server feature.
- Use `FileDropzone` for image/file input so keyboard access, drag and drop, and file validation stay consistent.
- Include a clear preview, result, copy, or download action whenever the tool produces output.
- Keep controls responsive with grid/flex layouts and avoid fixed widths that overflow on mobile.
- Use labels and accessible button text for every input and action.

## Language Rules

- All visible tool-specific UI labels, buttons, placeholders, errors, and status text must support English and Indonesian through the existing `useLanguage` context.
- English is the default language; Indonesian text is selected when `language === 'id'`.
- The tool detail title, description, category, and metadata must come from `getLocalizedTool` and the translation map.
- The “How to use” guide must describe the actual controls and workflow of that specific tool in both languages. Do not use the generic default guide for a new tool.

## Logo Rules

- Use a simple outline SVG matching the existing icons, preferably a `24x24` viewBox with `fill="none"`, rounded line caps, and no large colored background.
- New logos must be black/monochrome, using `stroke="#0f172a"` so they match the existing tool logos in cards and detail pages.
- The icon should communicate the tool's function and remain legible at the existing 28px and 32px display sizes.

## Verification

After adding a tool:

1. Run `npx tsc --noEmit`.
2. Run `npm run build` to verify the new static tool route.
3. Check the new slug, logo path, renderer registration, Indonesian translation, and custom bilingual guide all match.
