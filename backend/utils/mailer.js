const nodemailer = require('nodemailer');

// Dev fallback: if SMTP isn't configured, just log to console instead of failing.
const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

let transporter = null;
if (hasSmtp) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendBudgetAlert(toEmail, name, percent, spent, budget) {
  const subject = `TokenTrack: ${percent}% of monthly budget used`;
  const text = `Hi ${name},\n\nYou've used ${percent}% of your $${budget} monthly AI budget ($${spent.toFixed(2)} spent).\n\n— TokenTrack`;

  if (!transporter) {
    console.log(`📧 [DEV MODE — no SMTP configured] Would send email to ${toEmail}:\n${subject}\n${text}\n`);
    return { simulated: true };
  }

  await transporter.sendMail({
    from: `"TokenTrack" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject,
    text,
  });
  return { simulated: false };
}

module.exports = { sendBudgetAlert };
