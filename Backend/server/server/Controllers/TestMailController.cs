using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestMailController : ControllerBase
    {
        [HttpPost]
        public IActionResult SendMail(string content)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("quandhte@gmail.com"));
            email.To.Add(MailboxAddress.Parse("dohongquantc@gmail.com"));
            email.Subject = "test send mail in asp.net core";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = content};

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com",587,MailKit.Security.SecureSocketOptions.StartTls);
            smtp.Authenticate("quandhte@gmail.com", "xyctugdhiansiaar");
            smtp.Send(email);
            smtp.Disconnect(true);


            return Ok();

        }
    }
}
