import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/display/Footer/Footer';

// Shared shell for the German legal pages (Impressum, Datenschutzerklärung).
// Server component — the content is fully static.
const LegalLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-10 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Zurück zur Startseite
        </Link>
        <h1 className="mb-8 text-3xl font-bold tracking-tight">{title}</h1>
        <div className="space-y-6 leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:text-muted-foreground">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalLayout;
