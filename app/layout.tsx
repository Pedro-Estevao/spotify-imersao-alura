import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import Providers from "@/components/Providers";
import { getSongsByUserId } from "@/actions/getSongsByUserId";
import { Player } from "@/components/Player";

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: "Spotify Clone",
	description: "Listen to music!",
};

export const revalidate = 0;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const userSongs = await getSongsByUserId();

	return (
		<html lang="en">
			<body
				className={font.className}
			>
				<Providers>
					<Sidebar songs={userSongs}>
						{children}
					</Sidebar>
					<Player />
				</Providers>
			</body>
		</html>
	);
}
