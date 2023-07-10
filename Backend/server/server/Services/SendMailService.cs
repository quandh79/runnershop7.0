using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Threading.Tasks;

namespace server.Services
{
    public class SendMailService
    {
       MailSetting _mailSetting= new MailSetting();
       
        public SendMailService(IOptions<MailSetting> mailSetting) 
        { 
            _mailSetting = mailSetting.Value;
            

        }
        public async Task<string> SendMail(MailContent mailcontent)
        {
            var email = new MimeMessage();
            email.Sender = new MailboxAddress(_mailSetting.DisplayName, _mailSetting.Mail);
            email.From.Add(new MailboxAddress(_mailSetting.DisplayName, _mailSetting.Mail));
            email.To.Add(new MailboxAddress(mailcontent.To, mailcontent.To));
            email.Subject = mailcontent.Subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = mailcontent.Body;
            email.Body = builder.ToMessageBody();
            using var smtp = new MailKit.Net.Smtp.SmtpClient();


            try
            {
               await smtp.ConnectAsync(_mailSetting.Host, _mailSetting.Port, MailKit.Security.SecureSocketOptions.StartTls);
              await  smtp.AuthenticateAsync(_mailSetting.Mail, _mailSetting.Password);
              await  smtp.SendAsync(email);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return "Loi" + e.Message;
            }
            smtp.Disconnect(true);
            return "gui thanh cong";
        }
    }
}

public class MailContent
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}
