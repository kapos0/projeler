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
using Bunifu.UI.WinForms;
using Bunifu.UI.WinForms.BunifuButton;

namespace Moria
{
    public partial class UserControl3 : UserControl
    {
        public UserControl3()
        {
            InitializeComponent();
            linkLabel1.Visible = false;
        }

        public int MessageId { get; set; }

        public bool LinkLabelVisible
        {
            get { return linkLabel1.Visible; }
            set { linkLabel1.Visible = value; }
        }

        public string LinkLabelLink = "";

        private string _title;
        public string Title
        {
            get { return _title; }
            set { _title = value; bunifuLabel1.Text = value; }
        }

        private Image _icon;
        public Image Icon
        {
            get { return _icon; }
            set { _icon = value; bunifuPictureBox1.Image = value; AddHeighttext(); }
        }
        void AddHeighttext()
        {
            bunifuLabel1.Height = Uilist.GeTTextHeight(bunifuLabel1) + 10;
            this.Height = bunifuLabel1.Bottom + 10;
        }

        private void UserControl3_Load(object sender, EventArgs e)
        {
            AddHeighttext();
        }

        private void bunifuGradientPanel1_Click(object sender, EventArgs e)
        {

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