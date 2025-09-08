import { cn } from '@/lib/utils';
import React from 'react'
import { Link, matchPath, useLocation } from 'react-router';

const NavItem = ({
  href,
  icon: Icon,
  children,
  handleNavigation
}: {
  href: string;
  icon: any;
  children: React.ReactNode;
  handleNavigation: () => void
}) => {
  const { pathname } = useLocation();
const match = matchPath({ path: href, end: href === "/dashboard" }, pathname);
const isActive = Boolean(match);

  return (
    <Link
      to={href}
      onClick={handleNavigation}
      className={cn(
        "flex items-center px-3 gap-2 py-2 text-sm rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-gray-700 hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      {
        Icon && <Icon className="h-4 w-4 flex-shrink-0" />
      }
      {children}
    </Link>
  );
}

export default NavItem