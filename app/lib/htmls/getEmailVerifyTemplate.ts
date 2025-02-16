import {getLocale, getTranslations} from "next-intl/server";

export async function getEmailVerifyTemplate(token: string, username: string) {
  const locale = await getLocale();
  const domain = process.env.NEXT_PUBLIC_SITE_URL;
  const siteName = process.env.NEXT_PUBLIC_PROJECT_NAME;
  const t = await getTranslations({namespace: "htmlTemplates.emailVerification", locale})

  if (!domain) {
    throw new Error("NEXT_PUBLIC_SITE_URL env variable not found.")
  }

  if (!siteName) {
    throw new Error("NEXT_PUBLIC_PROJECT_NAME env variable not found.")
  }

  const link = `${domain}/${locale}/auth/verify-email?token=${token}`;

  return `
  <!DOCTYPE html>
<html lang="${locale}" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${t('title')}</title>
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f6f7fb;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding:20px 0;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" role="presentation">
                <tr>
                <td width="600">
                <![endif]-->
                <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;" cellpadding="24">
                    <!-- Header -->
                    <!--
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                            <img src="[Your-Logo-URL]" alt="${siteName}" width="120" style="display:block;height:auto;">
                        </td>
                    </tr>
                    -->
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding:24px;">
                        <h1 style="color:#1f2937;font-size:24px;margin:0 0 16px;text-align:center;">
                          ${t('title')}
                        </h1>
                        <p style="color:#4b5563;font-size:16px;line-height:24px;margin:0 0 24px;text-align:center;">
                          ${t('greeting')} <b>${username}</b>,
                          <br>
                          ${t('instructions', { brandName: siteName })}
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="text-align:center;margin:32px 0;">
                          <a href="${link}" 
                             style="background-color:#3b82f6;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;display:inline-block;">
                            ${t('cta')}
                          </a>
                        </div>
                        
                        <p style="color:#6b7280;font-size:14px;line-height:20px;text-align:center;margin:0;">
                          ${t('note')}
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding:24px;background:#f3f4f6;border-radius:0 0 8px 8px;">
                            <p style="color:#6b7280;font-size:12px;line-height:18px;text-align:center;margin:0;">
                                © ${new Date().getFullYear()} ${siteName}<br>
                            </p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html>

      `
}