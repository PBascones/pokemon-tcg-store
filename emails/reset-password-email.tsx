import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ResetPasswordEmailProps {
  userName?: string
  resetLink: string
}

export const ResetPasswordEmail = ({
  userName = 'Usuario',
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Restablecé tu contraseña en Poke Addiction</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Restablecer contraseña</Heading>
          
          <Text style={text}>
            Hola {userName},
          </Text>
          
          <Text style={text}>
            Recibimos una solicitud para restablecer la contraseña de tu cuenta en Poke Addiction.
            Si no solicitaste este cambio, podés ignorar este correo de forma segura.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Restablecer contraseña
            </Button>
          </Section>

          <Text style={text}>
            O copiá y pegá este enlace en tu navegador:
          </Text>
          
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>

          <Text style={footer}>
            Este enlace expira en 1 hora por razones de seguridad.
          </Text>

          <Text style={footer}>
            Si tenés alguna pregunta, contactanos por WhatsApp.
          </Text>

          <Text style={footer}>
            Saludos,
            <br />
            El equipo de Poke Addiction
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPasswordEmail

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
}

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '0 auto',
  maxWidth: '280px',
}

const link = {
  color: '#2563eb',
  fontSize: '14px',
  textDecoration: 'underline',
  padding: '0 40px',
  display: 'block',
  wordBreak: 'break-all' as const,
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 40px',
  marginTop: '24px',
}

