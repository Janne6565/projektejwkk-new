import { useTranslation } from 'react-i18next';
import { useModal } from '@/components/technical/modal-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { DayContribution } from '@/types/contribution-chart';

function groupByProject(
  contributions: DayContribution[],
): [string, DayContribution[]][] {
  const map = new Map<string, DayContribution[]>();
  for (const c of contributions) {
    const existing = map.get(c.projectName) ?? [];
    existing.push(c);
    map.set(c.projectName, existing);
  }
  return Array.from(map.entries());
}

function shortenRef(reference: string): string {
  try {
    const url = new URL(reference);
    const parts = url.pathname.split('/');
    // e.g. /user/repo/commit/abc123 → commit/abc123
    return parts.slice(-2).join('/');
  } catch {
    return reference;
  }
}

const DayDetailModal = () => {
  const { state, close } = useModal();
  const { t } = useTranslation();

  if (state.type !== 'day') return null;

  const grouped = groupByProject(state.contributions);

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{state.date}</DialogTitle>
          <DialogDescription>
            {state.contributions.length} {t('projects.contributionsOnDay')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {grouped.map(([projectName, contribs]) => (
            <div key={projectName}>
              <h4 className="font-medium mb-1">{projectName}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {contribs.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {c.type}
                    </Badge>
                    <a
                      href={c.reference}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 hover:text-foreground truncate"
                    >
                      {shortenRef(c.reference)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailModal;
