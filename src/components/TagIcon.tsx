import { Briefcase, Heart, GraduationCap, Coffee, Plane, Users, Home, UtensilsCrossed, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Heart,
  GraduationCap,
  Coffee,
  Plane,
  Users,
  Home,
  UtensilsCrossed,
};

type Props = {
  iconName: string;
  className?: string;
};

export function TagIcon({ iconName, className = "size-4" }: Props) {
  const Icon = iconMap[iconName];
  if (!Icon) return null;
  return <Icon className={className} />;
}
