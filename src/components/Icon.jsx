import {
  Plane,
  Ship,
  Car,
  CalendarClock,
  Map,
  Package,
  MapPin,
} from "lucide-react";

const registry = { Plane, Ship, Car, CalendarClock, Map, Package, MapPin };

/** Small helper so icon names stay editable inside src/data/business.js */
export default function Icon({ name, size = 22, strokeWidth = 1.6, className = "" }) {
  const Cmp = registry[name] || MapPin;
  return (
    <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
  );
}
