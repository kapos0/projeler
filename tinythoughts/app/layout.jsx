import "@/styles/globals.css";
import Nav from "@/components/Nav";
import Provider from "@/components/Provider";
export const metadata = {
  title: "Tiny Thoughts",
  description: "Discover and Share little thoughts",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/png" href="/assets/icons/favicon.ico"/>
      </head>
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
