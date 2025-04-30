import Link from "next/link";

export const navLinks = [
  {
    label: "Нүүр",
    href: "/",
  },
  {
    label: "Амьтдын төрөл",
    href: "/pets",
  },
  {
    label: "Үрчлүүлэх",
    href: "/adoption",
  },
  // {
  //   label: "Хандив",
  //   href: "/donation",
  // },
  {
    label: "Асуулт хариулт",
    href: "/faq",
  },
];
export const Navigation: React.FC = () => {
  return (
    <nav className="hidden items-center md:block">
      <ul className="flex items-center">
        {navLinks.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="inline-block px-6 font-medium hover:text-gray-500"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
