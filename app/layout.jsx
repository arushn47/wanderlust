import "@styles/globals.css";
import Nav from "@components/shared/Nav";
import Footer from "@components/shared/Footer";
import Provider from "@components/auth/Provider";


export const metadata = {
    title: "WanderLust",
    description: "AirBnb Clone"
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="flex flex-col min-h-screen ">
            <Provider>
                <Nav />
                <main className="flex-1 mt-15">
                    {children}
                </main>
            </Provider>
        </body>
        </html>
    );
}