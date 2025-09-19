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
        "flex items-center p-2 gap-2 text-sm rounded-md transition-all relative overflow-hidden",
        isActive
          ? " bg-secondary text-primary font-semibold before:absolute before:left-0 before:top-1/2 before:h-full before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-primary"
          : "text-gray-700 hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      {
        Icon && <Icon className="size-4 flex-shrink-0" />
      }
      {children} 
    </Link>
  );
}

export default NavItem