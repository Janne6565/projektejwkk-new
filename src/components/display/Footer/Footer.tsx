import Link from 'next/link';

// Legal footer: keeps the Impressum + Datenschutzerklärung "ständig verfügbar"
// (reachable from every page) as required by §5 DDG / DSGVO Art. 13.
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/50 bg-background text-muted-foreground border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm sm:flex-row">
        <span>© {year} Janne Keipert</span>
        <nav className="flex items-center gap-5">
          <Link href="/impressum" className="hover:text-foreground transition-colors">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-foreground transition-colors">
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
