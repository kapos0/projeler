﻿namespace moria
{
    partial class moria_kayitol
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
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.gotoLogin = new System.Windows.Forms.LinkLabel();
            this.registerUserNametxt = new System.Windows.Forms.TextBox();
            this.registerPasstxt = new System.Windows.Forms.TextBox();
            this.registerPassConftxt = new System.Windows.Forms.TextBox();
            this.registerBtn = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(197, 51);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(61, 21);
            this.label1.TabIndex = 0;
            this.label1.Text = "Kayıt ol";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(95, 129);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(102, 21);
            this.label2.TabIndex = 1;
            this.label2.Text = "Kullanıcı Adı: ";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(95, 202);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(51, 21);
            this.label3.TabIndex = 2;
            this.label3.Text = "Şifre: ";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(95, 270);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(98, 21);
            this.label4.TabIndex = 3;
            this.label4.Text = "Şifre Tekrar: ";
            // 
            // gotoLogin
            // 
            this.gotoLogin.AutoSize = true;
            this.gotoLogin.Location = new System.Drawing.Point(175, 426);
            this.gotoLogin.Name = "gotoLogin";
            this.gotoLogin.Size = new System.Drawing.Size(71, 21);
            this.gotoLogin.TabIndex = 4;
            this.gotoLogin.TabStop = true;
            this.gotoLogin.Text = "Giriş Yap";
            // 
            // registerUserNametxt
            // 
            this.registerUserNametxt.Location = new System.Drawing.Point(230, 129);
            this.registerUserNametxt.Name = "registerUserNametxt";
            this.registerUserNametxt.Size = new System.Drawing.Size(100, 29);
            this.registerUserNametxt.TabIndex = 5;
            // 
            // registerPasstxt
            // 
            this.registerPasstxt.Location = new System.Drawing.Point(230, 202);
            this.registerPasstxt.Name = "registerPasstxt";
            this.registerPasstxt.Size = new System.Drawing.Size(100, 29);
            this.registerPasstxt.TabIndex = 6;
            // 
            // registerPassConftxt
            // 
            this.registerPassConftxt.Location = new System.Drawing.Point(230, 264);
            this.registerPassConftxt.Name = "registerPassConftxt";
            this.registerPassConftxt.Size = new System.Drawing.Size(100, 29);
            this.registerPassConftxt.TabIndex = 7;
            // 
            // registerBtn
            // 
            this.registerBtn.Location = new System.Drawing.Point(100, 334);
            this.registerBtn.Name = "registerBtn";
            this.registerBtn.Size = new System.Drawing.Size(230, 60);
            this.registerBtn.TabIndex = 8;
            this.registerBtn.Text = "Kayıt Ol";
            this.registerBtn.UseVisualStyleBackColor = true;
            // 
            // moria_kayitol
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 21F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(460, 530);
            this.Controls.Add(this.registerBtn);
            this.Controls.Add(this.registerPassConftxt);
            this.Controls.Add(this.registerPasstxt);
            this.Controls.Add(this.registerUserNametxt);
            this.Controls.Add(this.gotoLogin);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Font = new System.Drawing.Font("Nirmala UI", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.Name = "moria_kayitol";
            this.Load += new System.EventHandler(this.moria_kayitol_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.LinkLabel gotoLogin;
        private System.Windows.Forms.TextBox registerUserNametxt;
        private System.Windows.Forms.TextBox registerPasstxt;
        private System.Windows.Forms.TextBox registerPassConftxt;
        private System.Windows.Forms.Button registerBtn;
    }
}