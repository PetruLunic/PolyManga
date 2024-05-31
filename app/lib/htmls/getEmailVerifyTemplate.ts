export function getEmailVerifyTemplate(token: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
  <style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    margin: 0;
    padding: 0;
  }
.container {
    width: 100%;
    max-width: 600px;
    margin: 50px auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
.header {
    background-color: #007bff;
    color: #fff;
    padding: 20px;
    text-align: center;
  }
.content {
    padding: 20px;
  }
.token-box {
    background-color: #f4f4f9;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: monospace;
    word-break: break-all;
    margin-top: 20px;
  }
.footer {
    background-color: #f4f4f9;
    color: #888;
    text-align: center;
    padding: 20px;
    font-size: 12px;
  }
  </style>
  </head>
  <body>
  <div class="container">
  <div class="header">
      <h1>Verify Your Email</h1>
  </div>
  <div class="content">
      <p>Hello,</p>
  <p>Thank you for signing up. Please copy the token below to verify your email address and complete your registration.</p>
  <div class="token-box">${token}</div>
  <p>If you did not sign up for this account, you can ignore this email.</p>
  </div>
  <div class="footer">
      <p>&copy; 2024 Poli Manga. All rights reserved.</p>
  </div>
  </div>
  </body>
  </html>
      `
}