using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WerewolfDice.Startup))]
namespace WerewolfDice
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
