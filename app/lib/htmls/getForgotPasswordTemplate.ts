export const getForgotPasswordEmailTemplate = (token: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header img {
      width: 100px;
    }
    .content {
      line-height: 1.6;
    }
    .token {
      display: block;
      margin: 20px 0;
      padding: 10px;
      background-color: #e7f3fe;
      border: 1px solid #b3d4fc;
      border-radius: 4px;
      font-family: monospace;
      text-align: center;
      font-size: 18px;
      color: #333;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>You requested to reset your password. Please use the following token to reset your password:</p>
      <span class="token">${token}</span>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <p>Thank you!</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;