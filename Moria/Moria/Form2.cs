using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Media;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using Moria.Properties;
using System.Text.RegularExpressions;
using System.Diagnostics.Eventing.Reader;
using System.Net.Mail;
using System.Net;
using Bunifu.Framework.UI;
using Bunifu.UI.WinForms.BunifuButton;
using Bunifu.UI.WinForms;
using System.Device.Location;
using static System.Windows.Forms.LinkLabel;

namespace Moria
{
    public partial class Form2 : Form
    {

        private List<string> leaderQuotes = new List<string>
        {
            "Bana kalsaydı silahların ustası olacağıma felsefenin \nen yüce sırlarının ustası olmayı tercih ederdim.\n-BÜYÜK İSKENDER",
            "Roma’da ikinci adam olmaktansa, bir köyde \nbirinci adam olmayı tercih ederim. n\n-BÜYÜK İSKENDER",
            "Devletleri yıkan tüm hatanın altında, \nnice gururun gafleti yatar.\n-YAVUZ SULTAN SELİM",
            "Zayıf insanlar affetmeyi bilmezler. Affetmek,\n güçlülere has bir özelliktir.\n-MAHATMA GANDHİ",
            "Benim kazanmam önemli değil,diğerlerinin hepsi kaybetmelidir.,\n güçlülere has bir özelliktir.\n-CENGİZ HAN",
            "Hayatı ve özgürlüğü için ölümü göze alan \nbir millet asla yenilmez.\n-MUSTAFA KEMAL ATATÜRK",
            "Egemenlik verilmez, alınır.\n-MUSTAFA KEMAL ATATÜRK",
            "Yurtta sulh, cihanda sulh.\n-MUSTAFA KEMAL ATATÜRK",
            "Hayatta en hakiki mürşit ilimdir.\n-MUSTAFA KEMAL ATATÜRK",
            "Benim naçiz vücudum elbet bir gün toprak olacaktır, ancak \nTürkiye Cumhuriyeti ilelebet payidar kalacaktır.\n-MUSTAFA KEMAL ATATÜRK",
        };

        public string emailname { get; set; }
        public Form2()
        {
            InitializeComponent();
        }

        GeoCoordinateWatcher watcher = new GeoCoordinateWatcher(); //konum şeysi

        String randomCode;
        public static String to;
        private bool emailDogrulandimi = false;
        string googleMapsLink = "";
        private bool sesliToggle = true;

        string constring = "Data Source=KAPOS\\SQLEXPRESS;Initial Catalog=moria_database;Integrated Security=True";

        private void Form2_Load(object sender, EventArgs e)
        {
            
            ShowRandomQuote();
            Timer timer = new Timer();
            timer.Interval = (10 * 1000);
            timer.Tick += new EventHandler(timer3_Tick);
            timer.Start();
            LoadFormData();
            MessageChat();
            bunifuButton21.Enabled = false;
            label13.Text = bunifuTextBox5.Text;
        }

        private void LoadFormData()
        {

            label2.Text = emailname;
            byte[] getimage = new byte[0];
            SqlConnection con = new SqlConnection(constring);
            string q = "SELECT * FROM Login WHERE email='" + emailname + "'"; //label2.text sol bardaki email yazısı bu yazıya göre kullanıcı seçiliyor veritabanında
            SqlCommand cmd = new SqlCommand(q, con);
            con.Open();
            SqlDataReader dataReader = cmd.ExecuteReader();
            dataReader.Read();
            if (dataReader.HasRows)
            {

                label2.Text = dataReader["email"].ToString();
                bunifuTextBox1.Text = dataReader["firstname"].ToString();
                bunifuTextBox5.Text = dataReader["firstname"].ToString();


                bunifuTextBox2.Text = dataReader["lastname"].ToString();
                bunifuTextBox6.Text = dataReader["lastname"].ToString();


                bunifuTextBox3.Text = dataReader["email"].ToString();
                bunifuTextBox7.Text = dataReader["email"].ToString();


                bunifuTextBox4.Text = dataReader["password"].ToString();
                byte[] images = (byte[])dataReader["image"];
                if (images == null)
                {
                    //bunifuButton1.Image = null;
                }
                else
                {
                    MemoryStream me = new MemoryStream(images);
                    bunifuPictureBox1.Image = Image.FromStream(me);
                    bunifuPictureBox4.Image = Image.FromStream(me);
                    bunifuPictureBox5.Image = Image.FromStream(me);
                }
            }
            con.Close();


        }


        private void bunifuButton1_Click(object sender, EventArgs e)
        {
            Form1 f1 = new Form1();
            this.Hide();
            f1.Show();
        }
        private bool check;
        private void timer1_Tick(object sender, EventArgs e)
        {
            if (check)
            {
                bunifuPanel1.Width += 10;
                if (bunifuPanel1.Size == bunifuPanel1.MaximumSize)
                {
                    bunifuPictureBox2.Left = +230;
                    timer1.Stop();
                    check = false;
                    bunifuPictureBox2.Image = Resources.leftArrow;
                }
            }
            else
            {
                bunifuPanel1.Width -= 10;
                if (bunifuPanel1.Size == bunifuPanel1.MinimumSize)
                {
                    bunifuPictureBox2.Left = 2;
                    timer1.Stop();
                    check = true;
                    bunifuPictureBox2.Image = Resources.menu;
                }
            }
        }

