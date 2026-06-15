import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

function toPascalCase(iconName: string) {
  return iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export const getIconComponent = (iconName: string): LucideIcon => {
  const IconComponent =
    Icons[iconName as keyof typeof Icons] ||
    Icons[toPascalCase(iconName) as keyof typeof Icons];

  if (!IconComponent) {
    return Icons.HelpCircle;
  }

  return IconComponent as LucideIcon;
};
