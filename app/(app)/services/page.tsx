export default function ServicesPage() {
  const categories = ["Rituals / Homam", "Parihara Pooja", "Chanting", "Virtual"];

  return (
    <div className="max-w-7xl mx-auto px-10 py-12">
      <div className="mb-10">
        <nav className="text-sm text-gray-400 mb-4">Home &gt; Services</nav>
        <h1 className="text-4xl font-serif uppercase tracking-wider">Services</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div key={cat} className="group cursor-pointer">
            <div className="aspect-square bg-white rounded-3xl mb-4 shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all">
               <span className="text-5xl opacity-80">🪔</span>
            </div>
            <h3 className="text-center font-bold text-gray-800 uppercase tracking-tighter">{cat}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}