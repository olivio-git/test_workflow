import React from 'react'
import { Link } from 'react-router';

const NavItem = ({
    href,
    icon: Icon,
    children,
    handleNavigation
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
    handleNavigation:()=>void
  }) => {
   return (
      <Link
        to={href} 
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      >
        {
          Icon && <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        }
        {children}
      </Link>
    );
}

export default NavItem