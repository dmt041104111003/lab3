import nodemailer from 'nodemailer'

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
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px; background-color: #f8f9fa;">
          <h1 style="color: #2563eb; margin: 0;">TechNova</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Công nghệ & Đời sống</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Đặt lại mật khẩu</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Đặt lại mật khẩu
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            Nếu nút không hoạt động, bạn có thể copy và paste link sau vào trình duyệt:
          </p>
          
          <p style="color: #2563eb; font-size: 14px; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2024 TechNova. Tất cả quyền được bảo lưu.</p>
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
