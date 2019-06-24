import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import Header from '../../components/Header';

const Dashboard = (): JSX.Element => {
  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header />
      <Hairline />
      <Block minWidth="100%" minHeight="100%">
        <Typography variant="h6">DASHBOARD VIEW</Typography>
      </Block>
    </Block>
  );
};

export default Dashboard;
