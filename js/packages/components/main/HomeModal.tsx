/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	TouchableWithoutFeedback,
	Text as TextNative,
} from 'react-native'
import { Text, Icon } from 'react-native-ui-kitten'
import { useStyles } from '@berty-tech/styles'
import { BlurView } from '@react-native-community/blur'
import { ProceduralCircleAvatar } from '../shared-components/ProceduralCircleAvatar'
import { useNavigation, Routes } from '@berty-tech/navigation'
import { Messenger } from '@berty-tech/hooks'
import { messenger } from '@berty-tech/store'
import { CommonActions } from '@react-navigation/core'
import Interactable from 'react-native-interactable'
import FromNow from '../shared-components/FromNow'
import EmptyContact from './empty_contact.svg'
import { useDimensions } from '@react-native-community/hooks'

const useStylesList = () => {
	const shortScreenMax = 640
	const iPadShortEdge = 768
	const iPadLongEdge = 1024
	const [
		{ absolute, margin, padding, width, height, border, background, row, column },
	] = useStyles()
	const { height: windowHeight, width: windowWidth } = useDimensions().window

	return {
		tinyAvatar: [absolute.scale({ top: -32.5 }), row.item.justify],
		tinyCard: [
			margin.medium,
			padding.medium,
			height(177),
			border.radius.large,
			background.white,
			column.justify,
		],
		tinyAcceptButton: [padding.vertical.scale(5), padding.horizontal.small, border.radius.scale(6)],
		tinyDiscardButton: [
			padding.scale(5),
			margin.right.small,
			border.radius.scale(6),
			border.color.light.grey,
		],
		addContactItem: [height(115), width(150)],
		addContactItemText: width(75),
		windowHeight,
		windowWidth,
		isLandscape: windowHeight < windowWidth,
		isShortWindow: windowHeight <= shortScreenMax,
		isGteIpadSize:
			Math.min(windowHeight, windowWidth) >= iPadShortEdge &&
			Math.max(windowHeight, windowWidth) >= iPadLongEdge,
	}
}

export const Header: React.FC<{
	title: string
	icon?: string
	iconPack?: string
	first?: boolean
	disabled?: boolean
	onPress?: any
	style?: any
}> = ({
	children,
	title,
	icon,
	iconPack,
	first = false,
	disabled = false,
	onPress = null,
	style = null,
}) => {
	const [
		{ height, border, margin, row, padding, text, column, color, background, opacity },
	] = useStyles()
	return (
		<View style={[!first && background.white]}>
			<TouchableWithoutFeedback onPress={onPress}>
				<View
					style={[
						background.white,
						border.radius.top.scale(30),
						border.shadow.big,
						disabled && opacity(0.5),
						style,
					]}
				>
					<View style={[height(90)]}>
						<View
							style={[
								margin.top.small,
								row.item.justify,
								border.scale(2.5),
								border.color.light.grey,
								border.radius.scale(4),
								{
									backgroundColor: '#E8E9FC',
									width: '14%',
								},
							]}
						/>
						<View style={[margin.top.small]}>
							<View style={[row.fill, padding.horizontal.medium, padding.top.small]}>
								<TextNative
									style={[
										text.bold.medium,
										text.size.scale(25),
										text.color.black,
										column.item.center,
									]}
								>
									{title}
								</TextNative>
								{icon && (
									<Icon name={icon} pack={iconPack} width={30} height={30} fill={color.black} />
								)}
							</View>
						</View>
					</View>
					{children && <View>{children}</View>}
				</View>
			</TouchableWithoutFeedback>
		</View>
	)
}

const RequestsItem: React.FC<messenger.contact.Entity> = ({ name, request, publicKey, id }) => {
	const { dispatch } = useNavigation()
	const _styles = useStylesList()
	const [{ border, column, flex, row, padding, text, background, color }] = useStyles()
	const discardContactRequest = Messenger.useDiscardContactRequest()
	const discard = () => discardContactRequest({ id })
	if (request.type !== messenger.contact.ContactRequestType.Outgoing) {
		return <Text>Error: This is not an outgoing request</Text>
	}
	return (
		<TouchableOpacity
			style={[_styles.tinyCard, border.shadow.medium, column.justify]}
			onPress={() =>
				dispatch(
					CommonActions.navigate({
						name: Routes.Main.RequestSent,
						params: {
							contact: {
								name,
								publicKey,
							},
						},
					}),
				)
			}
		>
			<ProceduralCircleAvatar
				style={[_styles.tinyAvatar]}
				seed={publicKey}
				size={70}
				diffSize={30}
			/>
			<Text style={[flex.tiny, text.align.center, padding.top.medium]}>{name}</Text>
			<Text
				category='c1'
				style={[padding.vertical.medium, text.align.center, text.size.tiny, text.color.grey]}
			>
				{request.state === 'sent' ? <FromNow date={request.sentDate} /> : 'Not sent yet'}
			</Text>
			<View style={[row.fill]}>
				<TouchableOpacity
					style={[_styles.tinyDiscardButton, border.scale(1), row.item.justify]}
					onPress={discard}
				>
					<Icon name='close-outline' width={20} height={20} fill={color.grey} />
				</TouchableOpacity>
				<TouchableOpacity
					disabled={!(request.state === 'sent')}
					style={[_styles.tinyAcceptButton, background.light.green, row.fill]}
				>
					<View style={[row.item.justify, padding.right.scale(3)]}>
						<Icon
							name='paper-plane-outline'
							width={17}
							height={17}
							fill={color.green}
							style={column.justify}
						/>
					</View>
					<Text style={[text.color.green, text.align.center, text.size.tiny, row.item.justify]}>
						Resend
					</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	)
}

