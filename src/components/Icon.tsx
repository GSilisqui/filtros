import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import {
  faMagnifyingGlass,
  faHouse,
  faMessage,
  faCalendar,
  faAddressCard,
  faChartLine,
  faComments,
  faSparkles,
  faGear,
  faBell,
  faArrowLeft,
  faArrowRight,
  faAngleRight,
  faAngleDown,
  faHeadset,
  faComment,
  faPhoneIntercom,
  faFaceSmile,
  faPlus,
  faColumns,
  faBarsFilter,
  faArrowDownToLine,
  faUsers,
  faAddressBook,
  faArrowUpRightFromSquare,
} from '@fortawesome/pro-regular-svg-icons';

const iconMap: Record<string, IconDefinition> = {
  'search':        faMagnifyingGlass,
  'home':          faHouse,
  'message':       faMessage,
  'calendar':      faCalendar,
  'contact-card':  faAddressCard,
  'chart-line':    faChartLine,
  'comments':      faComments,
  'sparkles':      faSparkles,
  'gear':          faGear,
  'bell':          faBell,
  'arrow-left':    faArrowLeft,
  'arrow-right':   faArrowRight,
  'angle-right':   faAngleRight,
  'angle-down':    faAngleDown,
  'user-headset':  faHeadset,
  'comment':       faComment,
  'phone-intercom':faPhoneIntercom,
  'smile':         faFaceSmile,
  'plus':          faPlus,
  'columns':       faColumns,
  'bars-filter':   faBarsFilter,
  'download':      faArrowDownToLine,
  'users':         faUsers,
  'address-card':  faAddressBook,
  'external-link': faArrowUpRightFromSquare,
};

interface IconProps {
  name: string;
  className?: string;
  solid?: boolean;
}

export default function Icon({ name, className = '' }: IconProps) {
  const icon = iconMap[name];
  if (!icon) return <span className={`text-sm ${className}`}>•</span>;
  return (
    <FontAwesomeIcon
      icon={icon}
      className={`w-[14px] h-[14px] shrink-0 ${className}`}
    />
  );
}
