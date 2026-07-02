import  MethodBadge  from "@/components/Viewer/MethodBadge";


export default function PalettePage() {
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
  const paramTypes = ['path', 'query', 'header', 'cookie'];
  const statusCodes = [200, 201, 400, 404, 500];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-neutral-950 min-h-screen">
      <h1 className="text-2xl font-bold text-neutral-50">🎨 Neutral Palette</h1>
      
      {/* Backgrounds */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Backgrounds</h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-4 rounded bg-neutral-950 border border-neutral-800">
            <span className="text-neutral-50 text-sm">neutral-950</span>
          </div>
          <div className="p-4 rounded bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-50 text-sm">neutral-900</span>
          </div>
          <div className="p-4 rounded bg-neutral-800 border border-neutral-700">
            <span className="text-neutral-50 text-sm">neutral-800</span>
          </div>
          <div className="p-4 rounded bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-50 text-sm">neutral-900/50</span>
          </div>
          <div className="p-4 rounded bg-neutral-800/50 border border-neutral-700">
            <span className="text-neutral-50 text-sm">neutral-800/50</span>
          </div>
          <div className="p-4 rounded bg-neutral-700/30 border border-neutral-700">
            <span className="text-neutral-50 text-sm">neutral-700/30</span>
          </div>
        </div>
      </section>

      {/* Method Badges (unchanged) */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Method Badges (unchanged)</h2>
        <div className="flex flex-wrap gap-2">
          {methods.map(method => (
            <MethodBadge key={method} method={method as any} />
          ))}
        </div>
      </section>

      {/* Parameter Types */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Parameter Types</h2>
        <div className="flex flex-wrap gap-2">
          {paramTypes.map(type => (
            <span key={type} className={`px-3 py-1 rounded border text-xs font-mono uppercase ${
              type === 'path' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
              type === 'query' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
              type === 'header' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
              'bg-pink-500/20 text-pink-400 border-pink-500/30'
            }`}>
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* Status Codes */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Status Codes</h2>
        <div className="flex flex-wrap gap-2">
          {statusCodes.map(code => (
            <span key={code} className={`px-3 py-1 rounded border text-xs font-mono ${
              code < 300 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              code < 400 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
              code < 500 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {code}
            </span>
          ))}
        </div>
      </section>

      {/* Text Colors */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Text Colors</h2>
        <div className="space-y-1">
          <p className="text-neutral-50">text-neutral-50 (Primary)</p>
          <p className="text-neutral-300">text-neutral-300 (Secondary)</p>
          <p className="text-neutral-400">text-neutral-400 (Tertiary)</p>
          <p className="text-neutral-500">text-neutral-500 (Muted)</p>
          <p className="text-neutral-600">text-neutral-600 (Disabled)</p>
        </div>
      </section>

      {/* Sample Card */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Sample Card</h2>
        <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-mono">
              200
            </span>
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono">
              GET
            </span>
            <span className="text-neutral-50 font-mono text-sm">/api/users</span>
            <span className="text-neutral-400 text-sm">Get all users</span>
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            ⏱ 145ms • 📤 0 B • 📥 12.4 KB
          </div>
        </div>
      </section>

      {/* Borders */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Borders</h2>
        <div className="space-y-1">
          <div className="border border-neutral-800 p-2 rounded text-neutral-50">border-neutral-800</div>
          <div className="border border-neutral-700 p-2 rounded text-neutral-50">border-neutral-700</div>
          <div className="border border-neutral-600 p-2 rounded text-neutral-50">border-neutral-600</div>
          <div className="border border-neutral-500 p-2 rounded text-neutral-50">border-neutral-500</div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-400">Form Elements</h2>
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Input field"
            className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          />
          <textarea 
            placeholder="Textarea"
            className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded text-neutral-50 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 h-20"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-50 text-sm transition">
              Cancel
            </button>
            <button className="px-4 py-2 bg-neutral-50 hover:bg-neutral-200 rounded text-neutral-900 text-sm transition">
              Submit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}