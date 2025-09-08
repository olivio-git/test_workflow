import React from "react";

const ButtonItem = ({
  onClick,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  icon: any;
  children: React.ReactNode;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-700 hover:bg-secondary hover:text-secondary-foreground cursor-pointer"
    >
      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
      {children}
    </div>
  );
};

export default ButtonItem;
