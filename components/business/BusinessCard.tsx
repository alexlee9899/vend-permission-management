import styled from "styled-components";

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
}

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem;
  width: 300px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const BusinessName = styled.h3`
  color: #333;
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
  color: #666;
  width: 80px;
  flex-shrink: 0;
`;

const Value = styled.span`
  color: #333;
  flex-grow: 1;
`;

const PermissionsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const PermissionItem = styled.div`
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const PermissionName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const PermissionDetails = styled.div`
  color: #666;
  font-size: 0.8rem;
`;

export default function BusinessCard({
  id,
  name,
  ownerId,
  permissions = [],
}: BusinessCardProps) {
  return (
    <Card>
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
