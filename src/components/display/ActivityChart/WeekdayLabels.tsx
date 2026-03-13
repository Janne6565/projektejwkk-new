const LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const WeekdayLabels = () => {
  return (
    <div className="grid grid-rows-7 gap-[3px] text-xs text-muted-foreground pr-1">
      {LABELS.map((label, i) => (
        <div
          key={i}
          className="size-3 sm:size-3.5 flex items-center justify-end"
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default WeekdayLabels;
