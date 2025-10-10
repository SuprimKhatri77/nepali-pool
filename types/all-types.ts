import {
  ChatsSelectType,
  MentorProfileSelectType,
  PreferredTimeSelectType,
  StudentProfileSelectType,
  UserSelectType,
  VideoCallSelectType,
} from "../lib/db/schema";

export type VideoCallWithStudentAndMentor = VideoCallSelectType & {
  studentProfile: StudentProfileSelectType & { user: UserSelectType };
  mentorProfile: MentorProfileSelectType & { user: UserSelectType };
  preferredTime: PreferredTimeSelectType;
};

export type MentorProfileWithUser = MentorProfileSelectType & {
  user: UserSelectType;
};

export type StudentProfileWithUser = StudentProfileSelectType & {
  user: UserSelectType;
  videoCall: (VideoCallSelectType & {
    preferredTime: PreferredTimeSelectType;
  })[];
};

export type StudentOnboardingFormType = {
  className?: string;
  currentUserId: string;
};

export interface PaymentButtonProps {
  paymentType: "chat_subscription" | "video_call";
  userId: string;
  mentorId: string;
  userEmail: string;
  children: React.ReactNode;
  className?: string;
}

export type MentorOnboardingFormProps = {
  className?: string;
  currentUserId?: string;
};

export interface MultiSelectCountriesProps {
  countries: string[];
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  placeholder?: string;
  className?: string;
}

export interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface ClickableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export type AddSchoolType = {
  className?: string;
  currentUserId: string;
};

export type MentorProfileWithUserAndChat = MentorProfileSelectType & {
  user: UserSelectType;
  chats: ChatsSelectType[];
};
