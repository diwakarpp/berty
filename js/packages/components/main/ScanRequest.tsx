import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Layout } from 'react-native-ui-kitten'
import { useStyles } from '@berty-tech/styles'
import { Request } from '../shared-components/Request'
//import { Messenger } from '@berty-tech/hooks'

//
// Scan Request
//

export const ScanRequest: React.FC<{ route: any }> = ({ route }) => {
	const [{ flex, background, color, border, padding }] = useStyles()
	//const sendContactRequest = Messenger.useAccountSendContactRequest()
	return (
		<Layout style={[background.red, flex.tiny]}>
			<SafeAreaView style={[flex.tiny]}>
				<Request
					user={route.params.data}
					buttons={[
						{
							action: () => {}, //sendContactRequest(route.params.data),
							style: [background.light.blue, border.radius.scale(6), padding.small],
							title: 'ADD THIS CONTACT',
							titleColor: color.blue,
							icon: 'close-outline',
							iconColor: color.grey,
						},
					]}
				/>
			</SafeAreaView>
		</Layout>
	)
}
