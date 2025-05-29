import styled from "styled-components";
import { useRouter } from "next/navigation";
import { colors, radius, shadows } from "@/styles/theme";

interface Permission {
  _id: string;
  business_id: string;
  expire: string;
  level: string;
  name: string;
}

interface BusinessCardProps {
  id: string;
  name: string;
  ownerId: string;
  permissions?: Permission[];
  onClick?: () => void;
}

const Card = styled.div`
  background: ${colors.background.main};
  border-radius: ${radius.lg};
  box-shadow: ${shadows.md};
  padding: 1.5rem;
  margin: 1rem;
  width: 300px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
  }
`;

const BusinessName = styled.h3`
  color: ${colors.text.primary};
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Label = styled.span`
  color: ${colors.text.secondary};
  width: 80px;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: ${colors.text.primary};
  flex-grow: 1;
`;

const PermissionsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.border.light};
`;

const PermissionItem = styled.div`
  background: ${colors.background.light};
  padding: 0.5rem;
  border-radius: ${radius.sm};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const PermissionName = styled.div`
  font-weight: 500;
  color: ${colors.text.primary};
  margin-bottom: 0.25rem;
`;

const PermissionDetails = styled.div`
  color: ${colors.text.secondary};
  font-size: 0.8rem;
`;

export default function BusinessCard({
  id,
  name,
  ownerId,
  permissions = [],
  onClick,
}: BusinessCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/admin/${id}`);
    }
  };

  return (
    <Card onClick={handleClick}>
      <BusinessName>{name}</BusinessName>
      <InfoRow>
        <Label>ID:</Label>
        <Value>{id}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Owner ID:</Label>
        <Value>{ownerId}</Value>
      </InfoRow>
      <PermissionsSection>
        <Label>Permissions:</Label>
        {permissions.length > 0 ? (
          permissions.map((permission) => (
            <PermissionItem key={permission._id}>
              <PermissionName>{permission.name}</PermissionName>
              <PermissionDetails>
                Level: {permission.level} | Expire: {permission.expire}
              </PermissionDetails>
            </PermissionItem>
          ))
        ) : (
          <PermissionDetails>No permissions found</PermissionDetails>
        )}
      </PermissionsSection>
    </Card>
  );
}
