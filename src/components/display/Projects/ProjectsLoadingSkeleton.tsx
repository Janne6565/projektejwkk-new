import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ProjectsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full mt-2" />
          <div className="h-4 bg-muted rounded w-2/3 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="h-5 bg-muted rounded w-24" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ProjectsLoadingSkeleton;
