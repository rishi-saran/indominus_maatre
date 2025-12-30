export default function HomePage() {
  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="h-[70vh] bg-[#eef3c6] flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Hero Section
        </h1>
      </section>

      {/* OUR SERVICES */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-6">
          Our Services
        </h2>
        <p>Chanting, Parihara Pooja, Rituals, Homam, Virtual</p>
      </section>

      {/* OPTIONAL – POPULAR SERVICES */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold">
          Popular Services
        </h2>
      </section>

      {/* ABOUT US */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold">
          About Us
        </h2>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold">
          Customer Reviews
        </h2>
      </section>

    </div>
  );
}
