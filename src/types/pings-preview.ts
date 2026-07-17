export interface PreviewUser {
  id: number;
  username: string;
  avatar: string;
  fullName: string;
}

export interface PreviewVideo {
  id: number;
  duration: number;
  width: number;
  height: number;
  image: string;
  url: string;
}

export interface PingsPreviewResponse {
  users: PreviewUser[];
  videos: PreviewVideo[];
}
