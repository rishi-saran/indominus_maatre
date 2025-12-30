import Link from "next/link";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Discover", href: "/discover" },
  { name: "Services", href: "/services" },
  { name: "Panchang", href: "/panchang" },
  { name: "Bookings", href: "/bookings" },
  { name: "Profile", href: "/profile" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#f6f8e8] border-b">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#9a8f2c]">
          maathre
        </div>

        {/* Navigation */}
        <ul className="flex gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="hover:text-[#9a8f2c]"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons placeholder */}
        <div className="flex gap-4">
          <span>🔍</span>
          <span>👤</span>
        </div>
      </nav>
    </header>
  );
}
