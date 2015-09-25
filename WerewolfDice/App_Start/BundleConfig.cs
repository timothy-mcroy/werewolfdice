using System.Web;
using System.Web.Optimization;

namespace WerewolfDice
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/metro.js",
                      "~/Scripts/respond.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/dice").Include(
                      "~/Scripts/dice.js",
                      "~/Scripts/hideseek.js"
                      ));

            bundles.Add(new StyleBundle("~/Content/dice").Include(
                "~/Content/dice.css"));
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/metro.css",
                      "~/Content/metro-icons.css",
                      "~/Content/metro-responsive.css",
                      "~/Content/site.css"));
        }
    }
}
