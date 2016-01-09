<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Messageria_EnviarDM.aspx.cs" Inherits="AmosBatista.ComicServer.WebServer.Messageria_EnviarDM" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    
    <div class="statusMessage">
        <p>Resultado do processamento:</p>
        <asp:Label ID="lblStatusMessage" runat="server">
        </asp:Label>
    </div>
    <div class="userList">
    <form id="ShowForm" runat="server">
        <p>
            <asp:Label ID="lblProcessedUserList" runat="server">
            </asp:Label>
        </p>
        <p>
            <asp:Label ID="userProcessedList" runat="server" AutoPostBack="True">
            </asp:Label>
        </p>
        </form>
    </div>
    

</body>
</html>
