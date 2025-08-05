const emailTemplate = (name,email, password) => {
  return `
    <div style="font-family:sans-serif;">
      <h2>Hello ${name},</h2>
      <p>Your email is: ${email}</p>
      <h1 style="color:#3498db">Your Password is: ${password}</h1>
      <p>Thank you</p>
      <br />
      <p>Thanks,<br/>Team KDS</p>
    </div>
  `;
};

module.exports = emailTemplate;
