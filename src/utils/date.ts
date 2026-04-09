export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
