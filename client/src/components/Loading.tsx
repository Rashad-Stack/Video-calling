export default function Loading() {
  return (
    <div className="fixed backdrop-blur-sm grid place-content-center z-50 inset-0 overflow-hidden">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200" />
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-primary-500 animate-spin" />
      </div>
    </div>
  );
}
