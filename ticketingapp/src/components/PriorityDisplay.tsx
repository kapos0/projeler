export default function PriorityDisplay({ priority }: { priority: number }) {
  return (
    <div className="flex justify-start align-baseline">
      <i
        className={`bi bi-fire pr-1 ${
          priority > 0 ? " text-red-400" : " text-slate-400"
        }`}
      />
      <i
        className={`bi bi-fire pr-1 ${
          priority > 1 ? " text-red-400" : " text-slate-400"
        }`}
      />
      <i
        className={`bi bi-fire pr-1 ${
          priority > 2 ? " text-red-400" : " text-slate-400"
        }`}
      />
      <i
        className={`bi bi-fire pr-1 ${
          priority > 3 ? " text-red-400" : " text-slate-400"
        }`}
      />
      <i
        className={`bi bi-fire pr-1 ${
          priority > 4 ? " text-red-400" : " text-slate-400"
        }`}
      />
    </div>
  );
}
