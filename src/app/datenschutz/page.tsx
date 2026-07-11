import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout from '@/components/display/Legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – Janne Keipert',
  description: 'Informationen zur Verarbeitung personenbezogener Daten gemäß Art. 13 DSGVO.',
  alternates: { canonical: '/datenschutz' },
  robots: { index: false, follow: true },
};

// ---------------------------------------------------------------------------
// NOTE (Janne): tailored to the current site — self-hosted, no analytics, no
// third-party fonts, first-party API only, localStorage for the language
// preference. If you later add analytics, embeds, a contact form, or external
// fonts, this document MUST be extended accordingly.
// ---------------------------------------------------------------------------

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        <br />
        Janne Keipert
        <br />
        Marchlewskistraße 102
        <br />
        10243 Berlin, Deutschland
        <br />
        E-Mail:{' '}
        <a href="mailto:jabbekeipert@gmail.com">jabbekeipert@gmail.com</a>
      </p>
      <p>
        Die vollständigen Kontaktdaten finden Sie im{' '}
        <Link href="/impressum">Impressum</Link>.
      </p>

      <h2>2. Allgemeines zur Datenverarbeitung</h2>
      <p>
        Diese Website verarbeitet personenbezogene Daten nur im technisch
        notwendigen Umfang. Es findet kein Tracking statt, es werden keine
        Analyse-Dienste (z. B. Google Analytics), keine externen Schriftarten und
        keine Werbe-Cookies eingesetzt. Eine Weitergabe Ihrer Daten an Dritte zu
        Werbezwecken erfolgt nicht.
      </p>

      <h2>3. Server-Logfiles beim Aufruf der Website</h2>
      <p>
        Beim Aufruf dieser Website werden durch den Server automatisch
        Informationen erfasst, die Ihr Browser übermittelt. Dies sind insbesondere:
      </p>
      <ul>
        <li>IP-Adresse des anfragenden Geräts</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>Name und URL der abgerufenen Datei</li>
        <li>verwendeter Browser und ggf. das Betriebssystem</li>
        <li>die Website, von der aus der Zugriff erfolgt (Referrer)</li>
      </ul>
      <p>
        Diese Daten sind technisch erforderlich, um die Website auszuliefern,
        Stabilität und Sicherheit zu gewährleisten und Missbrauch abzuwehren.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
        einem sicheren und funktionsfähigen Betrieb der Website). Die Logdaten
        werden nicht mit anderen Datenquellen zusammengeführt und nach Wegfall des
        Zwecks bzw. nach einer kurzen Speicherfrist gelöscht.
      </p>

      <h2>4. Bereitgestellte Inhalte (eigene Schnittstelle)</h2>
      <p>
        Die auf der Startseite angezeigten Projektdaten, Beiträge und Bilder werden
        von einer eigenen Schnittstelle unter{' '}
        <code>project-manager.jannekeipert.de</code> geladen, die vom selben
        Verantwortlichen betrieben wird. Beim Laden dieser Inhalte wird – wie bei
        jedem Serveraufruf – Ihre IP-Adresse technisch verarbeitet (siehe Ziffer 3).
        Eine Weitergabe an Dritte erfolgt nicht.
      </p>

      <h2>5. Lokale Speicherung der Spracheinstellung</h2>
      <p>
        Zur Speicherung Ihrer gewählten Anzeigesprache wird ein Eintrag im lokalen
        Speicher (localStorage) Ihres Browsers abgelegt. Dieser Eintrag ist für die
        von Ihnen ausdrücklich gewünschte Funktion technisch erforderlich (§ 25
        Abs. 2 Nr. 2 TDDDG) und wird nicht an einen Server übertragen und nicht für
        Analyse- oder Trackingzwecke verwendet. Sie können ihn jederzeit über die
        Einstellungen Ihres Browsers löschen.
      </p>

      <h2>6. Ihre Rechte als betroffene Person</h2>
      <p>Ihnen stehen gegenüber dem Verantwortlichen folgende Rechte zu:</p>
      <ul>
        <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
        <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
        <li>Recht auf Löschung (Art. 17 DSGVO)</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
      </ul>
      <p>
        Zur Ausübung dieser Rechte genügt eine formlose Nachricht an die oben
        genannte Kontaktadresse.
      </p>

      <h2>7. Beschwerderecht bei der Aufsichtsbehörde</h2>
      <p>
        Unabhängig davon haben Sie das Recht, sich bei einer
        Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen
        Daten zu beschweren (Art. 77 DSGVO). Für den Verantwortlichen zuständig
        ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit,
        Alt-Moabit 59–61, 10555 Berlin.
      </p>

      <h2>8. Aktualität</h2>
      <p>
        Diese Datenschutzerklärung wird bei Änderungen der Website oder der
        Rechtslage angepasst. Es gilt jeweils die auf dieser Seite veröffentlichte
        aktuelle Fassung.
      </p>
    </LegalLayout>
  );
}
