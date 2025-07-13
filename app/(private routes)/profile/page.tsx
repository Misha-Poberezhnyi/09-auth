import Image from 'next/image';
import Link from 'next/link'; 
import css from './ProfilePage.module.css';
import { Metadata } from 'next';
import { getServerMe } from '@/lib/api/serverApi';

export const metadata: Metadata = {
	title: 'Profile',
	description: 'User Profile Page',
	openGraph: {
		title: 'Profile',
		description: 'User Profile Page',
		url: 'https://profile',
		images: [
			{
				url: 'https://storage.googleapis.com/support-forums-api/attachment/thread-275804406-4521668504705607705.jpg',
				width: 1200,
				height: 630,
				alt: 'NoteHub 404',
			},
		],
	},
};

const Profile = async () => {
	const user = await getServerMe();

	return (
		<main className={css.mainContent}>
			<div className={css.profileCard}>
				<div className={css.header}>
					<h1 className={css.formTitle}>Profile Page</h1>
					<Link href="/profile/edit" className={css.editProfileButton}>
						Edit Profile
					</Link>
				</div>
				<div className={css.avatarWrapper}>
					<Image
						src={user?.avatar || '/7236095.png'}
						alt="User Avatar"
						width={120}
						height={120}
						className={css.avatar}
					/>
				</div>
				<div className={css.profileInfo}>
					<p>Username: {user.username}</p>
					<p>Email: {user.email}</p>
				</div>
			</div>
		</main>
	);
};

export default Profile;