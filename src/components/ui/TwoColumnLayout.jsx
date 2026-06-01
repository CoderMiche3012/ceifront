export default function TwoColumnLayout({
  left,
  right,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 space-y-6">
        {left}
      </div>

      <div className="xl:col-span-1 space-y-6">
        {right}
      </div>
    </div>
  );
}