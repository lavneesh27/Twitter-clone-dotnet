export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  dob?: string;
  email: string;
  password: string;
  userName: string;
  image?:any;
  banner?:any;
  bio?:string;
  recentMessage?:string;
  recentMessageTime?:string;
  location?:string;
  website?:string;
  createdAt?:string;
  followers:any;
  following:any;
  defaultPrimaryColor?: string;
  darkMode?: boolean;
}

export const colors: any[] = [
  { "color": "#1D9BF0", "secColor": "#3096DB" },
  { "color": "#FFD500", "secColor": "#C6A800" },
  { "color": "#F91A82", "secColor": "#C11664" },
  { "color": "#7857FF", "secColor": "#5F46CC" },
  { "color": "#FF7A00", "secColor": "#CC6200" },
  { "color": "#00B87A", "secColor": "#009264" }
]



