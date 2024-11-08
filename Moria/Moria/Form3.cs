using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Moria
{
    public partial class Form3 : Form
    {
        public Form3()
        {
            InitializeComponent();
        }
        bool islem=false;
        private void timer1_Tick(object sender, EventArgs e)
        {
            if(!islem)
            {
                this.Opacity += 0.009;
            }
            if (this.Opacity == 1.0)
            {
                islem = true;
            }
            if(islem)
            {
                this.Opacity -= 0.009;
                if (this.Opacity == 0)
                {
                    Form1 gtr = new Form1();
                    gtr.Show();
                    this.Hide();
                    timer1.Enabled = false;
                }
            }
        }
    }
}
