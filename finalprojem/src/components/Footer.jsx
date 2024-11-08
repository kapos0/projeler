import React from "react";

function Footer() {
	return (
		<footer className="text-center text-lg-start">
			<section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
				<div className="me-5 d-none d-lg-block">
					<span>
						<i className="fas fa-envelope me-3"></i>Meram Belediyesi Email:
						bizimmeram@meram.bel.tr <i className="fas fa-home me-1"></i>Adres:
						Yenişehir Mahallesi Azerbaycan Caddesi No: 5 42010 Meram / KONYA
					</span>
				</div>
				<div>
					<a
						href="https://www.facebook.com/Meram.Belediyesi"
						className="me-4 text-reset">
						<i className="fab fa-facebook-f"></i>
					</a>
					<a
						href="https://twitter.com/MeramBelediyesi"
						className="me-4 text-reset">
						<i className="fab fa-twitter"></i>
					</a>
					<a
						href="https://www.instagram.com/meram.belediyesi/"
						className="me-4 text-reset">
						<i className="fab fa-instagram"></i>
					</a>
				</div>
			</section>
			<section className="">
				<div className="container text-center text-md-start mt-5">
					<div className="row mt-3">
						<div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
							<img
								src="footerlogo.svg"
								alt="footer logo"
							/>
						</div>
						<div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4 ml-5">
							<h6 className="text-uppercase fw-bold mb-4">Başkan</h6>
							<p>
								<a
									href="https://www.meram.bel.tr/baskan"
									className="text-reset">
									Özgeçmiş
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/baskana-mesaj"
									className="text-reset">
									Başkan'a mesaj
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/baskan-fotograflari"
									className="text-reset">
									Başkanla fotoğraflarınız
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/onceki-baskanlar"
									className="text-reset">
									Önceki başkanlar
								</a>
							</p>
						</div>
						<div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
							<h6 className="text-uppercase fw-bold mb-4">Kurumsal</h6>
							<p>
								<a
									href="https://www.meram.bel.tr/kurumsal/kurum-felsefesi"
									className="text-reset">
									Kurum Felsefesi
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/kurumsal/organizasyon-semasi"
									className="text-reset">
									Organizasyon Şeması
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/kurumsal/baskan-yardimcilari"
									className="text-reset">
									Başkan Yardımcıları
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/kurumsal/belediye-meclis-uyeleri"
									className="text-reset">
									Belediye Meclis Üyeleri
								</a>
							</p>
						</div>
						<div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
							<h6 className="text-uppercase fw-bold mb-4">Hizmet</h6>
							<p>
								<a
									href="https://www.meram.bel.tr/evlilik-islemleri"
									className="text-reset">
									Evlilik işlemleri
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/ruhsat-islemleri"
									className="text-reset">
									Ruhsat işlemleri
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/arabuluculuk"
									className="text-reset">
									Arabuluculuk
								</a>
							</p>
							<p>
								<a
									href="https://www.meram.bel.tr/hizmet-standartlari-2"
									className="text-reset">
									Hizmet strandartları
								</a>
							</p>
						</div>
					</div>
				</div>
			</section>
			<div
				className="text-center p-4"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
				© 2024 Copyright: Mehmet Enes Turhan
			</div>
		</footer>
	);
}

export default Footer;