        private void bunifuPictureBox2_Click(object sender, EventArgs e)
        {
            timer1.Start();
        }

        private void bunifuPictureBox3_Click(object sender, EventArgs e)
        {
            if (bunifuPanel6.Visible == false)
            {
                bunifuPanel6.Visible = true;
            }
            else
            {
                bunifuPanel6.Visible = false;
            }
        }

        private void bunifuTextBox2_TextChanged(object sender, EventArgs e)
        {

        }

        private void bunifuPictureBox4_Click(object sender, EventArgs e)
        {

        }

        private void bunifuTextBox3_TextChanged(object sender, EventArgs e)
        {

        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void bunifuButton6_Click(object sender, EventArgs e)
        {
            if (panel1.Visible == false)
            {
                panel1.Visible = true;
            }
            else
            {
                panel1.Visible = false;
            }
        }

        private void bunifuPictureBox5_Click(object sender, EventArgs e)
        {
            openFileDialog1.Filter = "SELECT image(*Jpg; *.png; *Gif|*.Jpg; *.png; *Gif";
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                bunifuPictureBox5.Image = Image.FromFile(openFileDialog1.FileName);
            }
        }

        private bool IsEmailExists(string email)
        {
            using (SqlConnection con = new SqlConnection(constring))
            {
                con.Open();
                string query = "SELECT COUNT(*) FROM Login WHERE email = @email";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@email", email);
                    int count = (int)cmd.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        private void changeUserCredentials()
        {
            SqlConnection con = new SqlConnection(constring);
            con.Open();
            string updateChatQuery = $"UPDATE Chat SET userone = @newUsername WHERE userone = @oldUsername; " +
                                     $"UPDATE Chat SET usertwo = @newUsername WHERE usertwo = @oldUsername";
            SqlCommand updateChatCmd = new SqlCommand(updateChatQuery, con);
            updateChatCmd.Parameters.AddWithValue("@newUsername", bunifuTextBox5.Text);
            updateChatCmd.Parameters.AddWithValue("@oldUsername", label13.Text);
            updateChatCmd.ExecuteNonQuery();

            string updateLoginQuery = $"UPDATE login SET firstname=@fname, lastname=@lname, email=@email, image=@image WHERE email = '{emailname}'";
            emailname = bunifuTextBox7.Text;


            byte[] imageBytes;
            using (MemoryStream ms = new MemoryStream())
            {
                bunifuPictureBox5.Image.Save(ms, bunifuPictureBox1.Image.RawFormat);
                imageBytes = ms.ToArray();//resmi sorguya eklememiş ondan olmuyormuş sorguya eklemek içinde byte dönüştürmek gerekiyordu onu yaptım
                //register sayfasında var zaten aynı kod direk ona bakarak yaptım.
            }
            SqlCommand cmd = new SqlCommand(updateLoginQuery, con);
            cmd.Parameters.AddWithValue("@fname", bunifuTextBox5.Text);
            cmd.Parameters.AddWithValue("@lname", bunifuTextBox6.Text);
            cmd.Parameters.AddWithValue("@email", bunifuTextBox7.Text);
            cmd.Parameters.AddWithValue("@image", imageBytes);
            cmd.ExecuteNonQuery();

            con.Close();
            MessageBox.Show("Profil güncellendi, değişiklik için lütfen uygulamayı yeniden başlatın");
            label13.Text = bunifuTextBox5.Text; //yeni kullanıcı ismini ekrana yazdırsın diye 
            LoadFormData();
        }

        private void bunifuButton21_Click(object sender, EventArgs e) // SAVE BUTTON
        {
            if (!emailDogrulandimi)
            {
                MessageBox.Show("Önce e-postanı doğrulaman gerekir");
                return;
            }

            if (string.IsNullOrEmpty(bunifuTextBox5.Text.Trim()))
            {
                errorProvider1.SetError(bunifuTextBox5, "Bos gecemessin");
                return;
            }
            else
            {
                errorProvider1.SetError(bunifuTextBox5, string.Empty);
            }



            if (string.IsNullOrEmpty(bunifuTextBox6.Text.Trim()))
            {
                errorProvider1.SetError(bunifuTextBox6, "Bos gecemessin");
                return;
            }
            else
            {
                errorProvider1.SetError(bunifuTextBox6, string.Empty);
            }

            if (string.IsNullOrEmpty(bunifuTextBox7.Text.Trim()))
            {
                errorProvider1.SetError(bunifuTextBox7, "Bos gecemessin");
                return;
            }
            else
            {
                errorProvider1.SetError(bunifuTextBox7, string.Empty);
            }



            string validEmail = @"^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$";
            if (Regex.IsMatch(bunifuTextBox7.Text, validEmail))
            {
                errorProvider1.Clear();
            }
            else
            {
                errorProvider1.SetError(this.bunifuTextBox7, "Lütfen geçerli bir e-posta adresi belirtin");
                return;
            }

            if (emailname != bunifuTextBox7.Text)
            {
                if (!IsEmailExists(bunifuTextBox7.Text))//eğer uygulama kapatıpı açılmaz ise login page den giriş yapılamıyor restart gerekiyor
                {
                    //eğer adam emaili dahil her şeyi değiştirmek istiyorsa bu kod çalışıyor eğer sadece isim değişecekse mailler de çakışma yapar ondan 
                    changeUserCredentials();
                }
                else
                {
                    MessageBox.Show("Bu e-posta zaten kullanılıyor lütfen farklı bir e-posta deneyiniz");
                }
            }
            else
            {
                //IsEmailExists fonksiyonunu çalıştırmadan değiştirme yapıyoruz bu saye de çakışma olmuyor 
                //her iki ihtimaldede email değişiyor ama birinde aynı email üstüne yazılıyor ve zaten o mail doğrulanmış oldundan sıkıntı çıkmıcak
                changeUserCredentials();
            }

            bunifuButton21.Enabled = false;
            emailDogrulandimi = false;
        }

        private void timer2_Tick(object sender, EventArgs e)
        {
            if (check)
            {
                panel3.Height += 10;
                if (panel3.Size == panel3.MaximumSize)
                {

                    timer2.Stop();
                    check = false;
                    //alt satır olmuyor anlamadım butonun image özelliği yok diye herhalde çok önemli değil bence
                    //  bunifuButton22.Image = Resources.Collapce;
                }
            }
            else
            {
                panel3.Height -= 10;
                if (panel3.Size == panel3.MinimumSize)
                {

                    timer2.Stop();
                    check = true;
                    //alt satır olmuyor anlamadım butonun image özelliği yok diye herhalde çok önemli değil bence
                    // bunifuButton22.Image = Expand_Arrow;
                }
            }
        }

        private void updateprofile_Click(object sender, EventArgs e)
        {
            if (bunifuPictureBox3.Visible == true)
            {
                bunifuPictureBox3.Visible = false;
            }

            panel2.BringToFront();
            if (panel2.Visible == false)
            {
                panel2.Visible = true;
            }
            if (panel4.Visible == true)
            {
                panel4.Visible = false;
            }
        }

        private void bunifuPictureBox6_Click(object sender, EventArgs e)
        {
            if (panel2.Visible == true)
            {
                panel2.Visible = false;
            }
        }

        private void bunifuButton4_Click(object sender, EventArgs e)
        {

        }

        private void bunifuPanel1_Click(object sender, EventArgs e)
        {

        }

        private void bunifuButton22_Click(object sender, EventArgs e)
        {
            timer2.Start();
        }

        private void updatepassword_Click(object sender, EventArgs e)
        {

            if (bunifuPictureBox3.Visible == true)
            {
                bunifuPictureBox3.Visible = false;
            }


            panel4.BringToFront();
            if (panel4.Visible == false)
            {
                panel4.Visible = true;
            }
            if (panel2.Visible == true)
            {
                panel2.Visible = false;
            }
        }

        private void bunifuPictureBox7_Click(object sender, EventArgs e)
        {
            if (panel4.Visible == true)
            {
                panel4.Visible = false;
            }
        }

        private void label11_Click(object sender, EventArgs e)
        {

        }

        private void bunifuTextBox9_TextChanged(object sender, EventArgs e)
        {

        }

        private void bunifuButton23_Click(object sender, EventArgs e) // SAVE2 BUTTON (şifredeğiştirmeiçin)
        {

            if (string.IsNullOrEmpty(bunifuTextBox8.Text.Trim())) //boş geçemessin uyarısı şunun için bunifutextbox8=oldpassword
            {
                errorProvider1.SetError(bunifuTextBox8, "Bos gecemessin");
                return;
            }
            else
            {
                errorProvider1.SetError(bunifuTextBox8, string.Empty);
            }

            if (string.IsNullOrEmpty(bunifuTextBox10.Text.Trim())) //boş geçemessin uyarısı şunun için bunifutextbox10=confirmpassword
            {
                errorProvider1.SetError(bunifuTextBox10, "Bos gecemessin");
                return;
            }
            else
            {
                errorProvider1.SetError(bunifuTextBox10, string.Empty);
            }


            if (bunifuTextBox9.Text == bunifuTextBox10.Text && bunifuTextBox8.Text == bunifuTextBox4.Text)
            {
                validatepassword();
            }
            else if (bunifuTextBox8.Text != bunifuTextBox4.Text)
            {
                MessageBox.Show("Eski sifre yanlis!");
                return;
            }
            else if (bunifuTextBox9.Text != bunifuTextBox10.Text)
            {
                MessageBox.Show("Sifre ve onay sifresi ayni olmak zorunda!");
                return;
            }


        }


        public void validatepassword() // sifre değiştirme kodu
        {
            var input = bunifuTextBox9.Text;

            if (string.IsNullOrWhiteSpace(input)) //boş geçemessin uyarısı şunun için bunifutextbox9=password
            {
                errorProvider1.SetError(bunifuTextBox9, "Sifre bos olmamalidir");
                return;
            }

            var hasUpperChar = new Regex(@"[A-Z]+");
            var hasLowerChar = new Regex(@"[a-z]+");
            var hasSymbols = new Regex(@"[!@#$%^&*()_+=\[{\]}; :<>|./?,-]");
            var hasNumber = new Regex(@"[0-9]+");
            var hasMiniMaxChars = new Regex(@".{8,8}");


            if (!hasLowerChar.IsMatch(input))
            {
                MessageBox.Show("Sifre En az bir kucuk harf icermelidir");
                return;
            }
            else if (!hasUpperChar.IsMatch(input))
            {
                MessageBox.Show("Sifre En az bir buyuk harf icermelidir");
                return;
            }
            else if (!hasSymbols.IsMatch(input))
            {
                MessageBox.Show("Sifre En az bir ozel karakter icermelidir");
                return;
            }
            else if (!hasNumber.IsMatch(input))
            {
                MessageBox.Show("Sifre En az bir numara icermelidir");
                return;
            }
            else if (!hasMiniMaxChars.IsMatch(input))
            {
                MessageBox.Show("Sifre 8 karakterden az olmamalidir");
                return;
            }
            else
            {
                SqlConnection con = new SqlConnection(constring);
                con.Open();
                SqlCommand cmd = new SqlCommand("UPDATE Login SET password ='" + bunifuTextBox9.Text + "'where email = '" + label2.Text + "'and password = '" + bunifuTextBox8.Text + "'", con);

                cmd.ExecuteNonQuery();
                con.Close();
                MessageBox.Show("Sifreniz Degistirildi");
                bunifuTextBox4.Text = bunifuTextBox9.Text;
                bunifuTextBox9.Text = string.Empty;
            }
        }

        private void passChangeShowPass_CheckedChanged(object sender, EventArgs e)
        {
            if (passChangeShowPass.Checked)
            {
                bunifuTextBox8.PasswordChar = '\0';
                bunifuTextBox9.PasswordChar = '\0';
                bunifuTextBox10.PasswordChar = '\0';
            }
            else
            {
                bunifuTextBox8.PasswordChar = '*';
                bunifuTextBox9.PasswordChar = '*';
                bunifuTextBox10.PasswordChar = '*';
            }
        }

        private void bunifuButton5_Click(object sender, EventArgs e) // CHAT BUTTON 
        {

            if (bunifuPictureBox3.Visible == true)
            {
                bunifuPictureBox3.Visible = false;
            }


            UserItem();
            panel5.BringToFront();
            if (panel2.Visible == true || panel4.Visible == true)
            {
                panel2.Visible = false;
                panel4.Visible = false;
            }

            panel5.Visible = true;

        }

        private void bunifuButton2_Click(object sender, EventArgs e) // HOME BUTTON
        {


            if (bunifuPictureBox3.Visible == false)
            {
                bunifuPictureBox3.Visible = true;
            }


            if (panel2.Visible == true || panel4.Visible == true || panel5.Visible == true)
            {
                panel2.Visible = false;
                panel4.Visible = false;
                panel5.Visible = false;
            }
        }


        private void UserItem()
        {
            flowLayoutPanel1.Controls.Clear();
            SqlDataAdapter adapter;
            adapter = new SqlDataAdapter("select * from Login", constring);
            DataTable table = new DataTable();
            adapter.Fill(table);

            if (table != null)
            {
                if (table.Rows.Count > 0)
                {
                    UserControl1[] userControls = new UserControl1[table.Rows.Count];

                    for (int i = 0; i < 1; i++)
                    {
                        foreach (DataRow row in table.Rows)
                        {

                            userControls[i] = new UserControl1();
                            MemoryStream stream = new MemoryStream((byte[])row["image"]);
                            userControls[i].Icon = new Bitmap(stream);
                            userControls[i].Title = row["firstname"].ToString();

                            if (userControls[i].Title == bunifuTextBox1.Text)
                            {
                                flowLayoutPanel1.Controls.Remove(userControls[i]);
                            }
                            else
                            {
                                flowLayoutPanel1.Controls.Add(userControls[i]);
                            }
                            userControls[i].Click += new System.EventHandler(this.userControl11_Load);
                        }
                    }
                }
            }
        }

        static string Encode(string message)
        {
            // Mesajı UTF-8 encoding ile şifrele
            byte[] messageBytes = Encoding.UTF8.GetBytes(message);
            return Convert.ToBase64String(messageBytes);
        }

        static string Decode(string encodedMessage)
        {
            // Şifreli mesajı UTF-8 encoding ile çöz
            byte[] encodedBytes = Convert.FromBase64String(encodedMessage);
            return Encoding.UTF8.GetString(encodedBytes);
        }

        private void bunifuButton7_Click(object sender, EventArgs e) // mesaj gönderme buttonu
        {
            if (string.IsNullOrEmpty(bunifuTextBox11.Text))
            {
                MessageBox.Show("Boş mesaj gönderemezsiniz!");
                return;
            }

            SqlConnection con = new SqlConnection(constring);
            con.Open();
            string encryptedMessage = Encode(bunifuTextBox11.Text);
            string q = "insert into Chat(userone,usertwo,message)values(@userone,@usertwo,@message)";
            SqlCommand cmd = new SqlCommand(q, con);
            cmd.Parameters.AddWithValue("@userone", bunifuTextBox1.Text);
            cmd.Parameters.AddWithValue("@usertwo", bunifuLabel1.Text);
            cmd.Parameters.AddWithValue("@message", encryptedMessage);
            cmd.ExecuteNonQuery();
            con.Close();
            MessageChat();
            bunifuTextBox11.Clear();
        }

        private void MessageChat()
        {
            SqlDataAdapter adapter;
            // select * from chatte sonda order by time 1 e göre sıralaması lazım mesajları ama sıralama bozuluyor anlamadım.
            adapter = new SqlDataAdapter("SELECT * FROM Chat WHERE (userone = @user1 AND usertwo = @user2) OR (userone = @user2 AND usertwo = @user1)", constring);
            adapter.SelectCommand.Parameters.AddWithValue("@user1", bunifuLabel1.Text);
            adapter.SelectCommand.Parameters.AddWithValue("@user2", bunifuTextBox1.Text);
            DataTable table = new DataTable();
            adapter.Fill(table);
            flowLayoutPanel2.Controls.Clear();

            if (table != null && table.Rows.Count > 0)
            {
                UserControl2[] userControls2s = new UserControl2[table.Rows.Count];
                UserControl3[] userControls3s = new UserControl3[table.Rows.Count];
                int userControl2Index = 0;
                int userControl3Index = 0;
                string konumVarmi;
                foreach (DataRow row in table.Rows)
                {

                    int messageId = Convert.ToInt32(row["message_id"]);

                    if (bunifuTextBox1.Text == row["userone"].ToString() && bunifuLabel1.Text == row["usertwo"].ToString())
                    {
                        userControls2s[userControl2Index] = new UserControl2();
                        userControls2s[userControl2Index].Title = Decode(row["message"].ToString());
                        userControls2s[userControl2Index].MessageId = messageId;

                        if (row["DosyaVerisi"] != DBNull.Value)
                        {
                            userControls2s[userControl2Index].SetDosyaIcerigi(true);
                        }

                        konumVarmi = Decode(row["message"].ToString());
                        if (konumVarmi.Contains("https://www.google.com/maps?q=")){
                            googleMapsLink = konumVarmi;
                            userControls2s[userControl2Index].Title = googleMapsLink;
                            userControls2s[userControl2Index].LinkLabelVisible = true;
                            userControls2s[userControl2Index].LinkLabelLink = googleMapsLink;
                        }

                        flowLayoutPanel2.Controls.Add(userControls2s[userControl2Index]);
                        flowLayoutPanel2.ScrollControlIntoView(userControls2s[userControl2Index]);

                        userControl2Index++;
                    }
                    else if (bunifuLabel1.Text == row["userone"].ToString() && bunifuTextBox1.Text == row["usertwo"].ToString())
                    {
                        userControls3s[userControl3Index] = new UserControl3();
                        userControls3s[userControl3Index].Title = Decode(row["message"].ToString());
                        userControls3s[userControl3Index].Icon = bunifuPictureBox8.Image;
                        userControls3s[userControl3Index].MessageId = messageId;

                        if (row["DosyaVerisi"] != DBNull.Value)
                        {
                            userControls3s[userControl3Index].SetDosyaIcerigi(true);
                        }

                        konumVarmi = Decode(row["message"].ToString());
                        if (konumVarmi.Contains("https://www.google.com/maps?q="))
                        {
                            googleMapsLink = konumVarmi;
                            userControls3s[userControl3Index].Title = googleMapsLink;
                            userControls3s[userControl3Index].LinkLabelVisible = true;
                            userControls3s[userControl3Index].LinkLabelLink = googleMapsLink;
                        }

                        flowLayoutPanel2.Controls.Add(userControls3s[userControl3Index]);
                        flowLayoutPanel2.ScrollControlIntoView(userControls3s[userControl3Index]);

                        // Check if the message has already been notified
                        bool isNotified = CheckIfNotified(row["message"].ToString());

                        if (!isNotified)
                        {
                            if (sesliToggle)
                            {
                                SendNotification("Yeni bir mesajın var", row["message"].ToString());
                            }
                            MarkAsNotified(row["message"].ToString());
                        }
                        userControl3Index++;
                    }
                }
            }
        }


        private bool CheckIfNotified(string message)
        {
            // Check if the message has already been notified in the database
            using (SqlConnection connection = new SqlConnection(constring))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM Notifications WHERE Message = @message AND IsNotified = 1", connection))
                {
                    command.Parameters.AddWithValue("@message", message);
                    int count = (int)command.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        private void MarkAsNotified(string message)
        {
            // Mark the message as notified in the database
            using (SqlConnection connection = new SqlConnection(constring))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("INSERT INTO Notifications (Message, IsNotified) VALUES (@message, 1)", connection))
                {
                    command.Parameters.AddWithValue("@message", message);
                    command.ExecuteNonQuery();
                }
            }
        }

        private void SendNotification(string title, string message)
        {
            System.Windows.Forms.NotifyIcon notification = new System.Windows.Forms.NotifyIcon();
            notification.Visible = true;
            notification.Icon = System.Drawing.SystemIcons.Asterisk;
            notification.BalloonTipTitle = title;
            notification.BalloonTipText = Decode(message); //veri tabanındaki şifreli mesajı bildirimde gösterebilmek için
            notification.ShowBalloonTip(2000); // 2000 milliseconds (2 seconds)
        }

        private void userControl11_Load(object sender, EventArgs e)
        {
            if (panel6.Visible == false && panel7.Visible == false && flowLayoutPanel2.Visible == false)
            {
                panel6.Visible = true;
                panel7.Visible = true;
                flowLayoutPanel2.Visible = true;
            }
            UserControl1 control = (UserControl1)sender;
            bunifuLabel1.Text = control.Title;
            bunifuPictureBox8.Image = control.Icon;

            MessageChat();
        }

        private void timer3_Tick(object sender, EventArgs e)
        {
            MessageChat();
        }

        private void bunifuPictureBox10_Click(object sender, EventArgs e)
        {
            if (panel6.Visible == true && panel7.Visible == true && flowLayoutPanel2.Visible == true)
            {
                panel6.Visible = false;
                panel7.Visible = false;
                flowLayoutPanel2.Visible = false;
            }
        }

        private void bunifuButton24_Click(object sender, EventArgs e)
        {
            bunifuTextBox7.Enabled = false;
            if (label2.Text != bunifuTextBox7.Text)
            {
                if (IsEmailExists(bunifuTextBox7.Text))
                {
                    MessageBox.Show("Bu e-posta zaten kullanılıyor lütfen başka bir e-posta giriniz");
                    return;
                }//eğer mail farklı ise kod aşağı doğru çalışmaya devam eder yani adam maili değişmicekse herşey olduğu gibi çalışmaya devam eder
            }
            String from, pass, messageBody;
            Random rand = new Random();
            randomCode = (rand.Next(999999)).ToString();
            MailMessage message = new MailMessage();
            to = (bunifuTextBox7.Text).ToString();
            from = "ramazanmoria@gmail.com";
            pass = "druvpbdebtmaxkdz";
            messageBody = "Doğrulama kodunuz: " + randomCode;
            message.To.Add(to);
            message.From = new MailAddress(from);
            message.Body = messageBody;
            message.Subject = "Password Reseting Code";
            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
            smtp.EnableSsl = true;
            smtp.Port = 587;
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Credentials = new NetworkCredential(from, pass);

            try
            {
                smtp.Send(message);
                MessageBox.Show("Code Send Successfully");
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void bunifuButton25_Click(object sender, EventArgs e)
        {
            if (randomCode == (bunifuTextBox12.Text).ToString())
            {
                to = bunifuTextBox12.Text;
                emailDogrulandimi = true;
                bunifuButton21.Enabled = true;
                MessageBox.Show("Kod Doğru");
            }
            else
            {
                MessageBox.Show("Yanlış Kod!");
            }
            bunifuTextBox7.Enabled = true;
        }

        private void bunifuCircleProgress1_ProgressChanged(object sender, Bunifu.UI.WinForms.BunifuCircleProgress.ProgressChangedEventArgs e)
        {

        }

        private void bunifuPictureBox1_Click(object sender, EventArgs e)
        {

        }

        private void flowLayoutPanel1_Paint(object sender, PaintEventArgs e)
        {

        }
        private bool toggle = false;
        private void bunifuButton8_Click(object sender, EventArgs e)
        {

        }

        private void bunifuPictureBox11_Click(object sender, EventArgs e)
        {
            if (bunifuPanel6.Visible == false)
            {
                bunifuPanel6.Visible = true;
            }
            else
            {
                bunifuPanel6.Visible = false;
            }
        }

        public void bunifuToggleSwitch1_CheckedChanged(object sender, Bunifu.UI.WinForms.BunifuToggleSwitch.CheckedChangedEventArgs e)
        {

            if (toggle)
            {
                this.BackColor = Color.BlueViolet;

                panel1.BackColor = Color.BlueViolet;
                bunifuPanel2.BackgroundColor = Color.BlueViolet;
                bunifuGradientPanel1.BackColor = Color.BlueViolet;
                panel5.BackColor = Color.BlueViolet;
                bunifuGradientPanel1.GradientBottomLeft = Color.BlueViolet;  
                bunifuGradientPanel1.GradientTopLeft = Color.BlueViolet;
                bunifuGradientPanel1.GradientTopRight = Color.FromArgb(150, 129, 235);
                bunifuGradientPanel1.GradientBottomRight = Color.FromArgb(150, 129, 235);
                bunifuLabel2.Text = ("Dark Mode");

            }

            else
            {
                this.BackColor = Color.FromArgb(242, 161, 84);
                panel1.BackColor = Color.FromArgb(242, 161, 84);
                bunifuPanel2.BackgroundColor = Color.FromArgb(242, 161, 84);
                bunifuGradientPanel1.GradientBottomLeft = Color.FromArgb(242, 161, 84);
                bunifuGradientPanel1.GradientTopLeft = Color.FromArgb(242, 161, 84);
                bunifuGradientPanel1.GradientTopRight = Color.FromArgb(150, 129, 235);
                bunifuGradientPanel1.GradientBottomRight = Color.FromArgb(150, 129, 235);
                panel5.BackColor = Color.FromArgb(242, 161, 84);
                bunifuLabel2.Text = ("Light Mode");
            }

            // Anahtar değişkenini tersine çevir
            toggle = !toggle;
        }

        public void MesajiArayuzdenSil(UserControl2 userControl2)
        {
            DialogResult result = MessageBox.Show("Bu mesajı silmek istediğinizden emin misiniz?", "Onay", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                this.flowLayoutPanel2.Controls.Remove(userControl2);
                SilinenMesajiVeritabanindanKaldır(Encode(userControl2.Title), userControl2.MessageId);//encode olmalı yoksa bug olur sonuçta ekran da yazanla veri tabanındaki eşit dil
            }
        }


        private void SilinenMesajiVeritabanindanKaldır(string deletedMessage, int MessageId)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(constring)) // using yaptığımız için oto kapanacak işlemden sonra sql
                {
                    con.Open();

                    string query = "DELETE FROM Chat WHERE userone = @sender AND usertwo = @receiver AND message = @deletedMessage AND message_id = @MessageId";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@sender", bunifuTextBox1.Text);
                    cmd.Parameters.AddWithValue("@receiver", bunifuLabel1.Text);
                    cmd.Parameters.AddWithValue("@deletedMessage", deletedMessage);
                    cmd.Parameters.AddWithValue("@MessageId", MessageId);

                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Mesaj silinirken bir hata oluştu: " + ex.Message);
            }
        }

        public string UserControl2İsim; // değiştirmeden önceki mesajı burada tutuyorum. 
        public void OpenEditMessage(UserControl2 userControl2) // mesaj düzenleme
        {
            if (MessageEditPanel.Visible == false)
            {
                MessageEditPanel.Visible = true;

                //bunifuTextBox13.PlaceholderText = userControl2.Title;
                UserControl2İsim = Encode(userControl2.Title); // Bu kısımda değiştirilecek mesajı alıyoruz
                EditTextBox.Text = userControl2.Title;
                int messageId = userControl2.MessageId;
                SendEditButton.Tag = messageId;
                MessageChat();
            }
            else
            {
                MessageEditPanel.Visible = false;
            }

        }

        public void SendEditButton_Click(object sender, EventArgs e) // edit gönder button
        {
            if (MessageEditPanel.Visible == true)
            {

                if (string.IsNullOrEmpty(EditTextBox.Text))
                {
                    MessageBox.Show("Boş mesaj gönderemezsiniz!");
                    return;
                }

                using (SqlConnection con = new SqlConnection(constring))
                {
                    con.Open();

                    string query = "UPDATE Chat SET message = @editedmessage WHERE userone = @sender AND usertwo = @receiver AND message = @message AND message_id = @MessageId";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@editedmessage", Encode(EditTextBox.Text)); // degistirilen mesaj
                    cmd.Parameters.AddWithValue("@sender", bunifuTextBox1.Text); // Gönderenin adı
                    cmd.Parameters.AddWithValue("@receiver", bunifuLabel1.Text); // Alıcının adı
                    cmd.Parameters.AddWithValue("@message", UserControl2İsim); // orjinal mesaj
                    cmd.Parameters.AddWithValue("@MessageId", SendEditButton.Tag); // mesajın satırındaki mesaj_id değeri


                    cmd.ExecuteNonQuery();
                }

                MessageEditPanel.Visible = false;
                UserControl2İsim = string.Empty;
            }
        }
        private void bunifuIconButton4_Click(object sender, EventArgs e) // mesaj üç nokta buttonu
        {
            if (bunifuGradientPanel2.Visible == false)
            {
                bunifuGradientPanel2.Visible = true;
                bunifuGradientPanel2.BringToFront();
            }
            else
            {
                bunifuGradientPanel2.Visible = false;
                bunifuPanel7.Visible = false;
            }
        }

        private void bunifuIconButton1_Click(object sender, EventArgs e) // emoji buttonu
        {
            if (bunifuPanel7.Visible == false)
            {
                bunifuPanel7.Visible = true;
                bunifuPanel7.BringToFront();
            }
            else
            {
                bunifuPanel7.Visible = false;
            }
        }


        private void EmojiButtonClick(string emojiText)
        {
            if (MessageEditPanel.Visible == false)
            {
                bunifuTextBox11.Text += emojiText;
            }
            else
            {
                EditTextBox.Text += emojiText;
            }
        }
        private void bunifuButton3_Click(object sender, EventArgs e) // gülme 1 emoji
        {
            EmojiButtonClick(" &#x1F604 ");
        }
        private void bunifuButton8_Click_1(object sender, EventArgs e) // gülme 2 emoji
        {
            EmojiButtonClick(" &#x1F606 ");
        }
        private void bunifuButton9_Click(object sender, EventArgs e) // gülme 3 emoji
        {
            EmojiButtonClick(" &#x1F923 ");
        }
        private void bunifuButton10_Click(object sender, EventArgs e) // düz surat emoji
        {
            EmojiButtonClick(" &#x1F610 ");
        }
        private void bunifuButton11_Click(object sender, EventArgs e) // dil çıkarma emoji
        {
            EmojiButtonClick(" &#x1F61B ");
        }
        private void bunifuButton12_Click(object sender, EventArgs e) // havalı emoji
        {
            EmojiButtonClick(" &#x1F60E ");
        }
        private void bunifuButton13_Click(object sender, EventArgs e) // üzgün emoji
        {
            EmojiButtonClick(" &#x1F622 ");
        }
        private void bunifuButton14_Click(object sender, EventArgs e) // sinirli emoji
        {
            EmojiButtonClick(" &#x1F621 ");
        }
        private void bunifuButton15_Click(object sender, EventArgs e) // sevgi emoji
        {
            EmojiButtonClick(" &#x1F60D ");
        }

        private void bunifuIconButton3_Click(object sender, EventArgs e) // konum buttonu
        {
            if(MessageBox.Show("Konum gönderilmesini onaylıyormusunuz", "Onay Kutusu", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes){
                watcher.Start();
                // Konum bilgisi değiştiğinde tetiklenecek olay
                watcher.PositionChanged += (param, userEvent) =>
                {
                    var coordinate = userEvent.Position.Location;
                    double latitude = coordinate.Latitude;
                    double longitude = coordinate.Longitude;

                    // Belirli bir hassasiyetle yuvarla (örneğin, 6 ondalık basamak) google maps de 6 basamakta çalıştı
                    latitude = Math.Round(latitude, 6);
                    longitude = Math.Round(longitude, 6);


                    googleMapsLink = $"https://www.google.com/maps?q={latitude.ToString().Replace(',', '.')},{longitude.ToString().Replace(',', '.')}";
                    bunifuTextBox11.Text = googleMapsLink;
                };
                watcher.Stop();
            }
        }

        public void DosyaIndir(int mesajID)
        {
            using (SqlConnection connection = new SqlConnection(constring))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("SELECT DosyaVerisi,DosyaAdi FROM Chat WHERE message_id = @MesajID", connection))
                {
                    command.Parameters.AddWithValue("@MesajID", mesajID);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            byte[] dosyaVerisi = (byte[])reader["DosyaVerisi"];
                            string dosyaAdi = reader["DosyaAdi"].ToString();

                            using (SaveFileDialog saveFileDialog = new SaveFileDialog())
                            {
                                saveFileDialog.Filter = "Tüm Dosyalar|*.*";

                                // Dosya adını varsayılan olarak belirledim
                                saveFileDialog.FileName = dosyaAdi;

                                if (saveFileDialog.ShowDialog() == DialogResult.OK)
                                {
                                    // Dosyayı seçilen yere kaydettim
                                    File.WriteAllBytes(saveFileDialog.FileName, dosyaVerisi);
                                    MessageBox.Show("Dosya indirildi: " + saveFileDialog.FileName);
                                }
                            }
                        }
                    }

                }
            }
        }


