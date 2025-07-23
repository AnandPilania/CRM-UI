import { ObjectDetail } from "@/components/objects/object-detail";
import { FieldForm } from "@/components/objects/field-form";
import { RelationshipForm } from "@/components/objects/relationship-form";
import { useParams, useLocation } from "react-router-dom";

export default function ObjectDetailPage() {
  const { objectId, fieldId, relationshipId } = useParams<{
    objectId: string;
    fieldId: string;
    relationshipId: string;
  }>();
  const location = useLocation();

  // Determine which component to render based on URL path
  const renderContent = () => {
    if (location.pathname.includes('/fields/new/')) {
      return <FieldForm objectId={objectId} />;
    } else if (location.pathname.includes('/fields/edit/')) {
      return <FieldForm objectId={objectId} fieldId={fieldId} isEdit={true} />;
    } else if (location.pathname.includes('/relationships/new/')) {
      return <RelationshipForm objectId={objectId} />;
    } else if (location.pathname.includes('/relationships/edit/')) {
      return <RelationshipForm objectId={objectId} relationshipId={relationshipId} isEdit={true} />;
    } else {
      return <ObjectDetail objectId={objectId} />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}
