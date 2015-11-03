using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AmosBatista.ComicsServer.Core.StringRepository;

// URL Example: http://localhost:3472/Translation.aspx

namespace AmosBatista.ComicServer.WebServer
{
    public partial class Translation : System.Web.UI.Page
    {
        // This page will work to return all the caption of the text to the page, by JSON
        protected void Page_Load(object sender, EventArgs e)
        {
            var textRepository = new TextRepository_SQLToJSON(false);

            // Set the response time to JSON
            Response.Clear();
            Response.ContentType = "application/json;";

            // Sending all translation to the page
            Response.Write(textRepository.LoadTextRepository());
            Response.End();

        }
    }
}