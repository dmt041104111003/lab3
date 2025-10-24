import nodemailer from 'nodemailer'
import path from 'path'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Đặt lại mật khẩu - TechNova',
    attachments: [
      {
        filename: 'footer.png',
        path: path.join(process.cwd(), 'public', 'footer.png'),
        cid: 'logo'
      }
    ],
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header với logo -->
        <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
          <img src="cid:logo" alt="TechNova" style="height: 60px; width: auto; margin-bottom: 10px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">TechNova</h1>
          <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px;">Công nghệ & Đời sống</p>
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 40px; height: 40px; color: #0ea5e9;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">Đặt lại mật khẩu</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
            </p>
          </div>
          
          <!-- Reset button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.3); transition: all 0.3s ease;">
              Đặt lại mật khẩu
            </a>
          </div>
          
          <!-- Alternative link -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
              Nếu nút không hoạt động, copy link này vào trình duyệt:
            </p>
            <p style="color: #2563eb; font-size: 13px; word-break: break-all; background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 0; font-family: 'Courier New', monospace;">
              ${resetUrl}
            </p>
          </div>
          
          <!-- Security notice -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 30px 0; border-radius: 0 6px 6px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <svg style="width: 20px; height: 20px; color: #f59e0b; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span style="color: #92400e; font-weight: 600; font-size: 14px;">Lưu ý bảo mật</span>
            </div>
            <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
              Link này sẽ hết hạn sau <strong>1 giờ</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 25px 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
            © 2024 TechNova. Tất cả quyền được bảo lưu.
          </p>
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            Email này được gửi tự động, vui lòng không trả lời.
          </p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}
