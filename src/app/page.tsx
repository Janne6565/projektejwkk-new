import { getContributionCalendar, getProjects } from '@/lib/api';
import Providers from '@/components/technical/providers';
import RootPage from '@/components/display/RootPage/RootPage';

export const revalidate = 3600;

export default async function Page() {
  const [projects, calendar] = await Promise.all([
    getProjects(),
    getContributionCalendar(),
  ]);

  return (
    <Providers>
      <RootPage projects={projects} calendar={calendar} />
    </Providers>
  );
}
