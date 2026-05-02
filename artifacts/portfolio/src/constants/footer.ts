import { FooterLink } from "../types";

const CONTACT_EMAIL = "contact@magdysaber.com";
const MAILTO_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Hello Magdy",
)}&body=${encodeURIComponent(
  "Hi Magdy,\n\nI came across your portfolio and wanted to reach out about ",
)}`;

export const FOOTER_LINKS: FooterLink[] = [
  {
    name: 'LinkedIn',
    hoverText: 'Connect with me',
    icon: 'icons/linkedin.svg',
    url: 'https://www.linkedin.com/in/magdy-saber',
  },
  {
    name: 'GitHub',
    hoverText: 'Open Sourcing',
    icon: 'icons/github.svg',
    url: 'https://github.com/iammagdy',
  },
  {
    name: 'Email me',
    hoverText: 'Send me an email',
    icon: 'icons/email.svg',
    url: MAILTO_URL,
  },
];
