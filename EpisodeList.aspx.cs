using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AmosBatista.ComicsServer.Core.Data.Repository;
using AmosBatista.ComicsServer.Core;
using Newtonsoft.Json;

namespace AmosBatista.ComicServer.WebServer
{
    public partial class EpisodeList : System.Web.UI.Page
    {
        // Function that will return the JSON-format of all episode list
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Expires = -1;

            // Loading the episode from repository
            EpisodeRepository epsRepository = new EpisodeRepository();
            var episodeList = epsRepository.AllEpisodeList();

            Response.Clear();
            Response.ContentType = "application/json; charset=utf-8";

            Response.Write(JsonConvert.SerializeObject(episodeList));
            Response.End();
        }
    }
}