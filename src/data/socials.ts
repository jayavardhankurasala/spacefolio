export interface SocialLink {
  platform: string;
  url: string;
  username: string;
  icon?: string;
}

export const socials: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/jayavardhankurasala",
    username: "jayavardhankurasala"
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/jayavardhan-kurasala-2834b53ba",
    username: "jayavardhan-kurasala"
  },
  {
    platform: "Email",
    url: "mailto:jayavardhan.kurasala@gmail.com",
    username: "jayavardhan.kurasala@gmail.com"
  },
  {
    platform: "WhatsApp",
    url: "https://wa.me/917815902369?text=Hi%20Jayavardhan",
    username: "+91 7815902369"
  }
];

export const codingProfiles: SocialLink[] = [
  {
    platform: "LeetCode",
    url: "#",
    username: "jayavardhan"
  },
  {
    platform: "CodeChef",
    url: "#",
    username: "jayavardhan"
  },
  {
    platform: "GeeksforGeeks",
    url: "#",
    username: "jayavardhan"
  }
];
