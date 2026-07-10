export default function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <span className="text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search complaints, citizens, officers..."
          className="w-full text-sm border-none focus:outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-5">
        <span className="text-xl text-gray-500 cursor-pointer relative">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </span>
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
            A
          </span>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}