export type EtLawsChunk = {
  partNumber: number;
  partTitle: string;
  sectionNumber: number;
  sectionTitle: string;
  content: string;
  subsections: EtLawsSubsection[];
};

export type EtLawsSubsection = {
  subsectionNumber: number | string;
  subsectionContent: string;
  subsections: EtLawsSubsection[];
};
