﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WerewolfDice.Controllers
{
    public class WorldOfDarknessController : Controller
    {
        // GET: WorldOfDarkness
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Character(string id)
        {
            return View("~/Views/WorldOfDarkness/index.cshtml",model:id);
        }
    }
}