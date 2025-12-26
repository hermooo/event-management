import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InviteUserEmailProps {
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  inviteLink?: string;
}

export const InviteUserEmail = ({
  invitedByUsername = "Admin",
  invitedByEmail = "admin@example.com",
  teamName = "Event Management SaaS",
  inviteLink = "https://example.com/setup-password",
}: InviteUserEmailProps) => {
  const previewText = `Join ${teamName} on Evently`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ marginTop: "32px" }}>
            <Text style={h1}>Join {teamName}</Text>
          </Section>
          <Text style={text}>Hello,</Text>
          <Text style={text}>
            <strong>{invitedByUsername}</strong> (
            <a href={`mailto:${invitedByEmail}`} style={link}>
              {invitedByEmail}
            </a>
            ) has invited you to join the <strong>{teamName}</strong> team on{" "}
            <strong>Evently</strong>.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={inviteLink}>
              Setup Your Password
            </Button>
          </Section>
          <Text style={text}>
            or copy and paste this URL into your browser:{" "}
            <a href={inviteLink} style={link}>
              {inviteLink}
            </a>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This invitation was intended for you. If you were not expecting this invitation, you can
            ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InviteUserEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0",
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  marginBottom: "20px",
};

const link = {
  color: "#2754C5",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
