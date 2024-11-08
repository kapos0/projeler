using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Moria
{
    public partial class UserControl2 : UserControl
    {
        public UserControl2()
        {
            InitializeComponent();
            linkLabel1.Visible = false;
        }

        public int MessageId { get; set; }

        private string _title;
        public string Title
        {
            get { return _title; }
            set { _title = value; bunifuLabel1.Text = value; AddHeighttext(); }
        }

        public bool LinkLabelVisible
        {
            get { return linkLabel1.Visible; }
            set { linkLabel1.Visible = value; }
        }

        public string LinkLabelLink = "";

        void AddHeighttext()
        {
            bunifuLabel1.Height = Uilist.GeTTextHeight(bunifuLabel1) + 10;
            this.Height = bunifuLabel1.Bottom + 5;
        }

        private void UserControl2_Load(object sender, EventArgs e)
        {
            AddHeighttext();
        }

        private void MessageSettingsButton_Click(object sender, EventArgs e) 
        {
            if (MessageSettingsPanel.Visible == false)
            {
                MessageSettingsPanel.Visible = true;
            }
            else
            {
                MessageSettingsPanel.Visible = false;
            }
        }

        private void bunifuButton2_Click(object sender, EventArgs e)
        {
            ((Form2)this.ParentForm).OpenEditMessage(this);
        }

        private void bunifuButton1_Click(object sender, EventArgs e)
        {
            ((Form2)this.ParentForm).MesajiArayuzdenSil(this);
        }

        private bool _dosyaVarMi;
        public bool DosyaVarMi
        {
            get { return _dosyaVarMi; }
            set
            {
                _dosyaVarMi = value;
                bunifuIconButton1.Visible = value; // Dosya varsa indir butonunu göster
            }
        }

        public void SetDosyaIcerigi(bool dosyaVarMi)
        {
            DosyaVarMi = dosyaVarMi;
        }
 
        private void bunifuIconButton1_Click(object sender, EventArgs e)
        {
            ((Form2)this.ParentForm).DosyaIndir(MessageId);
        }

        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            // Link tıklandığında yapılacak işlemler
            string url = LinkLabelLink;

            // Tarayıcıda URL'yi açma
            Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
        }
    }
}