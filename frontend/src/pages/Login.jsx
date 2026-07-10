export default function Login() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 px-6">
      <div className="bg-white border border-slate-200 rounded-md p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
          Citizen Login
        </h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-800"
          >
            Login
          </button>
        </form>
        <p className="text-xs text-slate-500 text-center mt-4">
          New here? <span className="text-blue-700 cursor-pointer">Register</span>
        </p>
      </div>
    </div>
  );
}