namespace moria
{
    partial class moria_giris
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.loginUserNametxt = new System.Windows.Forms.TextBox();
            this.loginPasstxt = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.loginBtn = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.gotoRegister = new System.Windows.Forms.LinkLabel();
            this.SuspendLayout();
            // 
            // loginUserNametxt
            // 
            this.loginUserNametxt.Location = new System.Drawing.Point(258, 202);
            this.loginUserNametxt.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.loginUserNametxt.Name = "loginUserNametxt";
            this.loginUserNametxt.Size = new System.Drawing.Size(136, 34);
            this.loginUserNametxt.TabIndex = 0;
            // 
            // loginPasstxt
            // 
            this.loginPasstxt.Location = new System.Drawing.Point(258, 263);
            this.loginPasstxt.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.loginPasstxt.Name = "loginPasstxt";
            this.loginPasstxt.Size = new System.Drawing.Size(136, 34);
            this.loginPasstxt.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(121, 202);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(129, 28);
            this.label1.TabIndex = 2;
            this.label1.Text = "Kullanıcı Adı: ";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(121, 263);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(63, 28);
            this.label2.TabIndex = 3;
            this.label2.Text = "Şifre: ";
            // 
            // loginBtn
            // 
            this.loginBtn.Location = new System.Drawing.Point(126, 320);
            this.loginBtn.Name = "loginBtn";
            this.loginBtn.Size = new System.Drawing.Size(268, 52);
            this.loginBtn.TabIndex = 6;
            this.loginBtn.Text = "Giriş Yap";
            this.loginBtn.UseVisualStyleBackColor = true;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(212, 95);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(90, 28);
            this.label4.TabIndex = 7;
            this.label4.Text = "Merhaba";
            // 
            // gotoRegister
            // 
            this.gotoRegister.AutoSize = true;
            this.gotoRegister.Location = new System.Drawing.Point(212, 390);
            this.gotoRegister.Name = "gotoRegister";
            this.gotoRegister.Size = new System.Drawing.Size(81, 28);
            this.gotoRegister.TabIndex = 8;
            this.gotoRegister.TabStop = true;
            this.gotoRegister.Text = "Kayıt Ol";
            // 
            // moria_giris
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(11F, 28F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(512, 515);
            this.Controls.Add(this.gotoRegister);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.loginBtn);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.loginPasstxt);
            this.Controls.Add(this.loginUserNametxt);
            this.Font = new System.Drawing.Font("Nirmala UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.Name = "moria_giris";
            this.Text = "Giriş Yap";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox loginUserNametxt;
        private System.Windows.Forms.TextBox loginPasstxt;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button loginBtn;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.LinkLabel gotoRegister;
    }
}

