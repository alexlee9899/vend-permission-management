import styled from "styled-components";
import { useRouter } from "next/navigation";
import { colors, radius, shadows } from "@/styles/theme";
import { PermissionIcon, LevelIcon, ExpireIcon } from "@/components/icons";

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
  background: ${colors.background.light};
  border-radius: ${radius.xl};
  box-shadow: ${shadows.lg};
  padding: 2.2rem 2rem 2rem 2rem;
  margin: 1rem;
  width: 370px;
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1.5px solid ${colors.border.gradient};
  backdrop-filter: blur(6px) saturate(160%);
  -webkit-backdrop-filter: blur(6px) saturate(160%);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${colors.primary.gradient};
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: ${shadows.xl};
    border-color: ${colors.primary.light};
  }
`;

const BusinessName = styled.h3`
  color: ${colors.primary.main};
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
  position: relative;
  padding-bottom: 0.8rem;
  background: ${colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: ${colors.primary.gradient};
    border-radius: ${radius.round};
  }
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  font-size: 1rem;
  padding: 0.8rem;
  background: ${colors.background.light};
  border-radius: ${radius.md};
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.background.main};
    transform: translateX(5px);
  }
`;

const Label = styled.span`
  color: ${colors.text.secondary};
  width: 100px;
  flex-shrink: 0;
  font-weight: 600;
`;

const Value = styled.span`
  color: ${colors.text.primary};
  flex-grow: 1;
  font-weight: 500;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary.main};
  margin-right: 0.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PermissionsSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid ${colors.border.light};
`;

const PermissionItem = styled.div`
  background: ${colors.background.light};
  padding: 1rem;
  border-radius: ${radius.md};
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.primary.light};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const PermissionName = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const PermissionDetails = styled.div`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background: ${colors.primary.main};
    border-radius: 50%;
  }
`;

const NoPermissions = styled(PermissionDetails)`
  padding: 1rem;
  background: ${colors.background.light};
  border-radius: ${radius.md};
  text-align: center;
  font-style: italic;
  color: ${colors.text.secondary};
  opacity: 0.8;
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
      <InfoSection>
        <InfoRow>
          <Label>Business ID</Label>
          <Value>{id}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Owner ID</Label>
          <Value>{ownerId}</Value>
        </InfoRow>
      </InfoSection>
      <PermissionsSection>
        <Label>
          <IconWrapper>
            <PermissionIcon />
          </IconWrapper>
          Permissions
        </Label>
        {permissions.length > 0 ? (
          permissions.map((permission) => (
            <PermissionItem key={permission._id}>
              <PermissionName>{permission.name}</PermissionName>
              <PermissionDetails>
                <DetailItem>
                  <IconWrapper>
                    <LevelIcon />
                  </IconWrapper>
                  <Label>Level:</Label>
                  <Value>{permission.level}</Value>
                </DetailItem>
                <DetailItem>
                  <IconWrapper>
                    <ExpireIcon />
                  </IconWrapper>
                  <Label>Expire:</Label>
                  <Value>{permission.expire}</Value>
                </DetailItem>
              </PermissionDetails>
            </PermissionItem>
          ))
        ) : (
          <NoPermissions>No permissions found</NoPermissions>
        )}
      </PermissionsSection>
    </Card>
  );
}
