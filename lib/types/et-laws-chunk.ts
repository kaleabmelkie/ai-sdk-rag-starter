export type EtLawsChunk = {
  partNumber: string;
  partTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  content: string;
  subsections: EtLawsSubsection[];
};

export type EtLawsSubsection = {
  subsectionNumber: string;
  subsectionContent: string;
  subsections: EtLawsSubsection[];
};
