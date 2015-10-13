using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AmosBatista.ComicsServer.Core;

// URL Example: http://localhost:3472/CarregarEpisodio.aspx?episodeNumber=1&idiom=en
namespace AmosBatista.ComicServer.WebServer
{
    public partial class CarregarEpisodio : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Expires = -1;
            if (Request["episodeNumber"] != null)
            {
                ParametrosPesquisaEpisodio parametros = new ParametrosPesquisaEpisodio();
                parametros.NovoParametro("NUMEROEPISODIO", Request["episodeNumber"]);
                parametros.NovoParametro("IDIOMA", Request["idiom"]);
                IEpisode NovoEpisode = new Episode();
                IEpisodeRepository epsRep = new EpisodeRepositoryToSQLServer();
                NovoEpisode = epsRep.Buscar(parametros);

                Response.Clear();
                Response.ContentType = "application/json; charset=utf-8";
                Response.Write(NovoEpisode.EpisodeContent.ToJSONString());
                Response.End();
            }
            else
            {
                Response.Write("Page is loaded. Please, execute using the comics Page.");
            }
        }
    }
}