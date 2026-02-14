import type { LinkItemType } from '@workspace/components/sheard';
import {
  GlobeIcon,
  StackIcon,
  UserPlusIcon,
  ChartBarIcon,
  PlugIcon,
  CodeIcon,
  UsersIcon,
  StarIcon,
  HandshakeIcon,
  FileTextIcon,
  ShieldIcon,
  ArrowCounterClockwiseIcon,
  LeafIcon,
  QuestionIcon,
} from '@phosphor-icons/react';

export const productLinks: LinkItemType[] = [
  {
    label: 'Website Builder',
    href: '#',
    description: 'Create responsive websites with ease',
    icon: <GlobeIcon />,
  },
  {
    label: 'Cloud Platform',
    href: '#',
    description: 'Deploy and scale apps in the cloud',
    icon: <StackIcon />,
  },
  {
    label: 'Team Collaboration',
    href: '#',
    description: 'Tools to help your teams work better together',
    icon: <UserPlusIcon />,
  },
  {
    label: 'Analytics',
    href: '#',
    description: 'Track and analyze your website traffic',
    icon: <ChartBarIcon />,
  },
  {
    label: 'Integrations',
    href: '#',
    description: 'Connect your apps and services',
    icon: <PlugIcon />,
  },
  {
    label: 'API',
    href: '#',
    description: 'Build custom integrations with our API',
    icon: <CodeIcon />,
  },
];

export const companyLinks: LinkItemType[] = [
  {
    label: 'About Us',
    href: '#',
    description: 'Learn more about our story and team',
    icon: <UsersIcon />,
  },
  {
    label: 'Customer Stories',
    href: '#',
    description: "See how we've helped our clients succeed",
    icon: <StarIcon />,
  },
  {
    label: 'Partnerships',
    href: '#',
    icon: <HandshakeIcon />,
    description: 'Collaborate with us for mutual growth',
  },
];

export const companyLinks2: LinkItemType[] = [
  {
    label: 'Terms of Service',
    href: '#',
    icon: <FileTextIcon />,
  },
  {
    label: 'Privacy Policy',
    href: '#',
    icon: <ShieldIcon />,
  },
  {
    label: 'Refund Policy',
    href: '#',
    icon: <ArrowCounterClockwiseIcon />,
  },
  {
    label: 'Blog',
    href: '#',
    icon: <LeafIcon />,
  },
  {
    label: 'Help Center',
    href: '#',
    icon: <QuestionIcon />,
  },
];
