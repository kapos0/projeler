export default function About() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-2 text-center">
                <div>
                    <h1 className="text-3xl font-semibold text-center my-3">
                        Mehmet Enes Turhan
                    </h1>
                    <div className="text-md text-gray-500 flex flex-col gap-6">
                        <p>
                            Bu kullanıcların imdb veritabanından istediği
                            filmleri inceleyip favorilere ekleyebileceği ve
                            izlediği filmleri işaretleyebileceği basit bir
                            uygulamadır.
                        </p>

                        <p>
                            Next.JS, Next-auth ve MongoDB kullanılarak
                            geliştirilmiştir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
