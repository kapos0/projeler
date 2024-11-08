using Bunifu.UI.WinForms;
using System;
using System.Drawing;

namespace Moria
{
    internal class Uilist
    {
        internal static int GeTTextHeight(BunifuLabel bunifuLabel1)
        {
            using (Graphics g = bunifuLabel1.CreateGraphics())
            {
                SizeF size = g.MeasureString(bunifuLabel1.Text, bunifuLabel1.Font, 10000);
                return (int)Math.Ceiling(size.Height);
            }
        }
    }
}