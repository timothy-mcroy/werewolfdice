using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WerewolfDice.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "This is the world of darkness die roller.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Send me hatemail";

            return View();
        }
    }
}