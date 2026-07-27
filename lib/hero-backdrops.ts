export interface HeroBackdrop {
  id: string;
  imageSrc: string;
  credit: string;
  sourceHref: string;
  objectPosition: string;
}

export const heroBackdrops: HeroBackdrop[] = [
  {
    id: "digital-brain",
    imageSrc: "/images/hero-backdrops/digital-brain-deepmind.jpg",
    credit: "Google DeepMind",
    sourceHref:
      "https://unsplash.com/photos/a-computer-generated-image-of-a-human-brain-Sqg9QWERMDU",
    objectPosition: "50% 50%",
  },
  {
    id: "neural-connections",
    imageSrc: "/images/hero-backdrops/neural-connections-virus.jpg",
    credit: "notorious v1ruS",
    sourceHref:
      "https://unsplash.com/photos/a-computer-generated-image-of-a-human-brain-gRWPsHqsFZ4",
    objectPosition: "50% 46%",
  },
  {
    id: "brain-interface",
    imageSrc: "/images/hero-backdrops/brain-interface-patel.jpg",
    credit: "Bhautik Patel",
    sourceHref:
      "https://unsplash.com/photos/a-computer-generated-image-of-a-brain-surrounded-by-wires-CFSJUUb_Q-Y",
    objectPosition: "52% 50%",
  },
];
