import React from 'react';
import logo from './logo.svg';
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator, WithAuthenticatorProps, Button, Heading, Image, View, Card } from '@aws-amplify/ui-react';

function App({signOut}: WithAuthenticatorProps) {
  return (
    <View className="app">
      <Card>
        <Image src={logo} className='App-logo' alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);
