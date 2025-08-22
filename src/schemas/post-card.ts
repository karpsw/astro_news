export type PostCardItem = LinkTitleType & {
  readCount?: number;
  readingTime?: Date;
  metki?: Metka[];
  tags?: LinkTitleType[];
  category?: LinkTitleType;
  lid?: string;
  img?: ImgType;
};

type ImgType = {
  alt?: string;
  url: string;
};

type LinkTitleType = {
  title: string;
  url: string;
};

export type Metka =
  | 'polezno'
  | 'foto'
  | 'video'
  | 'obnovleno'
  | 'official'
  | 'nonofficial'
  | 'urgent'
  | 'analytic'
  | 'opinion'
  | 'puzzle'
  | 'partner';