const EmptyTab: React.FC<{}> = ({ children }) => {
	const [{ padding, background, row }] = useStyles()
	return <View style={[background.white, row.center, padding.bottom.medium]}>{children}</View>
}

const Requests: React.FC<{}> = () => {
	const [{ padding, background, column, text, opacity }, { scaleHeight }] = useStyles()
	const { isLandscape, isShortWindow, isGteIpadSize } = useStylesList()

	const requests = Messenger.useAccountContactsWithOutgoingRequests().filter(
		(contact) => !(contact.request.accepted || contact.request.discarded) && !contact.fake,
	)

	return requests.length >= 1 ? (
		<View style={[background.white]}>
			<View style={[background.white, padding.bottom.medium]}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{requests.map((req) => (
						<RequestsItem key={req.id} {...req} />
					))}
				</ScrollView>
			</View>
		</View>
	) : (
		<EmptyTab>
			<View
				style={[column.justify, { height: isLandscape && !isGteIpadSize ? 0 : 200 * scaleHeight }]}
			>
				{!isShortWindow && <EmptyContact width='75%' height='75%' style={[column.item.center]} />}
				<Text style={[text.color.grey, opacity(0.4)]}>You don't have any pending requests</Text>
			</View>
		</EmptyTab>
	)
}

const AddContact: React.FC<{}> = () => {
	const navigation = useNavigation()
	const _styles = useStylesList()
	const [{ padding, row, column, border, background, color, text, flex, height }] = useStyles()

	return (
		<View
			style={[background.white, _styles.isShortWindow ? padding.bottom.medium : padding.bottom.big]}
		>
			<View style={[row.center]}>
				<TouchableOpacity
					style={[
						background.red,
						padding.medium,
						border.radius.medium,
						column.justify,
						!_styles.isShortWindow && _styles.addContactItem,
					]}
					onPress={() => navigation.navigate.main.scan()}
				>
					<View
						style={[
							row.fill,
							!_styles.isShortWindow && height(45),
							!_styles.isShortWindow ? flex.justify.end : flex.justify.center,
							!_styles.isShortWindow ? flex.align.start : flex.align.center,
						]}
					>
						{!_styles.isShortWindow && (
							<Icon name='qr' pack='custom' width={38} height={38} fill={color.white} />
						)}
					</View>
					<View style={[row.fill]}>
						<Text numberOfLines={2} style={[text.color.white, _styles.addContactItemText]}>
							Scan QR code
						</Text>
						<View />
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						background.blue,
						padding.medium,
						border.radius.medium,
						column.justify,
						!_styles.isShortWindow && _styles.addContactItem,
					]}
					onPress={() => navigation.navigate.settings.myBertyId()}
				>
					<View
						style={[
							row.fill,
							!_styles.isShortWindow && height(45),
							!_styles.isShortWindow ? flex.justify.end : flex.justify.center,
							!_styles.isShortWindow ? flex.align.start : flex.align.center,
						]}
					>
						{!_styles.isShortWindow && (
							<Icon name='id' pack='custom' width={40} height={40} fill={color.white} />
						)}
					</View>
					<View style={[row.fill]}>
						<Text numberOfLines={2} style={[text.color.white, _styles.addContactItemText]}>
							Share my Berty ID
						</Text>
						<View />
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export const HomeModal: React.FC<{}> = () => {
	const navigation = useNavigation()
	const [{ absolute }] = useStyles()
	const { windowHeight } = useStylesList()

	const handleOnDrag = (e: Interactable.IDragEvent) => {
		if (e.nativeEvent.y >= Math.min(250, windowHeight * 0.9)) {
			navigation.goBack()
		}
	}
	return (
		<>
			<TouchableWithoutFeedback style={[StyleSheet.absoluteFill]} onPress={navigation.goBack}>
				<BlurView style={{ width: '100%', height: '100%' }} blurType='light' />
			</TouchableWithoutFeedback>
			<View style={[absolute.bottom, absolute.left, absolute.right]}>
				<Interactable.View
					verticalOnly={true}
					snapPoints={[{ x: 0 }, { x: -300 }]}
					onDrag={(e) => handleOnDrag(e)}
					boundaries={{ top: 0 }}
				>
					<Header title='Add contact' icon='user-plus' iconPack='custom' first>
						<AddContact />
					</Header>
					<Header title='Requests sent' icon='paper-plane-outline'>
						<Requests />
					</Header>
					<Header
						title='New group'
						icon='users'
						iconPack='custom'
						onPress={() => navigation.navigate.main.createGroup.createGroupAddMembers()}
					>
						<EmptyTab />
					</Header>
				</Interactable.View>
			</View>
		</>
	)
}
