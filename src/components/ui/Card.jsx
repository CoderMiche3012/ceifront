export default function Card({ children }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm">
      {children}
    </div>
  );
}