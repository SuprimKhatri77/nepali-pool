import Head from "next/head";

interface MeetingInviteProps {
  url: string;
  meetingTitle: string;
  date: string;
  time: string;
  duration?: string;
  hostName?: string;
  attendeeEmail: string;
}

export const MeetingInvite = ({
  url,
  meetingTitle,
  date,
  time,
  duration,
  hostName,
  attendeeEmail,
}: MeetingInviteProps) => {
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
                      You&apos;re Invited to a Meeting
                    </h1>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "40px" }}>
                    <p
                      style={{
                        margin: "0 0 30px 0",
                        color: "#374151",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      {hostName
                        ? `${hostName} has invited you to a meeting.`
                        : "You have been invited to a meeting."}
                    </p>

                    {/* Meeting Details Box */}
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        marginBottom: "30px",
                      }}
                    >
                      <tr>
                        <td style={{ padding: "24px" }}>
                          <h2
                            style={{
                              margin: "0 0 16px 0",
                              color: "#111827",
                              fontSize: "18px",
                              fontWeight: 600,
                            }}
                          >
                            {meetingTitle}
                          </h2>

                          <table width="100%" cellPadding="0" cellSpacing="0">
                            <tr>
                              <td style={{ padding: "8px 0" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "80px",
                                    color: "#6b7280",
                                    fontSize: "14px",
                                  }}
                                >
                                  📅 Date:
                                </span>
                                <span
                                  style={{
                                    color: "#111827",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {date}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: "8px 0" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "80px",
                                    color: "#6b7280",
                                    fontSize: "14px",
                                  }}
                                >
                                  🕐 Time:
                                </span>
                                <span
                                  style={{
                                    color: "#111827",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {time}
                                </span>
                              </td>
                            </tr>
                            {duration && (
                              <tr>
                                <td style={{ padding: "8px 0" }}>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "80px",
                                      color: "#6b7280",
                                      fontSize: "14px",
                                    }}
                                  >
                                    ⏱️ Duration:
                                  </span>
                                  <span
                                    style={{
                                      color: "#111827",
                                      fontSize: "14px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {duration}
                                  </span>
                                </td>
                              </tr>
                            )}
                          </table>
                        </td>
                      </tr>
                    </table>

                    {/* Button */}
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td align="center">
                          <a
                            href={url}
                            style={{
                              display: "inline-block",
                              padding: "14px 32px",
                              backgroundColor: "#059669",
                              color: "#ffffff",
                              textDecoration: "none",
                              borderRadius: "6px",
                              fontSize: "16px",
                              fontWeight: 500,
                            }}
                          >
                            Join Meeting
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
                      Or copy and paste this link into your browser:
                    </p>
                    <p
                      style={{
                        margin: "10px 0 0 0",
                        color: "#059669",
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
                      This meeting invitation was sent to {attendeeEmail}
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
