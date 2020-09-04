using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using ExploreNowWebapplicationAPI.Models;
using System.Net.Mail;
using System.Text;
using System.Net;

namespace ExploreNowWebapplicationAPI.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
        //[HttpPost] // Kraschar sidan
        // Fungerar ej, händer ingenting vis skicka av meddelande.

        // Validering fungerar ej: ~/Scripts/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js
        // Validering fungerar ej: ~/Scripts/jquery-validation/dist/jquery.validate.min.js
        // Felmeddelande i konsol vid körning: "jQuery is not defined"
        // Går ej in i debugg efter "skicka"
        // Kryptering ej testad
        // Källa: https://www.codeproject.com/Tips/1081578/How-to-Implement-Contact-Us-Page-in-ASP-NET-MVC-AS
        public ActionResult ContactUs(ContactViewModel vm)
        {
            // Kontaktformulär
            if (ModelState.IsValid)
            {
                try
                {
                    // Krypterat lösenord
                    string encryptedPassword;
                    encryptedPassword = "LÖSENORD HÄR"; // Lägg till lösenord
                    Decrypt dectypt = new Decrypt();
                    // Avkrypterar lösenordet
                    dectypt.ROT13(encryptedPassword);

                    MailMessage msz = new MailMessage();
                    msz.From = new MailAddress(vm.Email);
                    // E-postadress till mottagare
                    msz.To.Add("jk95@live.se");
                    msz.Subject = vm.Subject;
                    msz.Body = vm.Message;
                    SmtpClient smtp = new SmtpClient();

                    // SMTP-adress
                    smtp.Host = "smtp-mail.outlook.com";
                    // Port
                    smtp.Port = 587;

                    //E-postadress och lösenord för avsändare
                    smtp.Credentials = new System.Net.NetworkCredential("jk95@live.se", encryptedPassword);

                    smtp.EnableSsl = true;

                    smtp.Send(msz);

                    ModelState.Clear();
                    ViewBag.Message = "Tack för att du kontaktade oss! ";
                }
                catch (Exception ex)
                {
                    ModelState.Clear();
                    ViewBag.Message = $" Vi har lite problem för tillfället: {ex.Message}";
                }
            }
            return View();
        }
        public ActionResult Error()
        {
            return View();
        }
    }
}
