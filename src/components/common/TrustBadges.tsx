export function TrustBadges() {
  const badges = ['FDA Registered', 'CE Certified', 'Encrypted Checkout', 'Clinical Support 24/7'];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge) => (
        <div key={badge} className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm font-medium text-accent-800">
          {badge}
        </div>
      ))}
    </div>
  );
}
