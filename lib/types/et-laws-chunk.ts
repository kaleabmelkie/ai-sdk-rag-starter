export type EtLawsChunk = {
  id: string;
  number: string;
  title: string;
  sections: EtLawsSection[];
};

export type EtLawsSection = {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections: EtLawsSubsection[];
};

export type EtLawsSubsection = {
  id: string;
  number: string;
  content: string;
  subsections: EtLawsSubsection[];
};
