import { ProfileDetail } from "@/components/security/profile-detail";
import { useParams } from "react-router-dom";

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();

  return (
    <div>
      <ProfileDetail profileId={profileId} />
    </div>
  );
}
