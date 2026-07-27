export interface ResearchPortal {
  id: string;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceHref: string;
  statusLabel: string;
  objectPosition?: string;
}

export const representativeImageDisclosure =
  "Representative EEG setup shown for visual context. Stock image; not a participant or recording from the Dreyer dataset.";

export const researchPortals = [
  {
    id: "methodology",
    title: "Methodology",
    description: "Explore the documented acquisition and cleaning protocol.",
    href: "/methodology",
    imageSrc: "/images/research-portals/eeg-methodology-portal.jpg",
    imageAlt:
      "Profile of a person wearing a non-invasive EEG headband while a technician adjusts the device",
    imageCredit: "Михаил Крамор · Pexels",
    imageSourceHref:
      "https://www.pexels.com/photo/man-wearing-headband-for-head-examination-12197315/",
    statusLabel: "Protocol documented",
    objectPosition: "50% 50%",
  },
  {
    id: "results",
    title: "Results",
    description: "Review the planned evidence and publication requirements.",
    href: "/results",
    imageSrc: "/images/research-portals/brain-signal-results-portal.jpg",
    imageAlt:
      "Person wearing a non-invasive EEG headband while concentrating at a computer",
    imageCredit: "Михаил Крамор · Pexels",
    imageSourceHref:
      "https://www.pexels.com/photo/young-woman-in-electronic-headband-12197297/",
    statusLabel: "Awaiting verified analysis",
    objectPosition: "55% 50%",
  },
  {
    id: "research-background",
    title: "Research background",
    description: "Understand the research question and documented dataset.",
    href: "/#background",
    imageSrc: "/images/research-portals/bci-research-background.jpg",
    imageAlt:
      "Person using a tablet while wearing a non-invasive neurofeedback headband",
    imageCredit: "Mindfield Biosystems Ltd. · Pexels",
    imageSourceHref:
      "https://www.pexels.com/photo/man-sitting-in-armchair-and-using-eeg-biofeedback-24346269/",
    statusLabel: "Research question defined",
    objectPosition: "50% 38%",
  },
] satisfies ResearchPortal[];
