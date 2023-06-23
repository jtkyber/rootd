import Image from 'next/image'
import React, { useState } from 'react'
import face1 from '../public/face1.jpg'
import face2 from '../public/face2.jpg'
import muteBtn from '../public/muteBtn.png'
import styles from '../styles/HomePageSample.module.css'
import AddPsgIcon from './AddPsgIcon'
import OptionsDots from './OptionsDots'

const HomePageSample = () => {
	const [opacity, setOpacity] = useState(0)

	return (
		<div
			style={{ opacity: opacity }}
			onLoad={() => setOpacity(1)}
			className={styles.container}>
			<div className={styles.top}>
				<h4 className={styles.groupTitle}>The Psalms</h4>
			</div>
			<div className={styles.bottom}>
				<AddPsgIcon />
				<div className={styles.inputBox}></div>
				<h6 className={styles.sendBtn}>Send</h6>
			</div>
			<div className={styles.left}>
				<h5 className={styles.myGroupsTitle}>My Groups</h5>
				<div className={styles.groupNameContainer}>
					<h6 className={styles.groupName}>The Psalms</h6>
					<h6 className={styles.groupName}>David</h6>
					<h6 className={styles.groupName}>Job</h6>
				</div>
			</div>
			<div className={styles.right}>
				<div className={styles.chunkOne}>
					<div className={styles.arrow}>
						<div className={styles.rect}></div>
						<div className={styles.triangle}></div>
					</div>
					<Image
						alt='Mute Icon'
						src={muteBtn}
					/>
					<OptionsDots />
				</div>
				<div className={styles.chunkTwo}>
					<h4 className={styles.groupTitle}>The Psalms</h4>
					<p className={styles.groupDescription}>
						A group for those with questions about specific Psalms, and for those who would like to simply
						share their thoughts on a particular Psalm
					</p>
				</div>
				<div className={styles.chunkThree}>
					<h5 className={styles.membersTitle}>Members</h5>
					<div className={styles.members}>
						<h6 className={styles.member}>John Doe</h6>
						<h6 className={styles.member}>Bob Miller</h6>
						<h6 className={styles.member}>Anna Smith</h6>
						<h6 className={styles.member}>Joey K</h6>
						<h6 className={styles.member}>Martha Mae</h6>
					</div>
				</div>
			</div>
			<div className={styles.middle}>
				<div className={styles.message}>
					<div className={styles.author}>
						<div className={styles.imgContainer}>
							<Image
								quality={10}
								fill
								alt='Profile photo sample'
								src={face1}
							/>
						</div>
						<h6 className={styles.name}>John Doe</h6>
					</div>
					<h6 className={`${styles.content} ${styles.user} ${styles.firstMsg}`}>
						Hey guys! I read Psalm 24 this morning and am having some trouble understanding verse 7:
						<span> Psalm 24:7</span>
						<br />
						<br />
						What does David mean when he says "Lift up your heads, O gates!"?
						<svg
							className={styles.likeImg}
							width='188'
							height='163'
							viewBox='0 0 188 163'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M49.1635 0.77892L49.1881 0.312816L49.1635 0.778922C62.1645 1.46549 75.4268 7.14916 85.9173 17.6689L85.9178 17.6694L93.5436 25.2952L93.8975 25.6491L94.251 25.2948L101.862 17.6692C122.869 -3.36748 154.897 -5.02212 173.695 13.8046C192.493 32.6323 190.867 64.7201 169.86 85.7566L162.264 93.3526L162.264 93.3528L93.8971 161.793L25.5158 93.3527L25.5157 93.3526L17.9195 85.7564C17.9195 85.7564 17.9195 85.7564 17.9194 85.7563C-3.08746 64.7347 -4.71388 32.6324 14.0847 13.8046C23.4886 4.38611 36.1784 0.0924208 49.1635 0.77892Z'
								fill='rgb(206, 204, 204)'
								stroke='rgb(69, 33, 23)'
								strokeWidth={16}
							/>
						</svg>
					</h6>
					<h6 className={styles.date}>08:46am</h6>
				</div>

				<div className={styles.message}>
					<div className={styles.author}>
						<div className={styles.imgContainer}>
							<Image
								quality={10}
								fill
								alt='Profile photo sample'
								src={face2}
							/>
						</div>
						<h6 className={styles.name}>Bob Miller</h6>
					</div>
					<h6 className={`${styles.content} ${styles.other} ${styles.secondMsg}`}>
						Hey John! David is referring to the gates of Jerusalem in that verse. He is basically calling on
						the city to welcome the "King of glory" in a poetic way. <br />
						<br />
						It is thought that this verse may be connected to the time when David brought the ark of the
						covenant (which represented God's presence) back from Obed-edom:
						<span> 2 Samuel 6:1-6:23</span>
						<svg
							className={styles.likeImg}
							width='188'
							height='163'
							viewBox='0 0 188 163'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M49.1635 0.77892L49.1881 0.312816L49.1635 0.778922C62.1645 1.46549 75.4268 7.14916 85.9173 17.6689L85.9178 17.6694L93.5436 25.2952L93.8975 25.6491L94.251 25.2948L101.862 17.6692C122.869 -3.36748 154.897 -5.02212 173.695 13.8046C192.493 32.6323 190.867 64.7201 169.86 85.7566L162.264 93.3526L162.264 93.3528L93.8971 161.793L25.5158 93.3527L25.5157 93.3526L17.9195 85.7564C17.9195 85.7564 17.9195 85.7564 17.9194 85.7563C-3.08746 64.7347 -4.71388 32.6324 14.0847 13.8046C23.4886 4.38611 36.1784 0.0924208 49.1635 0.77892Z'
								fill='#E42525'
								stroke='rgb(69, 33, 23)'
								strokeWidth={0}
							/>
						</svg>
					</h6>
					<h6 className={styles.date}>09:07am</h6>
				</div>

				<div className={styles.message}>
					<div className={styles.author}>
						<div className={styles.imgContainer}>
							<Image
								quality={10}
								fill
								alt='Profile photo sample'
								src={face1}
							/>
						</div>
						<h6 className={styles.name}>John Doe</h6>
					</div>
					<h6 className={`${styles.content} ${styles.user} ${styles.thirdMsg}`}>
						Ahhh, ok. That makes sense. Thank you!
						<svg
							className={styles.likeImg}
							width='188'
							height='163'
							viewBox='0 0 188 163'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M49.1635 0.77892L49.1881 0.312816L49.1635 0.778922C62.1645 1.46549 75.4268 7.14916 85.9173 17.6689L85.9178 17.6694L93.5436 25.2952L93.8975 25.6491L94.251 25.2948L101.862 17.6692C122.869 -3.36748 154.897 -5.02212 173.695 13.8046C192.493 32.6323 190.867 64.7201 169.86 85.7566L162.264 93.3526L162.264 93.3528L93.8971 161.793L25.5158 93.3527L25.5157 93.3526L17.9195 85.7564C17.9195 85.7564 17.9195 85.7564 17.9194 85.7563C-3.08746 64.7347 -4.71388 32.6324 14.0847 13.8046C23.4886 4.38611 36.1784 0.0924208 49.1635 0.77892Z'
								fill='rgb(69, 33, 23)'
								stroke='rgb(69, 33, 23)'
								strokeWidth={0}
							/>
						</svg>
					</h6>
					<h6 className={styles.date}>09:14am</h6>
				</div>
			</div>
		</div>
	)
}

export default HomePageSample