        private void bunifuIconButton2_Click(object sender, EventArgs e) //dosya gönder buttonu
        {
            using (OpenFileDialog openFileDialog = new OpenFileDialog())
            {
                openFileDialog.Title = "Dosya Seç";
                openFileDialog.Filter = "Tüm Dosyalar|*.*";
                openFileDialog.Multiselect = false;

                if (openFileDialog.ShowDialog() == DialogResult.OK)
                {
                    string dosyaYolu = openFileDialog.FileName;
                    byte[] dosyaVerisi = File.ReadAllBytes(dosyaYolu);
                    using (SqlConnection connection = new SqlConnection(constring))
                    {
                        connection.Open();

                        using (SqlCommand command = new SqlCommand("INSERT INTO Chat (userone, usertwo, message, DosyaAdi, DosyaVerisi) VALUES (@userone, @usertwo, @message, @DosyaAdi, @DosyaVerisi)", connection))
                        {
                            command.Parameters.AddWithValue("@userone", bunifuTextBox1.Text);
                            command.Parameters.AddWithValue("@usertwo", bunifuLabel1.Text);
                            command.Parameters.AddWithValue("@message", "RG9zeWE=");//Dosya demek ama şifreli hali
                            command.Parameters.AddWithValue("@DosyaAdi", Path.GetFileName(dosyaYolu));
                            command.Parameters.AddWithValue("@DosyaVerisi", dosyaVerisi);
                            command.ExecuteNonQuery();
                        }
                    }
                    MessageBox.Show("Dosya gönderildi.");
                }
            }
        }
        bool move;
        int mouse_x;
        int mouse_y;
        private void bunifuGradientPanel1_MouseDown(object sender, MouseEventArgs e)
        {
            move = true;
            mouse_x = e.X;
            mouse_y = e.Y;
        }

        private void bunifuGradientPanel1_MouseMove(object sender, MouseEventArgs e)
        {
            if (move == true)
            {
                this.SetDesktopLocation(MousePosition.X - mouse_x, MousePosition.Y - mouse_y);
            }
        }

        private void bunifuGradientPanel1_MouseUp(object sender, MouseEventArgs e)
        {
            move = false;
        }
        private void ShowRandomQuote()
        {
            // Rastgele bir lider sözünü seç
            Random random = new Random();
            int index = random.Next(leaderQuotes.Count);
            string randomQuote = leaderQuotes[index];

            // Label kontrolüne sözü yaz
            label15.Text = randomQuote;
        }

        private void bunifuToggleSwitch2_CheckedChanged(object sender, Bunifu.UI.WinForms.BunifuToggleSwitch.CheckedChangedEventArgs e)
        {
            if (sesliToggle)
            {
                sesliToggle = false;
                bunifuLabel3.Text = "Bildirimler kapalı";
            }
            else
            {
                sesliToggle = true;
                bunifuLabel3.Text = "Bildirimler açık";
            }
        }
    }
}