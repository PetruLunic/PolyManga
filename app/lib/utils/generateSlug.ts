export const generateSlug = (titles: Array<{language: string, value: string}>) => {
  const englishTitle = titles.find(t => t.language === 'En')?.value;
  if (!englishTitle) throw new Error('English title required');

  return englishTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};