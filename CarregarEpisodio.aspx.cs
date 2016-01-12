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
            
            Response.Expires = -1;
            if (Request["episodeNumber"] != null)
            {

                // Setting and configuring the parameters
                var episodeNumber = Int16.Parse(Request["episodeNumber"]);
                var idiom = Request["idiom"];

                try
                {
                    // Loading the episode from repository
                    EpisodeRepository epsRepository = new EpisodeRepository();
                    var episode = epsRepository.Load(episodeNumber, idiom);

                    // Sending the episode as a JSon format
                    Response.Clear();
                    Response.ContentType = "application/json; charset=utf-8";

                    // Sending an error object
                    if (episode == null)
                    {
                        SendErrorMap();
                    }
                    else
                    {
                        Response.Write(JsonConvert.SerializeObject(episode));
                    }
                }
                catch (Exception exp)
                {
                    SendErrorMap();
                }
                finally
                {
                    Response.End();
                }
            }
            else
            {
                Response.Write("Page is loaded. Please, execute using the comics Page.");
                Response.End();
            }
        }

        // Function to send a error response
        private void SendErrorMap()
        {
            Response.Clear();
            Response.ContentType = "application/json; charset=utf-8";

            var errorContent_EN = "{'prologue': '','Pages': [{'Path': 'img\\\\img_warning_en.jpg','Maps': [{'X': 0,'Y': 0,'Scale': 1,'transitionType': 'normal'}]}]}";
            Response.Write(errorContent_EN.Replace("'", "\""));
            Response.End();
        }
    }
}