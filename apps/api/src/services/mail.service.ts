import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Zero Bit Studio brand ──────────────────────────────────────────────────────
// Every school site built on this template ships from Zero Bit Studio, so
// transactional emails (invites, password resets) carry that identity rather
// than the school's own accent colour — those are dashboard-internal mail,
// not public-facing site content, and should read the same across every
// deployment of this template.
const BRAND_NAME = "Zero Bit Studio";
const FROM = `${process.env.EMAIL_FROM_NAME || BRAND_NAME} <${process.env.SENDER_EMAIL || "noreply@phoque-orbit.co.za"}>`;

const C = {
  primary:     "#84CC16", // lime-500 — buttons, eyebrow, logo dot
  primaryDark: "#4D7C0F", // lime-700 — text that needs contrast on a light tint
  text:        "#0F172A", // slate-900 — headings, button label
  muted:       "#64748B", // slate-500 — body copy, secondary text
  border:      "#E2E8F0", // slate-200
  panel:       "#F8FAFC", // slate-50 — footer strip
  codeTint:    "#ECFCCB", // lime-100 — verification code background
};

function layout(opts: {
  eyebrow?: string;
  title:    string;
  body:     string;
  cta?:     { label: string; href: string };
  footer?:  string;
}) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#FFFFFF;border:1px solid ${C.border};border-radius:12px;overflow:hidden">
      <div style="padding:32px;text-align:center;border-bottom:1px solid ${C.border}">
        <h1 style="color:${C.text};margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px">
          Zero Bit<span style="color:${C.primary}">.</span>
        </h1>
        <p style="color:${C.muted};margin:8px 0 0;font-size:13px">Studio Platform</p>
      </div>
      <div style="padding:40px">
        ${opts.eyebrow ? `<p style="color:${C.primaryDark};margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em">${opts.eyebrow}</p>` : ""}
        <h2 style="color:${C.text};margin:0 0 16px;font-size:20px">${opts.title}</h2>
        <p style="color:${C.muted};margin:0 0 32px;line-height:1.6">${opts.body}</p>
        ${opts.cta ? `
        <div style="text-align:center;margin:0 0 32px">
          <a href="${opts.cta.href}" style="background:${C.primary};color:${C.text};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
            ${opts.cta.label} &rarr;
          </a>
        </div>` : ""}
        ${opts.footer ? `<p style="color:${C.muted};font-size:13px;margin:0;line-height:1.6">${opts.footer}</p>` : ""}
      </div>
      <div style="padding:20px 40px;border-top:1px solid ${C.border};text-align:center;background:${C.panel}">
        <p style="color:${C.muted};font-size:12px;margin:0">Powered by ${BRAND_NAME}</p>
      </div>
    </div>
  `;
}

async function send(payload: Parameters<typeof resend.emails.send>[0]) {
  const { data, error } = await resend.emails.send(payload);
  if (error) {
    console.error("❌ [MAIL] Resend error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
  console.log(`✅ [MAIL] Sent to ${Array.isArray(payload.to) ? payload.to.join(", ") : payload.to} (id: ${data?.id})`);
}

// ── Invite email ───────────────────────────────────────────────────────────────

export async function sendInviteEmail(
  to: string, inviteLink: string, name: string, schoolName?: string
) {
  const target = schoolName ? `${schoolName}'s dashboard` : "your school's dashboard";
  await send({
    from:    FROM,
    to,
    subject: schoolName
      ? `You've been invited to manage ${schoolName}`
      : "You've been invited to a Zero Bit Studio dashboard",
    html: layout({
      eyebrow: "You're invited",
      title:   `Hi ${name}, welcome aboard`,
      body:    `You've been given access to help manage ${target}, built on the Zero Bit Studio platform. Click below to set your password and activate your account.`,
      cta:     { label: "Accept Invitation", href: inviteLink },
      footer:  "This link expires in 7 days. If you weren't expecting this, you can safely ignore this email.",
    }),
  });
}

// ── Verification email ─────────────────────────────────────────────────────────

export async function sendVerificationEmail(
  to: string, verifyLink: string
) {
  await send({
    from:    FROM,
    to,
    subject: "Verify your email — Zero Bit Studio",
    html: layout({
      title:  "Verify your email",
      body:   "Click below to verify your email address and finish setting up your account.",
      cta:    { label: "Verify Email", href: verifyLink },
    }),
  });
}

// ── Password reset email ───────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  to: string, resetLink: string
) {
  await send({
    from:    FROM,
    to,
    subject: "Reset your password — Zero Bit Studio",
    html: layout({
      title:  "Reset your password",
      body:   "Click below to choose a new password. This link expires in 1 hour.",
      cta:    { label: "Reset Password", href: resetLink },
      footer: "If you didn't request this, you can safely ignore this email.",
    }),
  });
}

// ── Verification code email ────────────────────────────────────────────────────

export async function sendVerificationCodeEmail(
  to: string, code: string
) {
  await send({
    from:    FROM,
    to,
    subject: `${code} — Your Zero Bit Studio verification code`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#FFFFFF;border:1px solid ${C.border};border-radius:12px;overflow:hidden">
        <div style="padding:32px;text-align:center;border-bottom:1px solid ${C.border}">
          <h1 style="color:${C.text};margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px">
            Zero Bit<span style="color:${C.primary}">.</span>
          </h1>
          <p style="color:${C.muted};margin:8px 0 0;font-size:13px">Studio Platform</p>
        </div>
        <div style="padding:40px;text-align:center">
          <p style="color:${C.text};font-size:16px;margin:0 0 8px">Your verification code</p>
          <p style="color:${C.muted};font-size:14px;margin:0 0 32px">Expires in <strong style="color:${C.text}">15 minutes</strong></p>
          <div style="background:${C.codeTint};border:1px solid ${C.primary};padding:28px;border-radius:12px;margin:0 0 32px">
            <span style="font-size:48px;font-weight:900;letter-spacing:16px;color:${C.primaryDark}">${code}</span>
          </div>
          <p style="color:${C.muted};font-size:13px;margin:0">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}
