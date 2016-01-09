using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AmosBatista.ComicsServer.Core.Data.Repository;
using AmosBatista.ComicsServer.Core.Data.Context;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

// URL Example: http://localhost:3472/SalvarEpisodio.aspx?episodeNumber=1&idiom=en&jsonContent=JsonTest

namespace AmosBatista.ComicServer.WebServer
{
    public partial class SalvarEpisodio : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            /*if (Request.Form["episodeNumber"] != null)
            {
                //int episodeNumber, string idiom, string jsonContent
                string episodeNumber = Request.Form["episodeNumber"];
                string idiom = Request.Form["idiom"];
                string jsonContent = Request.Form["jsonContent"];

                IEpisode episode = new Episode();
                BasicStyleEpisodeContent episodeContent = new BasicStyleEpisodeContent();
                episodeContent.JSONEpisode = jsonContent;
                episode.EpisodeContent = episodeContent;
                episode.EpisodeNumber = Int32.Parse( episodeNumber);
                episode.Idiom = idiom;
                IEpisodeRepository epsRep = new EpisodeRepositoryToSQLServer();
                epsRep.Salvar(episode);
                Response.Write("Episodio Salvo");
                Response.End();
            }
            else
            {
                Response.Write("Page is loaded. Please, execute using the comics Page.");
            }*/
            Response.Expires = -1;
            if (Request.Form["episode"] != null)
            {
                // Reading the episode sent by the page, as a JSON string
                string episode_JsonFormat = Request.Form["episode"];
                
                // Converting from JSON to object
                Episode episode = JsonConvert.DeserializeObject<Episode>(episode_JsonFormat);

                // Saving the episode to the repository
                EpisodeRepository epsRepository = new EpisodeRepository();
                epsRepository.Save(episode);

                Response.Write("Episodio Salvo!");
                Response.End();
            }
            else
            {
                // Generate response, when no episode has been sent
                Response.Write("Page is loaded. Please, execute using the comics Page.");
                Response.End();
            }

        }
    }
}