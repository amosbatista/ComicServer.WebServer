using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AmosBatista.ComicsServer.Core.Data.Repository;
using AmosBatista.ComicsServer.Core;
using Newtonsoft.Json;

// URL Example: http://localhost:3472/CarregarEpisodio.aspx?episodeNumber=1&idiom=en
namespace AmosBatista.ComicServer.WebServer
{
    public partial class CarregarEpisodio : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            /*Response.Expires = -1;
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
                // Caso retorne nulo, por causa de algum problemana pesquisa, retornar um JSON com um mapeamento apenas, com uma imagem de erro.
                if (NovoEpisode == null)
                {
                    string errorContent_PT = "{'prologue': '','pages': [{'path': 'img\\\\img_warning_pt.jpg','maps': [{'x': 0,'y': 0,'scale': 1,'transitionType': 'normal'}]}]}";
                    string errorContent_EN = "{'prologue': '','pages': [{'path': 'img\\\\img_warning_en.jpg','maps': [{'x': 0,'y': 0,'scale': 1,'transitionType': 'normal'}]}]}";
                    if (Request["idiom"] == "pt")
                        Response.Write(errorContent_PT.Replace("'","\""));
                    else
                        Response.Write(errorContent_EN.Replace("'","\""));

                }
                else
                    Response.Write(NovoEpisode.EpisodeContent.ToJSONString());

                Response.End();
            }
            else
            {
                Response.Write("Page is loaded. Please, execute using the comics Page.");
            }
        */

            Response.Expires = -1;
            if (Request["episodeNumber"] != null)
            {

                // Setting and configuring the parameters
                var episodeNumber = Int16.Parse(Request["episodeNumber"]);
                var idiom = Request["idiom"];

                // Loading the episode from repository
                EpisodeRepository epsRepository = new EpisodeRepository();
                var episode = epsRepository.Load(episodeNumber,idiom);

                // Sending the episode as a JSon format
                Response.Clear();
                Response.ContentType = "application/json; charset=utf-8";
                Response.Write(JsonConvert.SerializeObject(episode));
                Response.End();

            }
            else
            {
                Response.Write("Page is loaded. Please, execute using the comics Page.");
                Response.End();
            }
        }
    }
}