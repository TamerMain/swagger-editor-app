import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          © {new Date().getFullYear()} Swagger UI
        </span>
        
        <Link 
          href="/about" 
          className="text-sm text-gray-400 hover:text-white transition"
        >
          About
        </Link>
      </div>
    </footer>
  );
}