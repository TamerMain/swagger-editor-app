import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-gray-400 mb-6">Page not found</p>
      <Link
        href="/"
        className="px-3 py-0.5 rounded border-2 border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
