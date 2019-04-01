import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Back from 'medulas-react-components/lib/components/Button/Back';
import Switch from 'medulas-react-components/lib/components/Switch';
import Tooltip from 'medulas-react-components/lib/components/Tooltip';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import { SIGNUP_ROUTE } from '../../paths';
import { getUserProfile } from '../../../logic/user';
import { UserData } from '../index';

export const SECOND_STEP_SIGNUP_ROUTE = `${SIGNUP_ROUTE}2`;

const getMnemonic = async (password: string): Promise<string> => {
  try {
    const profile = await getUserProfile(password);
    return profile.printableSecret(profile.wallets.value[0].id);
  } catch (err) {
    console.log('Error getting user profile');
    console.log(err);
    return 'No mnemonic available';
  }
};

export interface Props {
  readonly userData: UserData | null;
  readonly onHintPassword: () => void;
  readonly onBack: () => void;
}

const ShowPhraseForm = ({
  userData,
  onBack,
  onHintPassword,
}: Props): JSX.Element => {
  const [mnemonic, setMnemonic] = React.useState<string>('');

  const onShowMnemonic = async (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): Promise<void> => {
    if (checked) {
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setMnemonic(await getMnemonic(userData!.password));
      return;
    }

    setMnemonic('');
  };

  return (
    <PageLayout
      id={SECOND_STEP_SIGNUP_ROUTE}
      primaryTitle="New"
      title="Account"
    >
      <Block display="flex" justifyContent="space-between" alignItems="center">
        <Block display="flex" alignItems="center">
          <Block marginRight={1}>
            <Typography variant="subtitle2" inline>
              Activate Recovery Phrase?
            </Typography>
          </Block>
          <Tooltip>
            <Typography variant="body2">
              Your Recovery Phrase are 12 random words that are set in a
              particular order that acts as a tool to recover or back up your
              wallet on any platform.
            </Typography>
          </Tooltip>
        </Block>
        <Switch color="primary" onChange={onShowMnemonic} />
      </Block>

      <Block
        padding={2}
        marginTop={1}
        marginBottom={4}
        minHeight={24}
        border={1}
        borderColor="grey.300"
        borderRadius={5}
        bgcolor="grey.300"
      >
        <Typography variant="body1" inline>
          {mnemonic}
        </Typography>
      </Block>
      <Block display="flex" justifyContent="space-between">
        <Block width={120}>
          <Back fullWidth onClick={onBack}>
            Back
          </Back>
        </Block>
        <Block width={120}>
          <Button
            id="continue-to-hint-button"
            fullWidth
            onClick={onHintPassword}
          >
            Continue
          </Button>
        </Block>
      </Block>
    </PageLayout>
  );
};

export default ShowPhraseForm;
