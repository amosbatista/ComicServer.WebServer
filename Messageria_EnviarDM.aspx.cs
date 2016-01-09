using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AmosBatista.MensagemSecreta.App;
using System.Text;
using System.Collections;

namespace AmosBatista.ComicServer.WebServer
{
    public partial class Messageria_EnviarDM : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            Response.Expires = -1;

      
            //var userProcessedInternalList = new SortedList<string, string>();
            var errorMessage = new StringBuilder();

            // Validating the information sent
            if (Request["userList"] == null)
                errorMessage.AppendLine("Não foi informado nenhuma conta do Twitter para enviar a mensagem. Por favor, informe um usuário ou uma lista de usuários válidos. ");
            else
            {
                if (Request["userList"].Trim() == "")
                    errorMessage.AppendLine("O campo de usuários do Twitter está em branco.  Por favor, informe um usuário ou uma lista de usuários válidos. ");
            }
            if (Request["message"] == null)
                errorMessage.AppendLine("Nenhuma mensagem foi definida para envio. Favor informar uma mensagem. ");
            else
            {
                if (Request["message"].Trim() == "")
                    errorMessage.AppendLine("Nenhuma mensagem foi definida para envio. Favor informar uma mensagem. ");
            }
            
            // Informing the error message
            if (errorMessage.Length > 0)
            {
                lblStatusMessage.Text = errorMessage.ToString();
            }
            else
            {
                lblStatusMessage.Text = "A requisição foi efetuada.";

                // Reading the user list and preparing the list
                string[] userList = Request["userList"].Split(",".ToCharArray());

                // For each user in the list
                var twitterMessageAPP = new TwitterAPI();
                string twitterAPPResponse;
                var strUserList = new StringBuilder();

                lblProcessedUserList.Text = "Verifique abaixo os usuários que foram processados, e a mensagem de seu status:";


                for (int userCont = 0; (userCont < userList.Length) || (userList.Length == 1); userCont++)
                {
                    try
                    {
                        // Call the app and send the message
                        twitterAPPResponse = twitterMessageAPP.SendTwitterDirectMessage(userList[userCont], Request["message"]);
                        strUserList.Append(userList[userCont] + " - " + twitterAPPResponse + ";");
                        
                    }
                    catch (Exception ex)
                    {
                        strUserList.Append("Ocorreu a seguinte falha ao executar requisições e ela foi interrompida: " + ex.Message);
                        break;
                    }
                }

                // Showing the result
                userProcessedList.Text = strUserList.ToString();

            }
        }
    }
}