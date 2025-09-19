"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/customers", label: "Customers" },
    { href: "/products", label: "Products" },
    { href: "/suppliers", label: "Suppliers" },
    { href: "/categories", label: "Categories" },
    { href: "/employees", label: "Employees" },
    { href: "/sales", label: "Sales" },
    { href: "/purchases", label: "Purchases" },
    { href: "/returns", label: "Returns" },
    { href: "/inventory", label: "Inventory" },
    { href: "/services", label: "Services" },
    { href: "/service-usages", label: "Service Usage" },
  ];

  return (
    <aside className="w-60 h-screen border-r border-gray-200 bg-white flex flex-col">
      {/* App Title */}
      <h2 className="text-lg font-semibold text-gray-800 p-4 border-b bg-gray-50">
        Clothes Management
      </h2>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith(link.href)
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
