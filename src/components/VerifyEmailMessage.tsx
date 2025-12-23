import Head from "next/head";

interface EmailVerificationProps {
  url: string;
  name?: string;
}

export const EmailVerification = ({ url, name }: EmailVerificationProps) => {
  console.log("sending email via resend")
  console.log("url: ",url)
  console.log("name: ", name)
  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: "#f4f4f5",
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#f4f4f5", padding: "40px 20px" }}
        >
          <tr>
            <td align="center">
              <table
                width={600}
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      padding: "40px 40px 30px 40px",
                      textAlign: "center",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        color: "#111827",
                        fontSize: "24px",
                        fontWeight: 600,
                      }}
                    >
                      Verify Your Email Address
                    </h1>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "40px" }}>
                    {name && (
                      <p
                        style={{
                          margin: "0 0 20px 0",
                          color: "#374151",
                          fontSize: "16px",
                          lineHeight: "24px",
                        }}
                      >
                        Hi {name},
                      </p>
                    )}

                    <p
                      style={{
                        margin: "0 0 20px 0",
                        color: "#374151",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      Thank you for signing up! Please verify your email address
                      by clicking the button below.
                    </p>

                    <p
                      style={{
                        margin: "0 0 30px 0",
                        color: "#374151",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      This link will expire in 1 hours.
                    </p>

                    {/* Button */}
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td align="center">
                          <a
                            href={url}
                            style={{
                              display: "inline-block",
                              padding: "14px 32px",
                              backgroundColor: "#2563eb",
                              color: "#ffffff",
                              textDecoration: "none",
                              borderRadius: "6px",
                              fontSize: "16px",
                              fontWeight: 500,
                            }}
                          >
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style={{
                        margin: "30px 0 0 0",
                        color: "#6b7280",
                        fontSize: "14px",
                        lineHeight: "20px",
                      }}
                    >
                      If the button doesn&apos;t work, copy and paste this link
                      into your browser:
                    </p>
                    <p
                      style={{
                        margin: "10px 0 0 0",
                        color: "#2563eb",
                        fontSize: "14px",
                        wordBreak: "break-all",
                      }}
                    >
                      {url}
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: "30px 40px",
                      backgroundColor: "#f9fafb",
                      borderTop: "1px solid #e5e7eb",
                      borderRadius: "0 0 8px 8px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "14px",
                        lineHeight: "20px",
                        textAlign: "center",
                      }}
                    >
                      If you didn&apos;t create an account, you can safely
                      ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};
